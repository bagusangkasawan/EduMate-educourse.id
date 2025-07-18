import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
