import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import Spinner from '../components/ui/Spinner';
import AuthContext from '../components/context/AuthContext';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TopicCard = ({ topic, isTeacher, isAdmin, onDelete }) => {
    const fallbackImage = 'https://via.placeholder.com/400x200?text=No+Image';
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform">
            <img src={topic.coverImage || fallbackImage} alt={topic.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                    <Link to={`/topics/${topic._id}`} className="text-gray-800 hover:text-blue-600">
                        {topic.title}
                    </Link>
                </h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">{topic.description}</p>
                <div className="flex justify-between items-center">
                    <Link to={`/topics/${topic._id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                        Lihat Materi & Kuis &rarr;
                    </Link>
                    {(isTeacher || isAdmin) && (
                        <div className="flex gap-2">
                            <Link to={`/edit-topic/${topic._id}`} className="text-blue-500 hover:text-blue-700"><FaEdit /></Link>
                            <button onClick={() => onDelete(topic._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TopicsPage = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);

    const fetchTopics = () => {
         api.get('/topics')
            .then(res => setTopics(res.data))
            .catch(err => setError(err.response?.data?.message || 'Gagal memuat topik'))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedTopicId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/topics/${selectedTopicId}`);
            setDeleteModalOpen(false);
            fetchTopics();
        } catch (err) {
            setError('Gagal menghapus topik.');
            setDeleteModalOpen(false);
        }
    };
    
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <section>
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Pilih Topik untuk Dipelajari</h1>
                {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <Link to="/add-topic" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Tambah Topik
                    </Link>
                )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topics.map(t => (
                    <TopicCard key={t._id} topic={t} isTeacher={user?.role === 'teacher'} isAdmin={user?.role === 'admin'} onDelete={handleDeleteClick} />
                ))}
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus topik ini? Semua kuis di dalamnya juga akan terhapus."
            />
        </section>
    );
};

export default TopicsPage;
