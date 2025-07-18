import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import Chatbot from './components/chatbot/Chatbot';

// General Pages
import HomePage from './pages/general/HomePage';
import LoginPage from './pages/general/LoginPage';
import RegisterPage from './pages/general/RegisterPage';
import DashboardPage from './pages/general/DashboardPage';
import ProfilePage from './pages/general/ProfilePage';

// Topic Pages
import TopicsPage from './pages/topic/TopicsPage';
import TopicDetailPage from './pages/topic/TopicDetailPage';
import AddTopicPage from './pages/topic/AddTopicPage';
import EditTopicPage from './pages/topic/EditTopicPage';

// Quiz Pages
import QuizPage from './pages/quiz/QuizPage';
import QuizReviewPage from './pages/quiz/QuizReviewPage';
import AddQuizPage from './pages/quiz/AddQuizPage';
import EditQuizPage from './pages/quiz/EditQuizPage';

// Lesson Pages
import LessonPage from './pages/lesson/LessonPage';
import AddLessonPage from './pages/lesson/AddLessonPage';
import EditLessonPage from './pages/lesson/EditLessonPage';

// Reward Pages
import RewardsPage from './pages/reward/RewardsPage';
import AddRewardPage from './pages/reward/AddRewardPage';
import EditRewardPage from './pages/reward/EditRewardPage';

// Management Pages
import ManageRewardsPage from './pages/management/ManageRewardsPage';
import ManageParentsPage from './pages/management/ManageParentsPage';
import ManageStudentsPage from './pages/management/ManageStudentsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />

          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Private routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/topics"
                element={
                  <PrivateRoute>
                    <TopicsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/topics/:topicId"
                element={
                  <PrivateRoute>
                    <TopicDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/lesson/:lessonId"
                element={
                  <PrivateRoute>
                    <LessonPage />
                  </PrivateRoute>
                }
              />

              {/* Student routes */}
              <Route
                path="/rewards"
                element={
                  <PrivateRoute roles={['student']}>
                    <RewardsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz/:quizId"
                element={
                  <PrivateRoute roles={['student']}>
                    <QuizPage />
                  </PrivateRoute>
                }
              />

              {/* Teacher routes */}
              <Route
                path="/add-topic"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <AddTopicPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-topic/:id"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <EditTopicPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-quiz"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <AddQuizPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-quiz/:id"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <EditQuizPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/quiz/:quizId/review"
                element={
                  <PrivateRoute roles={['parent', 'teacher', 'admin']}>
                    <QuizReviewPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-lesson"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <AddLessonPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-lesson/:id"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <EditLessonPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-reward"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <AddRewardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manage-rewards"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <ManageRewardsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-reward/:id"
                element={
                  <PrivateRoute roles={['teacher', 'admin']}>
                    <EditRewardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/approve-parents"
                element={
                  <PrivateRoute roles={['teacher']}>
                    <ManageParentsPage />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/manage-students" 
                element={
                <PrivateRoute roles={['admin']}>
                    <ManageStudentsPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
