import OpenAI from "openai"; 
// OpenAI-compatible client (OpenRouter, HF, etc.)

import { logger } from "../../logger.js"; 
// Central logger

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
}); 
// Connect to OpenRouter (free embeddings)

export async function createEmbedding(text) {
  try {
    const response = await client.embeddings.create({
      model: "text-embedding-3-large",
      input: text
    });

    return response.data[0].embedding;
  } catch (err) {
    logger.error({ type: "embedding_error", err });
    throw err;
  }
}
