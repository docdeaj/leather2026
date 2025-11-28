
'use client';

import { collection, query, DocumentData, Query, addDoc, updateDoc } from 'firebase/firestore';
import type { Supplier } from '@/lib/types';
import { SupplierFormValues } from '@/components/admin/supplier-form';

/**
 * Creates a Firestore query for the suppliers collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'suppliers' collection.
 */
export function getSuppliersQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'suppliers'));
}

/**
 * Adds a new supplier to the 'suppliers' collection in Firestore.
 * @param firestore - The Firestore instance.
 * @param supplierData - The data for the new supplier from the form.
 */
export async function addSupplier(firestore: DocumentData, supplierData: SupplierFormValues) {
    const suppliersRef = collection(firestore, 'suppliers');
    const newSupplierRef = await addDoc(suppliersRef, supplierData);

    await updateDoc(newSupplierRef, {
        id: newSupplierRef.id
    });
    return newSupplierRef.id;
}
