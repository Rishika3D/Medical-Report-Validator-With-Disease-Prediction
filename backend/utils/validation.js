/**
 * Lightweight, dependency-free validators that return user-friendly messages.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;

export function validateSignup({ userName, email, password }) {
  const errors = [];

  if (!userName || !USERNAME_RE.test(userName)) {
    errors.push(
      "Username must be 3–30 characters (letters, numbers, dot, dash, underscore)."
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    errors.push("Please provide a valid email address.");
  }
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  return errors;
}

export function validateLogin({ userName, password }) {
  const errors = [];
  if (!userName) errors.push("Username is required.");
  if (!password) errors.push("Password is required.");
  return errors;
}
