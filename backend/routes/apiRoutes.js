import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { signup, login } from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// --- Report Routes (protected) ---
router.post('/reports/submit', protect, upload.single('report'), reportController.submitMedicalReport);
router.post('/reports/verify', protect, upload.single('report'), reportController.validateCertificate);
router.post('/reports/repudiate', protect, reportController.repudiateDisease);

export default router;