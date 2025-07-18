import asyncHandler from 'express-async-handler';
import UserReward from '../models/userRewardModel.js';
import Reward from '../models/rewardModel.js';

// @desc    Get all rewards (for teachers)
// @route   GET /api/rewards/all
// @access  Private/Teacher
const getAllRewards = asyncHandler(async (req, res) => {
    const rewards = await Reward.find({});
    res.json(rewards);
});

// @desc    Get a single reward by ID
// @route   GET /api/rewards/:id
// @access  Private/Teacher
const getRewardById = asyncHandler(async (req, res) => {
    const reward = await Reward.findById(req.params.id);
    if(reward) {
        res.json(reward);
    } else {
        res.status(404);
        throw new Error('Reward not found');
    }
});


// @desc    Create a reward
// @route   POST /api/rewards
// @access  Private/Teacher
const createReward = asyncHandler(async (req, res) => {
  const { name, description, icon, criteria } = req.body;

  const reward = new Reward({
    name,
    description,
    icon,
    criteria,
  });

  const createdReward = await reward.save();
  res.status(201).json(createdReward);
});

// @desc    Update a reward
// @route   PUT /api/rewards/:id
// @access  Private/Teacher
const updateReward = asyncHandler(async (req, res) => {
    const { name, description, icon, criteria } = req.body;
    const reward = await Reward.findById(req.params.id);

    if(reward) {
        reward.name = name || reward.name;
        reward.description = description || reward.description;
        reward.icon = icon || reward.icon;
        reward.criteria = criteria || reward.criteria;

        const updatedReward = await reward.save();
        res.json(updatedReward);
    } else {
        res.status(404);
        throw new Error('Reward not found');
    }
});

// @desc    Delete a reward
// @route   DELETE /api/rewards/:id
// @access  Private/Teacher
const deleteReward = asyncHandler(async (req, res) => {
    const reward = await Reward.findById(req.params.id);

    if (reward) {
        await reward.deleteOne();
        res.json({ message: 'Reward removed' });
    } else {
        res.status(404);
        throw new Error('Reward not found');
    }
});


// @desc    Get logged in user's rewards
// @route   GET /api/rewards
// @access  Private/Student
const getMyRewards = asyncHandler(async (req, res) => {
  const rewards = await UserReward.find({ student: req.user._id })
    .populate('reward', 'name description icon')
    .sort({ dateEarned: -1 });

  res.json(rewards);
});

export { getAllRewards, getRewardById, createReward, updateReward, deleteReward, getMyRewards };
