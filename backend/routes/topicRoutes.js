import express from 'express';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../controllers/topicController.js';
import { protect, adminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTopics)
    .post(protect, adminOrTeacher, createTopic);

router.route('/:id')
    .get(getTopicById)
    .put(protect, adminOrTeacher, updateTopic)
    .delete(protect, adminOrTeacher, deleteTopic);

export default router;
