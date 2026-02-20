import { callLLM } from "./llm.service.js"; 
// Central LLM gateway (Groq, fallback, logging)

import { retrieveContext } from "./rag/rag.service.js"; 
// RAG engine to fetch relevant document chunks

import { logger } from "../logger.js"; 
// Central logger

const sessions = {}; 
// In-memory session store for chat memory
// Key: sessionId → Value: message history
export async function chat({ sessionId, userMessage }) {

  if (!sessions[sessionId]) {
    sessions[sessionId] = []; 
  }

  sessions[sessionId].push({
    role: "user",
    content: userMessage
  });

    const contextChunks = await retrieveContext(userMessage);

    const contextText = contextChunks.map(c => c.text).join("\n");

    const messages = [
    {
      role: "system",
      content: `You must answer ONLY using the context below:\n\n${contextText}`
    },
    ...sessions[sessionId]
  ];

  const response = await callLLM({ messages});
  const reply = response.choices[0].message.content;
  sessions[sessionId].push({
    role: "assistant",
    content: reply
  });

    logger.info({
    type: "chat",
    sessionId,
    question: userMessage,
    chunksUsed: contextChunks.map(c => c.text)
  });

    return {
    reply,
    sources: contextChunks
  };
}