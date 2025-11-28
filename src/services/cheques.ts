
'use client';

import { collection, query, DocumentData, Query } from 'firebase/firestore';

/**
 * Creates a Firestore query for the cheques collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'cheques' collection.
 */
export function getChequesQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'cheques'));
}
