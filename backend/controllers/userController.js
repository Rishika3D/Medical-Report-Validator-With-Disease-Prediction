import userService from '../services/userService.js';

export const signup = async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Validation
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Call Service
        const { user, token } = await userService.createUser({ userName, password });

        // Success Response
        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });

    } catch (err) {
        console.error(err);
        // Handle "User already exists" specifically
        if (err.message === "User already exists") {
            return res.status(409).json({ message: err.message });
        }
        res.status(500).json({ message: "Signup failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body; // Fixed res.body -> req.body

        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Call Service
        const { user, token } = await userService.authenticateUser(userName, password);

        res.status(200).json({
            message: "Login successful",
            user,
            token
        });

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid credentials" });
    }
};