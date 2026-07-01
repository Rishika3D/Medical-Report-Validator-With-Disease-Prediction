import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Verify the Bearer token and attach the decoded user to the request.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

/**
 * Restrict a route to specific roles. Use after `protect`.
 *   router.post('/x', protect, authorize('doctor', 'admin'), handler)
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "You do not have permission to perform this action.",
    });
  }
  next();
};
