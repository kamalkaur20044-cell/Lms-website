import express from 'express';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public route — no auth needed
router.get('/public', getCourses);

// Protected routes — admin only
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', getCourses);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
