
'use client';

import { collection, query, DocumentData, Query } from 'firebase/firestore';

/**
 * Creates a Firestore query for the customers collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'customers' collection.
 */
export function getCustomersQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'customers'));
}
