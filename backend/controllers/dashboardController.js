import asyncHandler from 'express-async-handler';
import Progress from '../models/progressModel.js';
import mongoose from 'mongoose';

/**
 * Helper untuk mengambil data dashboard siswa
 */
const getDashboardData = async (studentId) => {
  // Ambil semua progres siswa (baik materi maupun kuis)
  const allProgress = await Progress.find({ student: studentId })
    .populate({
      path: 'item',
      select: 'title', // hanya ambil judul kuis/materi
    })
    .populate('topic', 'title')
    .sort({ createdAt: -1 });

  // Filter progres yang berupa kuis
  const quizProgress = allProgress.filter((p) => p.progressType === 'quiz');

  const totalQuizzes = quizProgress.length;
  const averageScore =
    totalQuizzes > 0
      ? quizProgress.reduce((acc, item) => acc + item.score, 0) / totalQuizzes
      : 0;

  // Ambil topik yang valid dari progress quiz
  const topicsFromQuizzes = new Set(
    allProgress
      .filter(p => p.progressType === 'quiz' && p.topic && p.topic._id)
      .map(p => p.topic._id.toString())
  );

  // Ambil topik yang valid dari progress lesson
  const topicsFromLessons = new Set(
    allProgress
      .filter(p => p.progressType === 'lesson' && p.topic && p.topic._id)
      .map(p => p.topic._id.toString())
  );

  // Hanya topik yang memiliki keduanya (kuis dan materi)
  const topicsLearned = [...topicsFromLessons].filter(topicId => topicsFromQuizzes.has(topicId));

  // Agregasi untuk grafik rata-rata nilai kuis per topik
  const progressPerTopic = await Progress.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
        progressType: 'quiz',
      },
    },
    {
      $group: {
        _id: '$topic',
        avgScore: { $avg: '$score' },
      },
    },
    {
      $lookup: {
        from: 'topics',
        localField: '_id',
        foreignField: '_id',
        as: 'topicDetails',
      },
    },
    { $unwind: '$topicDetails' },
    {
      $project: {
        topic: '$topicDetails.title',
        averageScore: '$avgScore',
      },
    },
  ]);

  return {
    recentActivities: allProgress.slice(0, 5),
    stats: {
      totalQuizzes,
      averageScore: averageScore.toFixed(2),
      totalLessons: allProgress.length - totalQuizzes,
      topicsLearned: topicsLearned.length,
    },
    chartData: progressPerTopic,
  };
};

/**
 * Dashboard untuk siswa
 */
const getStudentDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user._id);
  res.json(data);
});

/**
 * Dashboard untuk orang tua/guru
 */
const getParentTeacherDashboard = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Validasi bahwa siswa tersebut adalah anak yang terdaftar di akun orang tua/guru
  if (!req.user.children.some((child) => child._id.toString() === studentId)) {
    res.status(403);
    throw new Error("You are not authorized to view this student's data.");
  }

  const data = await getDashboardData(studentId);
  res.json(data);
});

export { getStudentDashboard, getParentTeacherDashboard };
