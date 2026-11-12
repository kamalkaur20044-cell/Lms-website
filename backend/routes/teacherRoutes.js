import express from 'express';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', getTeachers);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
