import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/ui/Spinner';
import {
  FaTrophy,
  FaAward,
  FaGift,
  FaStar,
  FaCalculator,
  FaFlask,
  FaBullseye,
} from 'react-icons/fa';

const iconOptions = [
  { label: 'Piala', value: 'FaTrophy', icon: FaTrophy },
  { label: 'Penghargaan', value: 'FaAward', icon: FaAward },
  { label: 'Hadiah', value: 'FaGift', icon: FaGift },
  { label: 'Bintang', value: 'FaStar', icon: FaStar },
  { label: 'Kalkulator', value: 'FaCalculator', icon: FaCalculator },
  { label: 'Ilmuwan', value: 'FaFlask', icon: FaFlask },
  { label: 'Target', value: 'FaBullseye', icon: FaBullseye },
];

const FaIcons = {
  FaTrophy, FaAward, FaGift, FaStar, FaCalculator, FaFlask, FaBullseye,
};

const EditRewardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('FaTrophy');
  const [criteriaType, setCriteriaType] = useState('perfect_score');
  
  // State untuk daftar topik dan topik yang terpilih
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRewardAndTopics = async () => {
      const token = localStorage.getItem('token');
      try {
        // Mengambil data reward dan daftar topik secara bersamaan
        const [rewardRes, topicsRes] = await Promise.all([
          axios.get(`${baseURL}/rewards/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // --- PERBAIKAN: Mengubah endpoint dari /topics/all menjadi /topics ---
          axios.get(`${baseURL}/topics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const rewardData = rewardRes.data;
        const topicsData = topicsRes.data;

        // Set data reward
        setName(rewardData.name);
        setDescription(rewardData.description);
        setIcon(rewardData.icon);
        setCriteriaType(rewardData.criteria.type);

        // Set daftar topik
        setTopics(topicsData);

        // Jika kriteria adalah penyelesaian topik, set topik yang sudah terpilih
        if (rewardData.criteria.type === 'topic_completion') {
          setSelectedTopic(rewardData.criteria.topicId || '');
        }

      } catch (err) {
        // Memberikan pesan error yang lebih spesifik
        console.error("Error fetching data:", err);
        setError('Gagal memuat data. Periksa koneksi dan endpoint API.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchRewardAndTopics();
  }, [id, baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Membangun objek criteria secara dinamis, sama seperti di halaman Add
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
      await axios.put(
        `${baseURL}/rewards/${id}`,
        { name, description, icon, criteria },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/manage-rewards');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui reward');
      setLoading(false);
    }
  };

  if (pageLoading) return <Spinner />;

  const IconPreview = FaIcons[icon];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Reward</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <select
            id="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          >
            {iconOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Preview Ikon:</span>
            {IconPreview && <IconPreview className="h-6 w-6 text-gray-700" />}
          </div>
        </div>
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
            {loading ? <Spinner size="sm" color="white" /> : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRewardPage;
