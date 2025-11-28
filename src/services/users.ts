
'use client';

import { collection, query, DocumentData, Query, doc, updateDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

/**
 * Creates a Firestore query for the users collection.
 * @param firestore - The Firestore instance.
 * @returns A query for the 'users' collection.
 */
export function getAllUsersQuery(firestore: DocumentData): Query<DocumentData> {
  return query(collection(firestore, 'users'));
}

/**
 * Updates the role of a user in Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user to update.
 * @param newRole - The new role to assign to the user.
 */
export async function updateUserRole(firestore: DocumentData, userId: string, newRole: User['role']) {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, { role: newRole });
}


/**
 * Updates the status of a user in Firestore.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user to update.
 * @param newStatus - The new status to assign to the user.
 */
export async function updateUserStatus(firestore: DocumentData, userId: string, newStatus: User['status']) {
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, { status: newStatus });
}
