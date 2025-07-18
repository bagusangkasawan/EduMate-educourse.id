import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/ui/Spinner';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EditQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizAndTopics = async () => {
        try {
        const token = localStorage.getItem('token');
        const [quizRes, topicsRes] = await Promise.all([
            axios.get(`${baseURL}/quizzes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }),
            axios.get(`${baseURL}/topics`)
        ]);

        const quizData = quizRes.data;
        setTitle(quizData.title);
        setTopic(quizData.topic);
        setQuestions(
            quizData.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options || ['', '', '', ''],
            correctAnswer: q.correctAnswer || '',
            }))
        );

        setTopics(topicsRes.data);
        } catch (err) {
        setError('Gagal memuat data kuis.');
        } finally {
        setPageLoading(false);
        }
    };
    fetchQuizAndTopics();
    }, [id, baseURL]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Mengambil token dari localStorage
      const token = localStorage.getItem('token');
      
      // Menambahkan headers Authorization pada request PUT
      await axios.put(
        `${baseURL}/quizzes/${id}`, 
        { title, topic, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/topics/${topic}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui kuis');
      setLoading(false);
    }
  };

  if (pageLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Kuis</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Kuis</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topik</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          >
            {topics.map(t => (
              <option key={t._id} value={t._id}>{t.title}</option>
            ))}
          </select>
        </div>

        <hr />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-md space-y-3 relative">
            <h3 className="font-semibold">Pertanyaan {qIndex + 1}</h3>
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            <div>
              <label className="text-sm">Teks Pertanyaan</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex}>
                <label className="text-sm">Opsi {oIndex + 1}</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <div>
              <label className="text-sm">Jawaban Benar</label>
              <select
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              >
                <option value="" disabled>Pilih Jawaban Benar</option>
                {q.options.filter(Boolean).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center space-x-2 text-blue-600"
        >
          <FaPlus />
          <span>Tambah Pertanyaan</span>
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? <Spinner size="sm" /> : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuizPage;
