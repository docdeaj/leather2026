'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import type { Product } from '@/lib/types';

const ProductSearchInputSchema = z.object({
  query: z.string().describe('The user\'s query about a product, e.g., "leather wallet" or "artisan belt".'),
});

const ProductSearchOutputSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    stock: z.number(),
    status: z.string(),
  })
);

export const productSearchTool = ai.defineTool(
  {
    name: 'productSearch',
    description: 'Search for products in the M Leather Hub inventory. Use this to check for product availability, pricing, or details when a user asks about a specific item.',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    console.log(`[productSearchTool] Received query: ${input.query}`);
    const { firestore } = initializeFirebase();
    const productsRef = collection(firestore, 'products');

    // A simple search: check if the name contains the query string (case-insensitive)
    // This is a limitation of Firestore, for more complex search, an external service like Algolia is better.
    // For this example, we will fetch all and filter in memory.
    const q = query(productsRef, where('status', '==', 'Published'));
    
    try {
      const snapshot = await getDocs(q);
      const allProducts = snapshot.docs.map(doc => doc.data() as Product);

      const searchResults = allProducts
        .filter(p => p.name.toLowerCase().includes(input.query.toLowerCase()))
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          status: p.status,
        }));

      console.log(`[productSearchTool] Found ${searchResults.length} products.`);
      return searchResults;

    } catch (e) {
        console.error('[productSearchTool] Firestore query failed:', e);
        return []; // Return empty array on error
    }
  }
);
