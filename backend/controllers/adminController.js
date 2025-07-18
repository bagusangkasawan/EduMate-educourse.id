import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get pending teacher accounts
// @route   GET /api/admin/pending/teachers
// @access  Private/Admin
const getPendingTeachers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'teacher', status: 'pending' }).select('name username email createdAt role');
    res.json(users);
});

// @desc    Get pending parent accounts
// @route   GET /api/admin/pending/parents
// @access  Private/Teacher
const getPendingParents = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'parent', status: 'pending' }).select('name username email createdAt role');
    res.json(users);
});

// @desc    Get all students with their unique code
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('name username email createdAt role studentCode');
  res.json(students);
});

// @desc    Admin menautkan siswa ke guru/ortu
// @route   POST /api/admin/link-student
// @access  Private/Admin
const linkStudentAsAdmin = asyncHandler(async (req, res) => {
  const { targetUserId, studentId } = req.body;

  const user = await User.findById(targetUserId);
  const student = await User.findById(studentId);

  if (!user || !student) {
    res.status(404);
    throw new Error('Pengguna atau siswa tidak ditemukan.');
  }

  if (!['teacher', 'parent'].includes(user.role)) {
    res.status(403);
    throw new Error('Hanya guru atau orang tua yang dapat ditautkan dengan siswa.');
  }

  if (user.children.includes(student._id)) {
    res.status(400);
    throw new Error('Siswa sudah ditautkan.');
  }

  user.children.push(student._id);
  await user.save();

  const updatedUser = await User.findById(user._id).populate('children', '_id name email');
  res.json(updatedUser);
});

// @desc    Approve a user account
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin or Private/Teacher
const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Admin hanya bisa menyetujui guru dan orang tua
        if (req.user.role === 'admin' && !['teacher', 'parent'].includes(user.role)) {
            res.status(403);
            throw new Error('Admin hanya dapat menyetujui akun guru dan orang tua.');
        }
        // Guru hanya bisa menyetujui orang tua
        if (req.user.role === 'teacher' && user.role !== 'parent') {
            res.status(403);
            throw new Error('Guru hanya dapat menyetujui akun orang tua.');
        }

        user.status = 'active';
        user.approvedBy = req.user._id;
        await user.save();
        res.json({ message: 'Akun pengguna berhasil disetujui.' });
    } else {
        res.status(404);
        throw new Error('Pengguna tidak ditemukan');
    }
});

// @desc    Reject a user account (mark as rejected)
// @route   PUT /api/admin/reject/:id
// @access  Private/Admin or Private/Teacher
const rejectUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }

  // Validasi role yang sama seperti di approveUser
  if (req.user.role === 'admin' && !['teacher', 'parent'].includes(user.role)) {
    res.status(403);
    throw new Error('Admin hanya dapat menolak akun guru dan orang tua.');
  }

  if (req.user.role === 'teacher' && user.role !== 'parent') {
    res.status(403);
    throw new Error('Guru hanya dapat menolak akun orang tua.');
  }

  user.status = 'rejected';
  await user.save();

  res.json({ message: 'Akun pengguna berhasil ditolak.' });
});

// @desc    Get history of approved/rejected teachers
// @route   GET /api/admin/history/teachers
// @access  Private/Admin
const getApprovedOrRejectedTeachers = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: 'teacher',
    status: { $in: ['active', 'rejected'] },
  })
  .select('name username email createdAt status role')
  .populate('approvedBy', 'name');
  res.json(users);
});

// @desc    Get history of approved/rejected parents
// @route   GET /api/admin/history/parents
// @access  Private/Admin or Private/Teacher
const getApprovedOrRejectedParents = asyncHandler(async (req, res) => {
  const users = await User.find({
    role: 'parent',
    status: { $in: ['active', 'rejected'] },
  })
  .select('name username email createdAt status role')
  .populate('approvedBy', 'name');
  res.json(users);
});

// @desc    Set rejected teacher/parent to active
// @route   PUT /api/admin/set-active/:id
// @access  Private/Admin
const setUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || (user.role !== 'teacher' && user.role !== 'parent')) {
    res.status(404);
    throw new Error('Guru atau orang tua tidak ditemukan');
  }

  if (user.status !== 'rejected') {
    res.status(400);
    throw new Error('Hanya akun yang ditolak yang bisa diaktifkan ulang');
  }

  user.status = 'active';
  user.approvedBy = req.user._id;
  await user.save();

  res.json({ message: 'Akun guru atau orang tua berhasil diaktifkan kembali.' });
});

// @desc    Delete teacher/parent/student account permanently
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || !['teacher', 'parent', 'student'].includes(user.role)) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan atau tidak dapat dihapus');
  }

  await user.deleteOne();

  res.json({ message: 'Akun berhasil dihapus permanen.' });
});

export {
  getPendingTeachers,
  getPendingParents,
  getApprovedOrRejectedTeachers,
  getApprovedOrRejectedParents,
  approveUser,
  rejectUser,
  deleteUser,
  setUserActive,
  getAllStudents,
  linkStudentAsAdmin
};
