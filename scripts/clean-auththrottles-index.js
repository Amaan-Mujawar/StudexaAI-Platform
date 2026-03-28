/**
 * One-time cleanup for auththrottles collection
 * -----------------------------------------------
 * Run when you see: E11000 duplicate key error collection: test.auththrottles index: key_1 dup key: { key: null }
 *
 * This script:
 * 1. Drops the stale "key_1" index (from an old schema that used a "key" field). Our throttle key is "email" only; null keys must never be allowed.
 * 2. Removes any documents where key is null or email is missing so the collection only has valid throttle records.
 *
 * Usage: node scripts/clean-auththrottles-index.js
 * Requires: MONGO_URI in env (e.g. from .env via dotenv or export)
 */

import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const COLLECTION = "auththrottles";
const STALE_INDEX = "key_1";

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const coll = db.collection(COLLECTION);

    // 1. Drop key_1 index if it exists (removes E11000 on key: null)
    try {
      await coll.dropIndex(STALE_INDEX);
      console.log(`Dropped index: ${STALE_INDEX}`);
    } catch (e) {
      if (e.code === 27 || e.codeName === "IndexNotFound") {
        console.log(`Index ${STALE_INDEX} does not exist (ok)`);
      } else {
        throw e;
      }
    }

    // 2. Delete corrupted documents: key is null/empty (causes E11000) or email missing
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
      console.log(`Deleted ${result.deletedCount} corrupted throttle record(s)`);
    } else {
      console.log("No corrupted records to delete");
    }

    console.log("Cleanup done.");
  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
