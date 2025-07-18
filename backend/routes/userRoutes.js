import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    linkStudent 
} from '../controllers/userController.js';
import { protect, parentOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/link', protect, parentOrTeacher, linkStudent);

export default router;
