import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;