import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import Spinner from '../components/ui/Spinner.jsx';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const QuizReviewPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizForReview = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}/review`);
        setQuiz(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat kuis untuk ditinjau');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizForReview();
  }, [quizId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!quiz) return <p className="text-center">Kuis tidak ditemukan.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/topics/${quiz.topic._id}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Kembali ke Daftar Kuis</span>
      </button>

      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-1">Tinjau Kuis: {quiz.title}</h1>
        <p className="text-gray-500 mb-8">Topik: {quiz.topic.title}</p>

        <div className="space-y-8">
          {quiz.questions.map((q, index) => (
            <div key={q._id || index} className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">
                Pertanyaan {index + 1}: {q.questionText}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, i) => (
                  <div
                    key={i}
                    className={`flex items-center p-3 rounded-lg border-2 ${
                      option === q.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800 font-semibold'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {option}
                    {option === q.correctAnswer && (
                      <FaCheckCircle className="ml-auto text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;
