import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/ui/Spinner';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { 
    FaEdit, 
    FaTrash, 
    FaPlus,
    FaArrowLeft
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';

const RewardListCard = ({ reward, onDelete }) => {
    const Icon = FaIcons[reward.icon] || FaIcons.FaTrophy;
    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Icon className="text-2xl text-yellow-500" />
                <div>
                    <h3 className="font-bold">{reward.name}</h3>
                    <p className="text-sm text-gray-500">{reward.description}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <Link to={`/edit-reward/${reward._id}`} className="text-blue-500 hover:text-blue-700"><FaEdit /></Link>
                <button onClick={() => onDelete(reward._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
            </div>
        </div>
    );
};

const ManageRewardsPage = () => {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRewardId, setSelectedRewardId] = useState(null);

    const fetchRewards = () => {
        setLoading(true);
        api.get('/rewards/all')
            .then(res => setRewards(res.data))
            .catch(err => setError(err.response?.data?.message || 'Gagal memuat rewards'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedRewardId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/rewards/${selectedRewardId}`);
            setDeleteModalOpen(false);
            fetchRewards();
        } catch (err) {
            setError('Gagal menghapus reward.');
            setDeleteModalOpen(false);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <FaArrowLeft />
                <span>Kembali</span>
            </button>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manajemen Reward</h1>
                <Link to="/add-reward" className="bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                    <FaPlus /> Tambah Reward
                </Link>
            </div>
            <div className="space-y-4">
                {rewards.length > 0 ? (
                    rewards.map(r => <RewardListCard key={r._id} reward={r} onDelete={handleDeleteClick} />)
                ) : (
                    <p>Belum ada reward yang dibuat.</p>
                )}
            </div>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus reward ini?"
            />
        </div>
    );
};

export default ManageRewardsPage;
