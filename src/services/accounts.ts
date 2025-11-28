
'use client';

import { collection, query, DocumentData, Query } from 'firebase/firestore';

/**
 * Creates a Firestore query for the accounts collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'accounts' collection.
 */
export function getAccountsQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'accounts'));
}
