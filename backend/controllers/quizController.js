import asyncHandler from 'express-async-handler';
import Quiz from '../models/quizModel.js';
import Progress from '../models/progressModel.js';
import Reward from '../models/rewardModel.js';
import UserReward from '../models/userRewardModel.js';

// Fungsi yang sudah ada (create, update, delete) tetap di atas
// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = asyncHandler(async (req, res) => {
    const { title, topic, questions } = req.body;
    const quiz = new Quiz({ title, topic, questions, user: req.user._id });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
});

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher
const updateQuiz = asyncHandler(async (req, res) => {
    const { title, topic, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        quiz.title = title || quiz.title;
        quiz.topic = topic || quiz.topic;
        quiz.questions = questions || quiz.questions;
        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        await quiz.deleteOne();
        res.json({ message: 'Quiz removed' });
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

const checkAndAwardBadges = async (studentId, { score, topic: topicId }) => {
  const earned = [];
  if (score === 100) {
    const reward = await Reward.findOne({ 'criteria.type': 'perfect_score' });
    const alreadyRewarded = reward && await UserReward.findOne({ student: studentId, reward: reward._id });
    if (reward && !alreadyRewarded) {
      await UserReward.create({ student: studentId, reward: reward._id });
      earned.push(reward);
    }
  }
  const totalQuizzes = await Quiz.countDocuments({ topic: topicId });
  const completedQuizzes = await Progress.countDocuments({
    student: studentId,
    topic: topicId,
    progressType: 'quiz',
    onModel: 'Quiz'
  });

  if (totalQuizzes > 0 && totalQuizzes === completedQuizzes) {
    const reward = await Reward.findOne({ 'criteria.type': 'topic_completion', 'criteria.topicId': topicId.toString() });
    const alreadyRewarded = reward && await UserReward.findOne({ student: studentId, reward: reward._id });
    if (reward && !alreadyRewarded) {
      await UserReward.create({ student: studentId, reward: reward._id });
      earned.push(reward);
    }
  }
  return earned;
};

// @desc    Get all quizzes for a topic
// @route   GET /api/quizzes/topic/:topicId
// @access  Private
const getQuizzesByTopic = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ topic: req.params.topicId }).select('title _id');
  res.json(quizzes);
});

// @desc    Get a quiz by ID (for student or teacher edit)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (quiz) {
    // Siswa tidak boleh melihat jawaban yang benar saat mengambil data kuis
    if (req.user.role === 'student') {
        const quizForStudent = quiz.toObject();
        quizForStudent.questions.forEach(q => {
            delete q.correctAnswer;
        });
        return res.json(quizForStudent);
    }
    // Guru atau Parent bisa melihat semua data (termasuk untuk edit)
    res.json(quiz);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Get a quiz for review (for parents/teachers)
// @route   GET /api/quizzes/:id/review
// @access  Private (Parent/Teacher)
const getQuizForReview = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).populate('topic', 'title');
    if (quiz) {
        res.json(quiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});


// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers, timeSpent } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404); throw new Error('Quiz not found');
  }
  let correct = 0;
  const detailed = quiz.questions.map((q) => {
    const selected = answers[q._id.toString()];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correct++;
    return { questionText: q.questionText, selectedAnswer: selected || 'Tidak dijawab', isCorrect };
  });
  const finalScore = (correct / quiz.questions.length) * 100;
  
  const existingProgress = await Progress.findOne({
    student: req.user._id,
    progressType: 'quiz',
    item: quiz._id,
    onModel: 'Quiz',
    topic: quiz.topic
  });

  if (existingProgress) {
    const betterScore = Math.max(existingProgress.score || 0, finalScore);

    await Progress.updateOne(
      { _id: existingProgress._id },
      {
        score: betterScore,
        timeSpent,
        answers: detailed,
        updatedAt: new Date()
      }
    );
  } else {
    await Progress.create({
      student: req.user._id,
      progressType: 'quiz',
      item: quiz._id,
      onModel: 'Quiz',
      topic: quiz.topic,
      score: finalScore,
      timeSpent,
      answers: detailed
    });
  }

  const newRewards = await checkAndAwardBadges(req.user._id, { score: finalScore, topic: quiz.topic });
  res.status(201).json({ score: finalScore, totalQuestions: quiz.questions.length, correctAnswers: correct, newRewards });
});

export { createQuiz, updateQuiz, deleteQuiz, getQuizzesByTopic, getQuizById, getQuizForReview, submitQuiz };
