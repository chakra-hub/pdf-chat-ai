import express from "express";
import { streamLLM } from "../services/llm.service.js";
import { retrieveContext } from "../services/rag/rag.service.js";

const router = express.Router();

router.post("/", async (req, res) => {

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Get latest user question (last message)
  const lastUserMessage = messages[messages.length - 1].content;

  // Retrieve RAG context only for latest question
  const { sessionId, messages } = req.body;

const contextChunks = await retrieveContext(lastUserMessage.content, sessionId);
  const context = contextChunks.map(c => c.text).join("\n");

  // Build final message array
  const finalMessages = [
    {
      role: "system",
      content: `Answer using only the context below.\n\n${context}`
    },
    ...messages
  ];

  const stream = await streamLLM({ messages: finalMessages });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      res.write(`data: ${token}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});

export default router;