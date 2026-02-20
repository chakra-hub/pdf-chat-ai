import Groq from "groq-sdk"; 
import { config } from "../config/env.js"; 
import { logger } from "../logger.js"; 

const groq = new Groq({
    apiKey: config.GROQ_API_KEY
})

// A centralized AI gateway layer
export const callLLM = async ({messages}) => {
    try{
        let start = Date.now();
        const response = await groq.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages,
            stream:true
        })

        const latency = Date.now - start;

        logger.info({type:"llm call", latency})
        return response
    }
    catch(error) {
        logger.error({type:'llm error', error: error.message})
        throw error
    }
}

export const streamLLM = callLLM;
