import asyncHandler from 'express-async-handler';
import Lesson from '../models/lessonModel.js';
import Progress from '../models/progressModel.js';

// @desc    Create a lesson
// @route   POST /api/lessons
// @access  Private/Teacher
const createLesson = asyncHandler(async (req, res) => {
    const { title, content, topic } = req.body;
    const lesson = new Lesson({ title, content, topic, user: req.user._id });
    const createdLesson = await lesson.save();
    res.status(201).json(createdLesson);
});

// @desc    Get all lessons for a topic
// @route   GET /api/lessons/topic/:topicId
// @access  Private
const getLessonsByTopic = asyncHandler(async (req, res) => {
    const lessons = await Lesson.find({ topic: req.params.topicId }).select('title _id');
    res.json(lessons);
});

// @desc    Get a single lesson by ID
// @route   GET /api/lessons/:id
// @access  Private
const getLessonById = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (lesson) {
        res.json(lesson);
    } else {
        res.status(404);
        throw new Error('Materi tidak ditemukan');
    }
});

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private/Teacher
const updateLesson = asyncHandler(async (req, res) => {
    const { title, content, topic } = req.body;
    const lesson = await Lesson.findById(req.params.id);
    if (lesson) {
        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.topic = topic || lesson.topic;
        const updatedLesson = await lesson.save();
        res.json(updatedLesson);
    } else {
        res.status(404);
        throw new Error('Materi tidak ditemukan');
    }
});

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Teacher
const deleteLesson = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (lesson) {
        await lesson.deleteOne();
        await Progress.deleteMany({ item: lesson._id }); // Hapus juga progres terkait
        res.json({ message: 'Materi berhasil dihapus' });
    } else {
        res.status(404);
        throw new Error('Materi tidak ditemukan');
    }
});

// @desc    Mark a lesson as complete for a student
// @route   POST /api/lessons/:id/complete
// @access  Private/Student
const markLessonAsComplete = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
        res.status(404);
        throw new Error('Materi tidak ditemukan');
    }

    const existingProgress = await Progress.findOne({ student: req.user._id, item: lesson._id });
    if (existingProgress) {
        return res.json({ message: 'Materi sudah pernah diselesaikan.' });
    }

    const progress = await Progress.create({
        student: req.user._id,
        progressType: 'lesson',
        item: lesson._id,
        onModel: 'Lesson',
        topic: lesson.topic,
    });

    res.status(201).json({ message: 'Materi berhasil ditandai selesai.', progress });
});

// @desc    Check if the student has completed the lesson
// @route   GET /api/lessons/:id/status
// @access  Private/Student
const checkLessonCompletionStatus = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
        res.status(404);
        throw new Error('Materi tidak ditemukan');
    }

    const progress = await Progress.findOne({
        student: req.user._id,
        item: lesson._id,
        progressType: 'lesson',
    });

    res.json({ completed: !!progress });
});

export { createLesson, getLessonsByTopic, getLessonById, updateLesson, deleteLesson, markLessonAsComplete, checkLessonCompletionStatus };
