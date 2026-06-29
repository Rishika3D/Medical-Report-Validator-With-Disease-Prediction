import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/db.js";

const SALT_ROUNDS = 12;
const VALID_ROLES = new Set(["patient", "doctor", "admin"]);

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(
    { id: user.id, userName: user.username, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(row) {
  return { id: row.id, userName: row.username, email: row.email, role: row.role };
}

const userService = {
  createUser: async ({ userName, email, password, role = "patient" }) => {
    const normalizedRole = VALID_ROLES.has(role) ? role : "patient";

    const existing = await db.query(
      "SELECT id FROM users WHERE username = $1 OR (email IS NOT NULL AND email = $2)",
      [userName, email || null]
    );
    if (existing.rows.length > 0) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role`,
      [userName, email || null, passwordHash, normalizedRole]
    );

    const user = result.rows[0];
    return { user: toPublicUser(user), token: signToken(user) };
  },

  authenticateUser: async (userName, password) => {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [userName]
    );
    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return { user: toPublicUser(user), token: signToken(user) };
  },
};

export default userService;
