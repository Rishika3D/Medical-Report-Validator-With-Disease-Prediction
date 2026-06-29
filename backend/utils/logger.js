/**
 * Minimal dependency-free structured logger.
 *
 * Emits single-line JSON in production (easy to ship to log aggregators) and
 * a compact human-readable line in development. Controlled via:
 *   - LOG_LEVEL: error | warn | info | debug   (default: info)
 *   - NODE_ENV:  "production" switches to JSON output
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;
const isProd = process.env.NODE_ENV === "production";

function emit(level, message, meta) {
  if (LEVELS[level] > currentLevel) return;

  const timestamp = new Date().toISOString();

  if (isProd) {
    const line = { timestamp, level, message, ...(meta || {}) };
    const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
    stream.write(JSON.stringify(line) + "\n");
    return;
  }

  const icon = { error: "❌", warn: "⚠️ ", info: "ℹ️ ", debug: "🐛" }[level];
  const metaStr = meta && Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
  const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
  stream.write(`${icon} ${message}${metaStr}\n`);
}

export const logger = {
  error: (message, meta) => emit("error", message, meta),
  warn: (message, meta) => emit("warn", message, meta),
  info: (message, meta) => emit("info", message, meta),
  debug: (message, meta) => emit("debug", message, meta),
};

/**
 * Express middleware: logs method, path, status and latency for every request.
 */
export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    emit(level, `${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      durationMs: Math.round(durationMs * 10) / 10,
    });
  });
  next();
}

export default logger;
