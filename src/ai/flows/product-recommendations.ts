'use server';

/**
 * @fileOverview An AI agent that provides product recommendations.
 *
 * - getProductRecommendations - A function that returns product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product for which recommendations are needed.'),
  productCategory: z.string().describe('The category of the product.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional: The user preferences to tailor the recommendations.'),
  numberOfRecommendations: z
    .number()
    .default(3)
    .describe('The number of product recommendations to return.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationSchema = z.object({
  id: z.string().describe('The unique identifier of the recommended product.'),
  name: z.string().describe('The name of the recommended product.'),
});

const ProductRecommendationsOutputSchema = z.array(ProductRecommendationSchema).describe('An array of product recommendations.');
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommendation engine.

  Given the description of a product, its category, and optional user preferences, you will return a list of product recommendations.

  Product Description: {{{productDescription}}}
  Product Category: {{{productCategory}}}
  User Preferences: {{{userPreferences}}}

  Return the recommended products as an array of objects, each containing the product 'id' and 'name'.
  You should return {{numberOfRecommendations}} products.
  Do not return any preamble or additional explanation. Just the JSON array.
`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
