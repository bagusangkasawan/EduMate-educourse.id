import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Editor from '../../components/ui/Editor.jsx';

const EditLessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonRes, topicsRes] = await Promise.all([
          api.get(`/lessons/${id}`),
          api.get('/topics'),
        ]);

        setTitle(lessonRes.data.title);
        setContent(lessonRes.data.content);
        setTopicId(lessonRes.data.topic);
        setTopics(topicsRes.data);
      } catch (err) {
        setError('Gagal memuat data materi untuk diedit.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/lessons/${id}`, { title, content, topic: topicId });
      navigate(`/topics/${topicId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui materi.');
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Materi</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Judul Materi
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700"
          >
            Topik
          </label>
          <select
            id="topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md bg-white"
            required
          >
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten Materi
          </label>
          <Editor
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? <Spinner size="sm" /> : 'Perbarui Materi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonPage;
