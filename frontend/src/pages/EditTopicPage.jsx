import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/ui/Spinner';

const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EditTopicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalCoverImage, setOriginalCoverImage] = useState('');
  const [generatedCoverImage, setGeneratedCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        // Menambahkan token untuk konsistensi
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${baseURL}/topics/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setTitle(data.title);
        setDescription(data.description);
        setOriginalCoverImage(data.coverImage);
      } catch (err) {
        setError('Gagal memuat data topik.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchTopic();
  }, [id, baseURL]);

  const handleGenerateImage = () => {
    if (title.trim()) {
      const firstWord = title.trim().split(' ')[0];
      const bg = getRandomHexColor();
      const image = `https://placehold.co/600x400/${bg}/ffffff?text=${encodeURIComponent(firstWord)}`;
      setGeneratedCoverImage(image);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const coverImageToSubmit = generatedCoverImage || originalCoverImage;

    try {
      // Mengambil token dari localStorage
      const token = localStorage.getItem('token');
      
      // Menambahkan headers Authorization pada request PUT
      await axios.put(
        `${baseURL}/topics/${id}`, 
        {
          title,
          description,
          coverImage: coverImageToSubmit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/topics');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui topik');
      setLoading(false);
    }
  };

  const displayImage = generatedCoverImage || originalCoverImage;

  if (pageLoading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Topik</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateImage}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Generate Gambar Baru
          </button>
        </div>

        {displayImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Preview Gambar</label>
            <img src={displayImage} alt="Preview Cover" className="w-full rounded-md border" />
          </div>
        )}

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

export default EditTopicPage;
