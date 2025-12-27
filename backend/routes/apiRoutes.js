import express from 'express';
import { analyzeReport } from '../controllers/reportController.js';
import { signup, login } from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// --- AI/Report Routes ---
// Protected: Only logged-in users can upload
// 'report_file' is the key name you must use in Postman/Frontend
router.post('/analyze', protect, upload.single('report_file'), analyzeReport);

export default router;