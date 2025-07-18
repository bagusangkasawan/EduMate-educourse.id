import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileAlt, FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../utils/api.js';
import Spinner from '../components/ui/Spinner';
import AuthContext from '../components/context/AuthContext';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [quizToOpen, setQuizToOpen] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    type: '',
    id: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicRes, lessonsRes, quizzesRes] = await Promise.all([
        api.get(`/topics/${topicId}`),
        api.get(`/lessons/topic/${topicId}`),
        api.get(`/quizzes/topic/${topicId}`),
      ]);
      setTopic(topicRes.data);
      setLessons(lessonsRes.data);
      setQuizzes(quizzesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data topik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [topicId]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('attemptedQuizzes')) || [];
      setAttemptedQuizzes(stored);
    } catch {
      setAttemptedQuizzes([]);
    }
  }, []);

  const handleDeleteClick = (id, type) => {
    setModalInfo({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/${modalInfo.type}s/${modalInfo.id}`);
      fetchData();
    } catch (err) {
      setError(`Gagal menghapus ${modalInfo.type}.`);
    } finally {
      setModalInfo({ isOpen: false, type: '', id: null });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  const renderLink = (item, type) => {
    if (
      user.role === 'student' ||
      user.role === 'parent' ||
      (isTeacher || isAdmin)
    ) {
      if (type === 'lesson') return `/lesson/${item._id}`;
      return user.role === 'student'
        ? `/quiz/${item._id}`
        : `/quiz/${item._id}/review`;
    }
    return '#';
  };

  const renderLinkText = (type) => {
    if (user.role === 'student') {
      return type === 'lesson' ? 'Baca Materi' : 'Mulai Kuis';
    }
    return 'Tinjau';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/topics')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Kembali</span>
      </button>

      <h1 className="text-3xl font-bold mb-2">{topic?.title}</h1>
      <p className="text-gray-500 mb-8">{topic?.description}</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Materi */}
        <div className="bg-white p-6 rounded-lg shadow space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaBook /> Materi
            </h2>
            {(isTeacher || isAdmin) && (
              <Link
                to="/add-lesson"
                state={{ topicId }}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
              >
                <FaPlus /> Tambah
              </Link>
            )}
          </div>

          {lessons.length > 0 ? (
            lessons.map((l) => (
              <div
                key={l._id}
                className="p-3 rounded-lg border flex justify-between items-center"
              >
                <Link
                  to={renderLink(l, 'lesson')}
                  className="flex-grow font-medium hover:text-blue-600"
                >
                  {l.title}
                </Link>
                {(isTeacher || isAdmin) && (
                  <div className="flex gap-3 ml-2">
                    <Link to={`/edit-lesson/${l._id}`} className="text-blue-500">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(l._id, 'lesson')}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Belum ada materi.</p>
          )}
        </div>

        {/* Kuis */}
        <div className="bg-white p-6 rounded-lg shadow space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaFileAlt /> Kuis
            </h2>
            {(isTeacher || isAdmin) && (
              <Link
                to="/add-quiz"
                state={{ topicId }}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
              >
                <FaPlus /> Tambah
              </Link>
            )}
          </div>

          {quizzes.length > 0 ? (
            quizzes.map((q) => (
              <div
                key={q._id}
                className="p-3 rounded-lg border flex justify-between items-center"
              >
                <span className="flex-grow font-medium">{q.title}</span>
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    to={renderLink(q, 'quiz')}
                    onClick={(e) => {
                      const attempted = attemptedQuizzes.includes(q._id);
                      const isQuiz = renderLinkText('quiz') === 'Mulai Kuis';

                      if (attempted && isQuiz) {
                        e.preventDefault();
                        setQuizToOpen(q._id);
                        setShowConfirmModal(true);
                      }
                    }}
                    className="font-semibold text-blue-600"
                  >
                    {renderLinkText('quiz')} &rarr;
                  </Link>
                  {(isTeacher || isAdmin) && (
                    <>
                      <Link to={`/edit-quiz/${q._id}`} className="text-blue-500">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(q._id, 'quiz')}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Belum ada kuis.</p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, type: '', id: null })}
        onConfirm={confirmDelete}
        title={`Hapus ${modalInfo.type}`}
        message={`Yakin ingin menghapus ${modalInfo.type} ini?`}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Ulangi Kuis"
        message="Berdasarkan riwayat belajar kamu, kuis ini baru saja dikerjakan. Yakin ingin mengulanginya?"
        confirmText="Ulangi"
        confirmColorClass="bg-blue-600 hover:bg-blue-700"
        onClose={() => {
          setShowConfirmModal(false);
          setQuizToOpen(null);
        }}
        onConfirm={() => {
          setShowConfirmModal(false);
          if (quizToOpen) navigate(`/quiz/${quizToOpen}`);
        }}
      />
    </div>
  );
};

export default TopicDetailPage;
