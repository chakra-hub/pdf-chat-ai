import winston from "winston"; // Import the winston logging library

export const logger = winston.createLogger({ // Create a new logger instance
  level: "info", // Set the minimum log level to 'info'
  format: winston.format.json(), // Format logs as JSON
  transports: [new winston.transports.Console()] // Output logs to the console
});
