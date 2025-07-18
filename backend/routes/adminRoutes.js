import express from 'express';
import {
    getPendingTeachers,
    getPendingParents,
    approveUser,
    rejectUser,
    getApprovedOrRejectedTeachers,
    setUserActive,
    deleteUser,
    getApprovedOrRejectedParents,
    getAllStudents
} from '../controllers/adminController.js';
import { protect, adminOnly, adminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rute khusus Admin
router.get('/pending/teachers', protect, adminOnly, getPendingTeachers);
router.get('/history/teachers', protect, adminOnly, getApprovedOrRejectedTeachers);
router.get('/students', protect, adminOnly, getAllStudents);
router.put('/set-active/:id', protect, adminOnly, setUserActive);
router.delete('/user/:id', protect, adminOnly, deleteUser);

// Rute khusus Admin dan Guru
router.get('/pending/parents', protect, adminOrTeacher, getPendingParents);
router.get('/history/parents', protect, adminOrTeacher, getApprovedOrRejectedParents);

// Rute bisa diakses Admin (untuk Guru) atau Guru (untuk Ortu)
router.put('/approve/:id', protect, adminOrTeacher, approveUser);
router.put('/reject/:id', protect, adminOrTeacher, rejectUser);

export default router;
