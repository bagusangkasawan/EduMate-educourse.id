import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import Spinner from '../components/ui/Spinner';
import * as FaIcons from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const RewardCard = ({ reward: { reward, dateEarned } }) => {
    const Icon = FaIcons[reward?.icon] || FaIcons.FaTrophy;
    const formattedDate = dateEarned ? format(new Date(dateEarned), "d MMMM yyyy", { locale: id }) : '-';

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform hover:scale-105 transition-transform">
            <div className="p-4 bg-yellow-400 rounded-full">
                <Icon className="text-4xl text-white" />
            </div>
            <div>
                <h3 className="text-xl font-bold">{reward?.name || 'Penghargaan'}</h3>
                <p className="text-gray-600">{reward?.description || 'Deskripsi tidak tersedia'}</p>
                <p className="text-xs text-gray-400 mt-1">Didapatkan: {formattedDate}</p>
            </div>
        </div>
    );
};

const RewardsPage = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/rewards')
            .then(res => setRewards(res.data))
            .catch(err => setError(err.response?.data?.message || 'Gagal memuat data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Koleksi Penghargaanku</h1>
            {rewards.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rewards.map(r => (
                        <RewardCard key={r._id} reward={r} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Anda belum mendapatkan penghargaan. Teruslah belajar!
                </p>
            )}
        </div>
    );
};

export default RewardsPage;
