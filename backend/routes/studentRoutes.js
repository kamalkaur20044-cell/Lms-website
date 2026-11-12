import express from 'express';
import {
  getStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// GET /api/students - Get all students
router.get('/', getStudents);

// POST /api/students - Create new student
router.post('/', createStudent);

// GET /api/students/:id - Get single student
router.get('/:id', getStudent);

// PUT /api/students/:id - Update student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', deleteStudent);

export default router;
