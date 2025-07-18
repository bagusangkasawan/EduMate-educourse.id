import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js';
import Quiz from '../models/quizModel.js';

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({});
  res.json(topics);
});

// @desc    Get a single topic by ID
// @route   GET /api/topics/:id
// @access  Public
const getTopicById = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (topic) {
    res.json(topic);
  } else {
    res.status(404);
    throw new Error('Topic not found');
  }
});


// @desc    Create a topic
// @route   POST /api/topics
// @access  Private/Teacher
const createTopic = asyncHandler(async (req, res) => {
  const { title, description, coverImage } = req.body;

  const topic = new Topic({
    title,
    description,
    coverImage,
  });

  const createdTopic = await topic.save();
  res.status(201).json(createdTopic);
});

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Teacher
const updateTopic = asyncHandler(async (req, res) => {
    const { title, description, coverImage } = req.body;
    
    const topic = await Topic.findById(req.params.id);

    if (topic) {
        topic.title = title || topic.title;
        topic.description = description || topic.description;
        topic.coverImage = coverImage || topic.coverImage;

        const updatedTopic = await topic.save();
        res.json(updatedTopic);
    } else {
        res.status(404);
        throw new Error('Topic not found');
    }
});

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Teacher
const deleteTopic = asyncHandler(async (req, res) => {
    const topic = await Topic.findById(req.params.id);

    if (topic) {
        // Optional: Also delete quizzes associated with this topic
        await Quiz.deleteMany({ topic: topic._id });
        await topic.deleteOne(); // Mongoose v6+
        res.json({ message: 'Topic removed' });
    } else {
        res.status(404);
        throw new Error('Topic not found');
    }
});


export { getTopics, getTopicById, createTopic, updateTopic, deleteTopic };
