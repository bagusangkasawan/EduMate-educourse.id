import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import * as FaIcons from 'react-icons/fa';

// Utility function to shuffle an array (Fisher-Yates shuffle algorithm)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};


const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null); // Original quiz data from API
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // State to hold the questions with shuffled options.
  const shuffledQuestions = useMemo(() => {
    if (!quiz) return [];
    // For each question, create a new object with a shuffled 'options' array
    return quiz.questions.map(q => ({
        ...q,
        options: shuffleArray([...q.options]) // Use a copy to avoid mutating original state
    }));
  }, [quiz]);


  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then(res => {
        setQuiz(res.data);
      })
      .catch(err => {
        console.error(err);
        setSubmitError("Gagal memuat kuis.");
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitError('');
      const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers, timeSpent });
      setResult(res.data);
      setShowModal(true);
    } catch (error) {
      setSubmitError('Gagal mengirim jawaban. Silakan coba lagi.');
    }
  };

  if (loading) return <Spinner />;
  // Check if there are shuffled questions to display
  if (!quiz || shuffledQuestions.length === 0) return <p>Kuis tidak ditemukan atau tidak memiliki pertanyaan.</p>;

  const currentQ = shuffledQuestions[index];
  const progress = ((index + 1) / shuffledQuestions.length) * 100;
  const isAnswered = !!answers[currentQ._id];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-gray-500 mb-6">
        Pertanyaan {index + 1} dari {shuffledQuestions.length}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="min-h-[250px]">
        <h2 className="text-2xl mb-6">{currentQ.questionText}</h2>
        <div className="space-y-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(currentQ._id, opt)}
              className={`block w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                answers[currentQ._id] === opt
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setIndex(i => i - 1)}
          disabled={index === 0}
          className="px-6 py-2 bg-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Sebelumnya
        </button>

        {index === shuffledQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!isAnswered}
            className={`px-6 py-2 rounded-lg font-bold transition-colors duration-200 ${
              !isAnswered
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Selesai
          </button>
        ) : (
          <button
            onClick={() => setIndex(i => i + 1)}
            disabled={!isAnswered}
            className={`px-6 py-2 rounded-lg font-bold transition-colors duration-200 ${
              !isAnswered
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Selanjutnya
          </button>
        )}
      </div>

      {submitError && (
        <p className="text-red-500 mt-4 text-sm text-center">{submitError}</p>
      )}

      {showModal && result && (
        <Modal title="Hasil Kuis" onClose={() => navigate(`/topics/${quiz.topic}`)}>
          <div className="text-center">
            {Array.isArray(result.newRewards) && result.newRewards.map(r => {
              const Icon = FaIcons[r.icon] || FaIcons.FaTrophy;
              return (
                <div
                  key={r._id}
                  className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 flex items-center space-x-3"
                >
                  <Icon className="text-2xl" />
                  <span>Selamat! Anda dapat badge: {r.name}</span>
                </div>
              );
            })}
            <p className="text-5xl font-bold mb-2">{result.score.toFixed(0)}%</p>
            <p className="text-gray-600 mb-6">
              Anda benar {result.correctAnswers} dari {result.totalQuestions} soal.
            </p>
            <button
              onClick={() => navigate(`/topics/${quiz.topic}`)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Kembali
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuizPage;
