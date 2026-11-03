/**
 * Database maintenance script for auththrottles collection
 * --------------------------------------------------------
 * Fixes duplicate key errors on stale indexes (e.g. index: key_1 dup key: { key: null }).
 *
 * This script:
 * 1. Connects to MongoDB using Mongoose.
 * 2. Drops the stale "key_1" index if present (legacy schema index).
 * 3. Removes corrupted documents where key is null/empty or email is missing.
 *
 * Usage:
 *   cd backend
 *   npm run clean:throttle
 *   OR
 *   node scripts/clean-auththrottles-index.js
 */

import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI environment variable is required.");
  process.exit(1);
}

const COLLECTION = "auththrottles";
const STALE_INDEX = "key_1";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully.");

    const coll = mongoose.connection.collection(COLLECTION);

    // 1. Drop stale key_1 index if present
    try {
      await coll.dropIndex(STALE_INDEX);
      console.log(`Dropped stale index: ${STALE_INDEX}`);
    } catch (e) {
      if (e.code === 27 || e.codeName === "IndexNotFound") {
        console.log(`Stale index ${STALE_INDEX} does not exist (clean state).`);
      } else {
        throw e;
      }
    }

    // 2. Delete corrupt records
    const badFilter = {
      $or: [
        { key: null },
        { key: "" },
        { email: { $exists: false } },
        { email: null },
        { email: "" },
      ],
    };

    const result = await coll.deleteMany(badFilter);
    if (result.deletedCount > 0) {
      console.log(`Purged ${result.deletedCount} corrupted throttle record(s).`);
    } else {
      console.log("No corrupted records found.");
    }

    console.log("AuthThrottle cleanup completed successfully.");
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error("AuthThrottle cleanup failed:", err);
  process.exit(1);
});

