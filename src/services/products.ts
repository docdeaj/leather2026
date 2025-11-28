
import { collection, query, getDocs, Query, DocumentData, where, limit, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductFormValues } from '@/components/admin/product-form';
import { initializeFirebase } from '@/firebase/init';


/**
 * Creates a Firestore query for the products collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'products' collection.
 */
export function getProductsQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'products'));
}

/**
 * Fetches a specified number of featured products.
 * @param count - The number of products to fetch.
 * @returns A promise that resolves to an array of products.
 */
export async function getFeaturedProducts(count: number): Promise<Product[]> {
    const { firestore } = initializeFirebase();
    const productsRef = collection(firestore, 'products');
    // Removed orderBy('sku', 'desc') to prevent missing index error
    const q = query(productsRef, where('status', '==', 'Published'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Product[];
}


/**
 * Creates a Firestore query for related products based on category.
 * @param firestore - The Firestore instance.
 * @param category - The category to filter by.
 * @param currentProductId - The ID of the current product to exclude.
 * @returns A query for related products.
 */
export function getRelatedProductsQuery(firestore: DocumentData, category: string, currentProductId: string): Query<DocumentData> {
  return query(
    collection(firestore, 'products'),
    where('category', '==', category),
    where('id', '!=', currentProductId),
    limit(4)
  );
}


/**
 * Adds a new product to the 'products' collection in Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The UID of the user creating the product.
 * @param productData - The data for the new product from the form.
 */
export async function addProduct(firestore: DocumentData, userId: string, productData: ProductFormValues) {
  const productsRef = collection(firestore, 'products');
  const newProductData = {
    ...productData,
    ownerId: userId,
  };
  const newProductRef = await addDoc(productsRef, newProductData);
  // Now update the document to include its own ID.
  await updateDoc(newProductRef, {
    id: newProductRef.id
  });
  return newProductRef.id;
}


/**
 * Updates an existing product in the 'products' collection in Firestore.
 * @param firestore - The Firestore instance.
 * @param productId - The ID of the product to update.
 * @param productData - The updated data for the product.
 */
export async function updateProduct(firestore: DocumentData, productId: string, productData: Partial<ProductFormValues>) {
    const productRef = doc(firestore, 'products', productId);
    await updateDoc(productRef, productData);
}
