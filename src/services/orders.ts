
'use client';

import {
  collection,
  doc,
  writeBatch,
  Firestore,
  serverTimestamp,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import type { CartItem, Order, OrderItem } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type ShippingDetails = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
}

/**
 * Creates a new order in Firestore, including all order items.
 * This function uses a batch write to ensure atomicity.
 * It now handles both online and POS orders.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @param cartItems - The items from the user's cart.
 * @param totalAmount - The total amount of the order.
 * @param shippingDetails - Optional shipping address for online orders. If not provided, it's a POS order.
 * @returns The ID of the newly created order.
 */
export async function createOrder(
  firestore: Firestore,
  userId: string,
  cartItems: CartItem[],
  totalAmount: number,
  shippingDetails?: ShippingDetails,
): Promise<string> {
  if (!userId) {
    throw new Error('User is not authenticated.');
  }
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty.');
  }

  const ordersRef = collection(firestore, 'orders');
  const newOrderRef = doc(ordersRef); // Create a new document reference with a unique ID.
  const orderId = newOrderRef.id;

  const batch = writeBatch(firestore);

  // 1. Create the main order document
  const finalShippingDetails = shippingDetails || {
      firstName: 'In-Store',
      lastName: 'Customer',
      address: 'Point of Sale',
      city: '',
      country: '',
      zip: '',
  };

  const newOrder: Omit<Order, 'id' | 'items'> = {
    customerId: userId,
    ownerId: userId, // Assign ownership
    orderDate: serverTimestamp(),
    amount: totalAmount,
    status: shippingDetails ? 'Confirmed' : 'Delivered', // Online orders are 'Confirmed', POS are 'Delivered'
    shippingAddress: finalShippingDetails,
  };
  batch.set(newOrderRef, newOrder);

  // 2. Create a document for each order item in the subcollection
  const orderItemsRef = collection(newOrderRef, 'orderItems');
  cartItems.forEach(item => {
    const newOrderItemRef = doc(orderItemsRef, item.id);
    const orderItemData: Omit<OrderItem, 'id' | 'orderId'> = {
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image
    };
    batch.set(newOrderItemRef, orderItemData);
  });
  
  // 3. If it's an online order, clear the user's cart in Firestore
  if (shippingDetails) {
    const cartRef = collection(firestore, 'users', userId, 'cart');
    const cartSnapshot = await getDocs(cartRef);
    cartSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
  }


  // 4. Commit the batch write
  await batch.commit().catch(error => {
    // Emit a contextual error if the batch write fails
    errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `orders/${orderId}`,
        operation: 'write',
        requestResourceData: { order: newOrder, items: cartItems }
    }));
    // Re-throw the original error to be caught by the calling function
    throw error;
  });

  // After committing, update the order document with its own ID
  await updateDoc(newOrderRef, { id: orderId });


  return orderId;
}

/**
 * Creates a Firestore query for a user's orders.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the current user.
 * @returns A query for the user's orders collection.
 */
export function getOrdersQuery(firestore: Firestore, userId: string) {
    return query(collection(firestore, 'orders'), where('customerId', '==', userId));
}

/**
 * Creates a Firestore query for all items in a specific order.
 * @param firestore - The Firestore instance.
 * @param orderId - The ID of the order.
 * @returns A query for the order's items subcollection.
 */
export function getOrderItemsQuery(firestore: Firestore, orderId: string) {
  return collection(firestore, 'orders', orderId, 'orderItems');
}

/**
 * Creates a Firestore query for all orders (for admin).
 * @param firestore - The Firestore instance.
 * @returns A query for the orders collection.
 */
export function getAllOrdersQuery(firestore: Firestore) {
  return collection(firestore, 'orders');
}


/**
 * Updates the status of an existing order in Firestore.
 * @param firestore - The Firestore instance.
 * @param orderId - The ID of the order to update.
 * @param newStatus - The new status for the order.
 */
export async function updateOrderStatus(firestore: Firestore, orderId: string, newStatus: Order['status']) {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
}
