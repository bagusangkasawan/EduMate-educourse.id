import express from 'express';
import {
  getAllRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  getMyRewards,
} from '../controllers/rewardController.js';
import { protect, studentOnly, adminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, studentOnly, getMyRewards)
    .post(protect, adminOrTeacher, createReward);

router.route('/all').get(protect, adminOrTeacher, getAllRewards);

router.route('/:id')
    .get(protect, adminOrTeacher, getRewardById)
    .put(protect, adminOrTeacher, updateReward)
    .delete(protect, adminOrTeacher, deleteReward);

export default router;
