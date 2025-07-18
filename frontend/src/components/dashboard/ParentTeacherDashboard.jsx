import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../../utils/api.js';
import Spinner from '../ui/Spinner';
import {
  StatsCard,
  ProgressChart,
  RecentActivity
} from './DashboardComponents';
import {
  FaBookReader,
  FaBullseye,
  FaChartLine,
  FaTrophy,
  FaQuestionCircle,
  FaUserCheck
} from 'react-icons/fa';

const ParentTeacherDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');

  const selected = user.children?.find((c) => c._id === studentId);

  useEffect(() => {
    if (user?.children?.length > 0 && !studentId) {
      setStudentId(user.children[0]._id);
    }
  }, [user, studentId]);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      setError('');
      api
        .get(`/dashboard/parent-teacher/${studentId}`)
        .then((res) => setData(res.data))
        .catch((err) =>
          setError(err.response?.data?.message || 'Gagal memuat data')
        )
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  const linkStudent = async (e) => {
    e.preventDefault();
    setLinkError('');
    setLinkSuccess('');
    try {
      const res = await api.post('/users/link', { studentCode: code });
      updateUser(res.data);
      setLinkSuccess('Siswa berhasil ditautkan!');
      setCode('');
    } catch (err) {
      setLinkError(err.response?.data?.message || 'Gagal menautkan siswa');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard {user.role === 'parent' ? 'Orang Tua' : 'Guru'}
      </h1>

      {/* Teacher Only Section */}
      {user.role === 'teacher' && (
        <>
          {/* Manajemen Konten */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Manajemen Konten dan Akun</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
              <Link
                to="/topics"
                className="bg-indigo-500 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-600"
              >
                <FaBookReader />
                <span>Manajemen Topik, Materi & Kuis</span>
              </Link>
              <Link
                to="/approve-parents"
                className="bg-emerald-500 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600"
              >
                <FaUserCheck />
                <span>Persetujuan Akun Orang Tua</span>
              </Link>
              <Link
                to="/manage-rewards"
                className="bg-amber-500 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-600"
              >
                <FaTrophy />
                <span>Manajemen Reward</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Tautkan & Progres Siswa */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Tautkan & Progres Siswa</h2>

        {/* Form Tautkan di Atas */}
        <form onSubmit={linkStudent} className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
          <div className="flex-grow w-full">
            <label htmlFor="studentCode" className="block text-sm font-medium text-gray-700">
              Kode Siswa
            </label>
            <input
              type="text"
              id="studentCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Masukkan kode unik siswa"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto"
            title="Tautkan Siswa"
          >
            Tautkan
          </button>
        </form>
        {linkError && <p className="text-red-500 text-sm mt-1">{linkError}</p>}
        {linkSuccess && <p className="text-green-500 text-sm mt-1">{linkSuccess}</p>}

        {/* Progres Siswa */}
        <div className="mt-6">
          {user.children?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {user.children.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setStudentId(c._id)}
                  className={`px-4 py-2 rounded-lg ${
                    studentId === c._id ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Anda belum menautkan siswa.</p>
          )}
          {loading && <Spinner />}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Detail Progres */}
        {data && selected && (
          <div className="space-y-6 mt-8 border-t pt-6">
            <h3 className="text-2xl font-bold text-gray-800">Laporan: {selected.name}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                value={`${Number(data.stats.averageScore || 0).toFixed(1)}%`}
                color="bg-orange-500"
              />
              <StatsCard
                icon={<FaChartLine />}
                title="Topik Dipelajari"
                value={data.stats.topicsLearned}
                color="bg-purple-500"
              />
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-lg font-semibold mb-2">Progres Skor Kuis per Topik</h4>
                {data.chartData?.length > 0 ? (
                  <ProgressChart data={data.chartData} />
                ) : (
                  <p>Belum ada progres kuis.</p>
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Aktivitas Terbaru</h4>
                <RecentActivity activities={data.recentActivities || []} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentTeacherDashboard;
