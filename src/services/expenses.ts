
'use client';

import { collection, query, DocumentData, Query } from 'firebase/firestore';

/**
 * Creates a Firestore query for the expenses collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'expenses' collection.
 */
export function getExpensesQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'expenses'));
}
