import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/ui/Spinner';
import {
  FaTrophy,
  FaAward,
  FaGift,
  FaStar,
  FaCalculator,
  FaFlask,
  FaBullseye,
} from 'react-icons/fa';

const FaIcons = {
  FaTrophy, FaAward, FaGift, FaStar, FaCalculator, FaFlask, FaBullseye,
};

const AddRewardPage = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('FaTrophy');
  const [criteriaType, setCriteriaType] = useState('perfect_score');
  
  // State baru untuk menyimpan daftar topik dan topik yang dipilih
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Efek untuk mengambil daftar topik saat komponen dimuat
  useEffect(() => {
    const fetchTopics = async () => {
        try {
            const token = localStorage.getItem('token');
            // --- PERBAIKAN: Mengubah endpoint dari /topics/all menjadi /topics ---
            const { data } = await axios.get(`${baseURL}/topics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTopics(data);
            // Set pilihan default jika ada topik
            if (data.length > 0) {
                setSelectedTopic(data[0]._id);
            }
        } catch (err) {
            console.error("Error fetching topics:", err);
            setError('Gagal memuat daftar topik. Pastikan endpoint API benar.');
        }
    };
    fetchTopics();
  }, [baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Membangun objek criteria secara dinamis
    let criteria = { type: criteriaType };
    if (criteriaType === 'topic_completion') {
        if (!selectedTopic) {
            setError('Silakan pilih topik untuk kriteria ini.');
            setLoading(false);
            return;
        }
        criteria.topicId = selectedTopic;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseURL}/rewards`,
        { name, description, icon, criteria },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/manage-rewards');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan reward');
      setLoading(false);
    }
  };

  const IconPreview = FaIcons[icon];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Tambah Reward Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input untuk Nama, Deskripsi, dan Ikon (tidak berubah) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Reward</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
        </div>
        <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Ikon</label>
            <select id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md">
                {Object.keys(FaIcons).map((iconName) => (<option key={iconName} value={iconName}>{iconName}</option>))}
            </select>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Preview Ikon:</span>
                {IconPreview && <IconPreview className="h-6 w-6 text-gray-700" />}
            </div>
        </div>

        {/* Pilihan Kriteria */}
        <div>
          <label htmlFor="criteriaType" className="block text-sm font-medium text-gray-700">Kriteria</label>
          <select id="criteriaType" value={criteriaType} onChange={(e) => setCriteriaType(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md">
            <option value="perfect_score">Skor Sempurna (Kuis Apapun)</option>
            <option value="topic_completion">Menyelesaikan Topik Spesifik</option>
          </select>
        </div>

        {/* Dropdown Topik (muncul secara kondisional) */}
        {criteriaType === 'topic_completion' && (
            <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Pilih Topik</label>
                <select id="topic" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                    <option value="" disabled>-- Pilih Topik --</option>
                    {topics.map(topic => (
                        <option key={topic._id} value={topic._id}>{topic.title}</option>
                    ))}
                </select>
            </div>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Batal</button>
          <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {loading ? <Spinner size="sm" /> : 'Simpan Reward'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRewardPage;
