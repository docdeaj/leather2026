'use client';

import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import type { Product, CartItem } from '@/lib/types';
import { setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

/**
 * Adds a product to the user's cart or updates its quantity if it already exists.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @param product - The product to add to the cart.
 * @param quantity - The quantity to add.
 */
export async function addToCart(
  firestore: Firestore,
  userId: string,
  product: Product,
  quantity: number
) {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }
  if (!product || !product.id) {
    throw new Error('Invalid product data.');
  }

  const cartRef = collection(firestore, 'users', userId, 'cart');
  const cartItemRef = doc(cartRef, product.id);

  const docSnap = await getDoc(cartItemRef);

  if (docSnap.exists()) {
    // If item already exists, update its quantity
    await updateDoc(cartItemRef, {
        quantity: increment(quantity)
    });
  } else {
    // If item doesn't exist, create a new document
    const newCartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity,
    };
    await setDoc(cartItemRef, newCartItem, {});
  }
}

/**
 * Updates the quantity of a specific item in the user's cart.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @param productId - The ID of the product to update.
 * @param newQuantity - The new quantity for the product.
 */
export function updateCartItemQuantity(
  firestore: Firestore,
  userId: string,
  productId: string,
  newQuantity: number
) {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }
  if (newQuantity < 1) {
    // If quantity drops below 1, remove the item
    removeCartItem(firestore, userId, productId);
    return;
  }
  const cartItemRef = doc(firestore, 'users', userId, 'cart', productId);
  updateDocumentNonBlocking(cartItemRef, { quantity: newQuantity });
}

/**
 * Removes an item completely from the user's cart.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @param productId - The ID of the product to remove.
 */
export function removeCartItem(
  firestore: Firestore,
  userId: string,
  productId: string
) {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }
  const cartItemRef = doc(firestore, 'users', userId, 'cart', productId);
  deleteDocumentNonBlocking(cartItemRef);
}

/**
 * Creates a Firestore query for the user's cart.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @returns A query for the user's cart collection.
 */
export function getCartQuery(firestore: Firestore, userId: string) {
    return collection(firestore, 'users', userId, 'cart');
}
