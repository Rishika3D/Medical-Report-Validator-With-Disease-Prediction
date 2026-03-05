import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';

const userService = {
    createUser: async ({ userName, password }) => {
        // Check if user already exists
        const existing = await db.query(
            'SELECT id FROM users WHERE username = $1',
            [userName]
        );

        if (existing.rows.length > 0) {
            throw new Error("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user and return id + username
        const result = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [userName, hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, userName: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
        );

        return { user: { id: user.id, userName: user.username }, token };
    },

    authenticateUser: async (userName, password) => {
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [userName]
        );

        if (result.rows.length === 0) {
            throw new Error("Invalid credentials");
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user.id, userName: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
        );

        return { user: { id: user.id, userName: user.username }, token };
    }
};

export default userService;
