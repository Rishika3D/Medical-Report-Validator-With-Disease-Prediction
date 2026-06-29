/**
 * Applies db/schema.sql to the configured database.
 * Usage: `npm run migrate` (from /backend).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";
import { logger } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");

  logger.info("Applying database schema...");
  await db.query(sql);
  logger.info("Database schema applied successfully");
  await db.pool.end();
}

migrate().catch((err) => {
  logger.error("Migration failed", { error: err.message });
  process.exit(1);
});
