import pg from "pg";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const { Pool } = pg;

// Support both a single DATABASE_URL (managed Postgres / Render / Railway) and
// discrete PG* variables (local dev). DATABASE_URL takes precedence when set.
const useConnectionString = Boolean(process.env.DATABASE_URL);

const sslRequired =
  process.env.PGSSL === "true" || process.env.NODE_ENV === "production";

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
      }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGNAME,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT) || 5432,
        ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
      }
);

pool.on("error", (err) => {
  logger.error("Unexpected PostgreSQL pool error", { error: err.message });
});

/**
 * Thin query wrapper so callers don't depend on the pg client shape directly.
 */
export async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Verify connectivity once at startup. Returns a status object; never throws.
 */
export async function checkConnection() {
  try {
    await pool.query("SELECT 1");
    logger.info("Connected to PostgreSQL");
    return { connected: true };
  } catch (err) {
    logger.error("PostgreSQL connection failed", { error: err.message });
    return { connected: false, error: err.message };
  }
}

export default { query, checkConnection, pool };
