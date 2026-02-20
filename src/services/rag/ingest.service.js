export async function ingestText(text, sessionId) {
  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    await VectorStore.create({
      sessionId,
      text: chunk,
      embedding
    });
  }
}