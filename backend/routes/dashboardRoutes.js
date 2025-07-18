import express from 'express';
import { 
    getStudentDashboard, 
    getParentTeacherDashboard 
} from '../controllers/dashboardController.js';
import { protect, parentOrTeacher, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student', protect, studentOnly, getStudentDashboard);
router.get('/parent-teacher/:studentId', protect, parentOrTeacher, getParentTeacherDashboard);

export default router;
