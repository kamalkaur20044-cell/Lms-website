import express from 'express';
import { login, getMe, changePassword, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

export default router;
