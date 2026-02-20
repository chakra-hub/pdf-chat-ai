import express from "express"; // Import Express framework
import cors from "cors"; // Import CORS middleware
import { logger } from "./logger.js"; // Import the logger
import streamRoutes from "./routes/chat.stream.routes.js";
import uploadRoutes from "./routes/upload.routes.js";



const app = express(); // Create an Express application instance

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests
app.use((req, res, next) => { // Middleware to log each request
  logger.info({ path: req.path, method: req.method }); // Log request path and method
  next(); // Pass control to the next middleware
});
app.use("/api/chat/stream", streamRoutes);
app.use("/api/upload", uploadRoutes);


export default app; // Export the Express app instance
