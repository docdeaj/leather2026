
'use client';

import { collection, query, DocumentData, Query, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { PurchaseOrderFormValues } from '@/components/admin/purchase-order-form';


/**
 * Creates a Firestore query for the purchaseOrders collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'purchaseOrders' collection.
 */
export function getPurchaseOrdersQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'purchaseOrders'));
}


/**
 * Adds a new purchase order to the 'purchaseOrders' collection in Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The UID of the user creating the purchase order.
 * @param poData - The data for the new purchase order from the form.
 * @param totalAmount - The calculated total amount of the order.
 */
export async function addPurchaseOrder(
    firestore: DocumentData, 
    userId: string, 
    poData: PurchaseOrderFormValues,
    totalAmount: number
) {
  const purchaseOrdersRef = collection(firestore, 'purchaseOrders');
  const newPurchaseOrderData = {
    ...poData,
    ownerId: userId,
    amount: totalAmount,
  };

  const docRef = await addDoc(purchaseOrdersRef, {
      ...newPurchaseOrderData,
      expectedDelivery: poData.expectedDelivery // Use the client-side date for the initial write
  });

  // Now, update with the server timestamp for consistency and accuracy
  // This approach ensures the document exists immediately with a valid date, then gets corrected
  await updateDoc(docRef, {
      id: docRef.id,
  });
  
  return docRef.id;
}
