import express from 'express';
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzesByTopic,
  getQuizById,
  getQuizForReview,
  submitQuiz,
} from '../controllers/quizController.js';
import { protect, studentOnly, adminOrTeacher, parentOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, adminOrTeacher, createQuiz);

router.route('/topic/:topicId')
    .get(protect, getQuizzesByTopic);

// Rute ini sekarang bisa diakses oleh semua role yang login,
// logika pemisahan data ada di controller
router.route('/:id')
    .get(protect, getQuizById) 
    .put(protect, adminOrTeacher, updateQuiz)
    .delete(protect, adminOrTeacher, deleteQuiz);
    
// Rute baru khusus untuk review oleh parent/teacher
router.route('/:id/review')
    .get(protect, parentOrTeacher, getQuizForReview);
    
router.route('/:id/submit')
    .post(protect, studentOnly, submitQuiz);

export default router;
