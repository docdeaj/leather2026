'use server';

/**
 * @fileOverview Provides AI chatbot support for answering user questions and helping them find products.
 *
 * - aiChatbotSupport - A function that handles the chatbot support process.
 * - AIChatbotSupportInput - The input type for the aiChatbotSupport function.
 * - AIChatbotSupportOutput - The return type for the aiChatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { productSearchTool } from '@/services/ai-tools';

const AIChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});
export type AIChatbotSupportInput = z.infer<typeof AIChatbotSupportInputSchema>;

const AIChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
});
export type AIChatbotSupportOutput = z.infer<typeof AIChatbotSupportOutputSchema>;

export async function aiChatbotSupport(input: AIChatbotSupportInput): Promise<AIChatbotSupportOutput> {
  return aiChatbotSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotSupportPrompt',
  input: {schema: AIChatbotSupportInputSchema},
  output: {schema: AIChatbotSupportOutputSchema},
  tools: [productSearchTool],
  prompt: `You are an AI chatbot for 'M Leather Hub', a premium leather goods store. Your goal is to assist users with their questions about products and help them find what they need.

  **Your Task:**
  1.  **Be Friendly and Professional:** Maintain a helpful and approachable tone.
  2.  **Use Your Tools:** When a user asks about a specific product, its price, or whether it's in stock (availability), you MUST use the \`productSearchTool\` to get real-time information from the store's inventory.
  3.  **Answer Based on Tool Output:**
      - If the tool returns one or more products, list them for the user with their name, price, and stock status (e.g., "In Stock", "Low Stock", "Out of Stock").
      - If the tool returns an empty array, it means the product was not found. Politely inform the user that you couldn't find that specific item and suggest they browse the collection or try a different search.
  4.  **General Questions:** For general questions not related to specific products (e.g., "What is your return policy?"), answer politely based on your general knowledge of an e-commerce store.
  5.  **Be Honest:** If you cannot answer a question, politely state that you don't have the information.
  6.  **Keep it Concise:** Provide clear and brief responses.

  Here is the user's query:
  "{{{query}}}"

  Generate a helpful response based on these instructions.
  `,
});

const aiChatbotSupportFlow = ai.defineFlow(
  {
    name: 'aiChatbotSupportFlow',
    inputSchema: AIChatbotSupportInputSchema,
    outputSchema: AIChatbotSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
