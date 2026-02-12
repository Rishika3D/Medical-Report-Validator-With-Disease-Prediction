import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { signup, login } from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';
// import { protect } from '../middleware/authMiddleware.js'; // Helper if you have it

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// --- Report Routes ---
router.post('/reports/submit', upload.single('report'), reportController.submitMedicalReport);
router.post('/reports/verify', upload.single('report'), reportController.validateCertificate);
router.post('/reports/repudiate', reportController.repudiateDisease);

export default router;