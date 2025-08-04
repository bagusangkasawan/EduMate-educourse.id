import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import api from '../../utils/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import AuthContext from '../../components/context/AuthContext.jsx';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [checkedCompletion, setCheckedCompletion] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const { data } = await api.get(`/lessons/${lessonId}`);
        setLesson(data);
      } catch (err) {
        setError('Gagal memuat materi.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    const checkCompletionStatus = async () => {
      try {
        const { data } = await api.get(`/lessons/${lessonId}/status`);
        setIsCompleted(data.completed);
      } catch (err) {
        console.error('Gagal cek status penyelesaian:', err);
      } finally {
        setCheckedCompletion(true);
      }
    };

    checkCompletionStatus();
  }, [lessonId]);

  const handleComplete = async () => {
    try {
      await api.post(`/lessons/${lessonId}/complete`, {
        topicId: lesson.topic
      });
      setIsCompleted(true);
    } catch (err) {
      console.error('Gagal menandai selesai:', err);
      setIsCompleted(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!lesson) return <p className="text-center">Materi tidak ditemukan.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/topics/${lesson.topic}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Kembali ke Topik</span>
      </button>

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
        <hr className="mb-8" />
        <div className="prose lg:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>

        {user.role === 'student' && checkedCompletion && (
          <div className="mt-12 text-center">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 text-green-600 font-semibold p-4 bg-green-100 rounded-lg">
                <FaCheckCircle />
                <span>Materi Telah Diselesaikan!</span>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors"
              >
                Tandai Selesai Belajar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
