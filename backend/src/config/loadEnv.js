/**
 * Load .env before any other app code. Must be the first import in server.js
 * so that process.env.MONGO_URI (and others) are set when rate-limit middleware
 * and DB code are loaded—otherwise the rate limiter would use in-memory store
 * and the server could crash if middleware expected a valid MONGO_URI.
 */
import dotenv from "dotenv";
dotenv.config();
