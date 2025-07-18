import express from 'express';
import {
    createLesson,
    getLessonsByTopic,
    getLessonById,
    updateLesson,
    deleteLesson,
    markLessonAsComplete,
    checkLessonCompletionStatus
} from '../controllers/lessonController.js';
import { protect, adminOrTeacher, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, adminOrTeacher, createLesson);

router.route('/topic/:topicId')
    .get(protect, getLessonsByTopic);

router.route('/:id')
    .get(protect, getLessonById)
    .put(protect, adminOrTeacher, updateLesson)
    .delete(protect, adminOrTeacher, deleteLesson);

router.route('/:id/complete')
    .post(protect, studentOnly, markLessonAsComplete);

router.route('/:id/status')
  .get(protect, studentOnly, checkLessonCompletionStatus);

export default router;
