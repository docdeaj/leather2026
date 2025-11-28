
'use client';

import { collection, query, DocumentData, Query, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export type InvoiceFormValues = {
    orderId: string;
    customerId: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    amount: number;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Void';
}

/**
 * Creates a Firestore query for the invoices collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'invoices' collection.
 */
export function getInvoicesQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'invoices'));
}

/**
 * Adds a new invoice to the 'invoices' collection in Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The UID of the user creating the invoice.
 * @param invoiceData - The data for the new invoice from the form.
 */
export async function addInvoice(firestore: DocumentData, userId: string, invoiceData: InvoiceFormValues) {
    const invoicesRef = collection(firestore, 'invoices');
    
    const newInvoiceData = {
        ...invoiceData,
        ownerId: userId,
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
    };

    const docRef = await addDoc(invoicesRef, newInvoiceData);

    await updateDoc(docRef, {
        id: docRef.id
    });

    return docRef.id;
}
