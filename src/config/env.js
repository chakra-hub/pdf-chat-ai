import dotenv from 'dotenv'
dotenv.config();

export const config = {
    PORT: process.env.PORT || 3001,
    GROQ_API_KEY : process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
}