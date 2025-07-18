import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import Chatbot from './components/chatbot/Chatbot';

// General pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RewardsPage from './pages/RewardsPage';
import TopicsPage from './pages/TopicsPage';
import TopicDetailPage from './pages/TopicDetailPage';
import QuizPage from './pages/QuizPage';
import QuizReviewPage from './pages/QuizReviewPage';
import LessonPage from './pages/LessonPage';

// Teacher pages
import AddTopicPage from './pages/AddTopicPage';
import EditTopicPage from './pages/EditTopicPage';
import AddQuizPage from './pages/AddQuizPage';
import EditQuizPage from './pages/EditQuizPage';
import AddLessonPage from './pages/AddLessonPage';
import EditLessonPage from './pages/EditLessonPage';
import AddRewardPage from './pages/AddRewardPage';
import ManageRewardsPage from './pages/ManageRewardsPage';
import EditRewardPage from './pages/EditRewardPage';
import ApproveParentsPage from './pages/ApproveParentsPage';

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
                    <ApproveParentsPage />
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
