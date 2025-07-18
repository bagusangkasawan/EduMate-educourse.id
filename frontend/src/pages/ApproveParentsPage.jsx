import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../components/context/AuthContext';
import Spinner from '../components/ui/Spinner';
import api from '../utils/api';

const ApproveParentsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingParents, setPendingParents] = useState([]);
  const [historyParents, setHistoryParents] = useState([]);
  const [parentError, setParentError] = useState('');
  const [parentLoading, setParentLoading] = useState(true);

  const fetchParentAccounts = async () => {
    setParentLoading(true);
    try {
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/admin/pending/parents'),
        api.get('/admin/history/parents'),
      ]);
      setPendingParents(pendingRes.data);
      setHistoryParents(historyRes.data);
    } catch (err) {
      setParentError('Gagal memuat data akun orang tua.');
    } finally {
      setParentLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/admin/approve/${userId}`);
      fetchParentAccounts();
    } catch {
      setParentError('Gagal menyetujui akun.');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Yakin ingin menolak pendaftaran ini?')) {
      try {
        await api.put(`/admin/reject/${userId}`);
        fetchParentAccounts();
      } catch {
        setParentError('Gagal menolak akun.');
      }
    }
  };

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchParentAccounts();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Kembali</span>
      </button>
      <h1 className="text-2xl font-semibold mb-6">Persetujuan Akun Orang Tua</h1>

      {parentError && <p className="text-red-500 text-sm mb-4">{parentError}</p>}

      {/* Pending Parents */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Pendaftaran Menunggu</h2>
        {parentLoading ? (
          <Spinner />
        ) : pendingParents.length > 0 ? (
          <ul className="space-y-3">
            {pendingParents.map(user => (
              <li key={user._id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{user.name} (@{user.username})</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                    title="Setujui"
                  >
                    <FaCheck className="text-base" />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                    title="Tolak"
                  >
                    <FaTimes className="text-base" />
                    Tolak
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada pendaftaran orang tua yang menunggu.</p>
        )}
      </div>

      {/* History Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Riwayat Persetujuan / Penolakan</h2>
        {parentLoading ? (
          <Spinner />
        ) : historyParents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-center">Nama</th>
                  <th className="py-2 px-4 border-b text-center">Username</th>
                  <th className="py-2 px-4 border-b text-center">Email</th>
                  <th className="py-2 px-4 border-b text-center">Tanggal Daftar</th>
                  <th className="py-2 px-4 border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyParents.map(user => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-center">{user.name}</td>
                    <td className="py-2 px-4 border-b text-center">{user.username}</td>
                    <td className="py-2 px-4 border-b text-center">{user.email}</td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2 px-4 border-b text-center capitalize">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Belum ada riwayat persetujuan atau penolakan.</p>
        )}
      </div>
    </div>
  );
};

export default ApproveParentsPage;
