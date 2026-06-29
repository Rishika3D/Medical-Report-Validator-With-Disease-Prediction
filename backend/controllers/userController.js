import userService from "../services/userService.js";
import { validateSignup, validateLogin } from "../utils/validation.js";
import { logger } from "../utils/logger.js";

export const signup = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const errors = validateSignup({ userName, email, password });
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { user, token } = await userService.createUser({
      userName,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user,
      token,
    });
  } catch (err) {
    if (err.message === "User already exists") {
      return res
        .status(409)
        .json({ message: "An account with that username or email already exists." });
    }
    logger.error("Signup failed", { error: err.message });
    return res.status(500).json({ message: "Could not create account. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const errors = validateLogin({ userName, password });
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { user, token } = await userService.authenticateUser(userName, password);

    return res.status(200).json({
      message: "Signed in successfully",
      user,
      token,
    });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: "Incorrect username or password." });
    }
    logger.error("Login failed", { error: err.message });
    return res.status(500).json({ message: "Could not sign in. Please try again." });
  }
};
