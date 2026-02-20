import { createEmbedding } from "./embedding.service.js";
import { vectorStore, cosineSimilarity } from "./vector.store.js";

export async function retrieveContext(query, sessionId) {
  const queryEmbedding = await createEmbedding(query);

  const docs = await VectorStore.find({ sessionId });

  const scored = docs.map(doc => ({
    ...doc.toObject(),
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3);
}