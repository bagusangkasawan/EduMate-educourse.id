import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import Spinner from '../ui/Spinner';
import {
  StatsCard,
  ProgressChart,
  RecentActivity
} from './DashboardComponents';
import {
  FaBullseye,
  FaChartLine,
  FaBookReader,
  FaQuestionCircle
} from 'react-icons/fa';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/student')
      .then((res) => {
        setData(res.data);

        const quizIds = res.data.recentActivities
          ?.filter((act) => act.progressType === 'quiz' && act.item?._id)
          .map((act) => act.item._id);

        localStorage.setItem('attemptedQuizzes', JSON.stringify(quizIds));
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Gagal memuat data')
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data) return <p className="text-center">Data tidak ditemukan.</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard Belajarku
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<FaQuestionCircle />}
          title="Kuis Dikerjakan"
          value={data.stats.totalQuizzes}
          color="bg-blue-500"
        />
        <StatsCard
          icon={<FaBookReader />}
          title="Materi Selesai"
          value={data.stats.totalLessons}
          color="bg-green-500"
        />
        <StatsCard
          icon={<FaBullseye />}
          title="Rata-rata Skor"
          value={`${data.stats.averageScore}%`}
          color="bg-orange-500"
        />
        <StatsCard
          icon={<FaChartLine />}
          title="Topik Dipelajari"
          value={data.stats.topicsLearned}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Progres Skor Kuis per Topik
          </h2>
          {data.chartData?.length > 0 ? (
            <ProgressChart data={data.chartData} />
          ) : (
            <p>Belum ada progres kuis untuk ditampilkan.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Aktivitas Terbaru
          </h2>
          <RecentActivity activities={data.recentActivities || []} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
