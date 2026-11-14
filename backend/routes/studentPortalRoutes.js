import express from 'express';
import { getProfile, getCourses } from '../controllers/studentPortalController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.get('/profile', getProfile);
router.get('/courses', getCourses);

export default router;
