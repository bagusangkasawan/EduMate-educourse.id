import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Editor from '../../components/ui/Editor.jsx';

const AddLessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState(location.state?.topicId || '');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await api.get('/topics');
        setTopics(data);

        // default ke topic pertama jika belum ada
        if (!topicId && data.length > 0) {
          setTopicId(data[0]._id);
        }
      } catch (err) {
        setError('Gagal memuat topik.');
      }
    };

    fetchTopics();
  }, [topicId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      setError('Konten materi tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/lessons', { title, content, topic: topicId });
      navigate(`/topics/${topicId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan materi.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Tambah Materi Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Topik
          </label>
          <select
            id="topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md bg-white"
            required
          >
            <option value="" disabled>-- Pilih Topik --</option>
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
            {loading ? <Spinner size="sm" /> : 'Simpan Materi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLessonPage;
