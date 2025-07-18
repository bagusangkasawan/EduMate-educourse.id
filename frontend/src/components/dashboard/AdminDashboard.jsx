import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../../utils/api.js';
import Spinner from '../ui/Spinner';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { 
  FaCheck, 
  FaTimes, 
  FaTrash, 
  FaRedo, 
  FaBookReader, 
  FaTrophy,
  FaUserCheck
} from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [pendingParents, setPendingParents] = useState([]);
  const [historyTeachers, setHistory] = useState([]);
  const [historyParents, setHistoryParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    userId: null,
    action: ''
  });

  const fetchTeachersAndParents = async () => {
    try {
      setLoading(true);
      const [pendingTeachersRes, historyTeachersRes, pendingParentsRes, historyParentsRes] = await Promise.all([
        api.get('/admin/pending/teachers'),
        api.get('/admin/history/teachers'),
        api.get('/admin/pending/parents'),
        api.get('/admin/history/parents')
      ]);
      setPendingTeachers(pendingTeachersRes.data);
      setHistory(historyTeachersRes.data);
      setPendingParents(pendingParentsRes.data);
      setHistoryParents(historyParentsRes.data);
    } catch (err) {
      setError('Gagal memuat data guru dan orang tua.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachersAndParents();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.put(`/admin/approve/${userId}`);
      fetchTeachersAndParents();
    } catch (err) {
      setError('Gagal menyetujui akun.');
    }
  };

  const handleReject = (userId) => {
    setModalInfo({ isOpen: true, userId, action: 'reject' });
    console.log('Menolak user dengan ID:', modalInfo.id);
  };

  const handleSetActive = async (userId) => {
    try {
      await api.put(`/admin/set-active/${userId}`);
      fetchTeachersAndParents();
    } catch (err) {
      setError('Gagal mengaktifkan ulang akun.');
    }
  };

  const handleDelete = (userId) => {
    setModalInfo({ isOpen: true, userId, action: 'delete' });
  };

  const confirmAction = async () => {
    try {
      if (modalInfo.action === 'delete') {
        await api.delete(`/admin/user/${modalInfo.userId}`);
      } else if (modalInfo.action === 'reject') {
        await api.put(`/admin/reject/${modalInfo.userId}`);
      }

      setModalInfo({ isOpen: false, userId: null, action: '' });
      fetchTeachersAndParents();
    } catch (err) {
      setError(`Gagal ${modalInfo.action === 'delete' ? 'menghapus' : 'menolak'} akun.`);
      setModalInfo({ isOpen: false, userId: null, action: '' });
    }
  };

  const ContentManagement = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manajemen Konten & Siswa</h2>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
        <Link
          to="/topics"
          className="bg-indigo-500 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-600"
        >
          <FaBookReader />
          <span>Manajemen Topik, Materi & Kuis</span>
        </Link>
        <Link
          to="/manage-students"
          className="bg-emerald-500 text-white p-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600"
        >
          <FaUserCheck />
          <span>Manajemen Akun Siswa</span>
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
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>

      {user.role === 'admin' && <ContentManagement />}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Persetujuan Akun Guru dan Orang Tua</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nama</th>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Peran</th>
                  <th className="py-2 px-4 border-b">Tanggal Daftar</th>
                  <th className="py-2 px-4 border-b">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[...pendingTeachers, ...pendingParents].length > 0 ? (
                  [...pendingTeachers, ...pendingParents].map(user => (
                    <tr key={user._id}>
                        <td className="py-2 px-4 border-b text-center">{user.name}</td>
                        <td className="py-2 px-4 border-b text-center">{user.username}</td>
                        <td className="py-2 px-4 border-b text-center">{user.email}</td>
                        <td className="py-2 px-4 border-b text-center capitalize">{user.role}</td>
                        <td className="py-2 px-4 border-b text-center">
                        {format(new Date(user.createdAt), 'd MMM yyyy', { locale: id })}
                        </td>
                        <td className="py-2 px-4 border-b">
                        <div className="flex gap-2 justify-center text-sm">
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
                        </td>
                    </tr>
                  )) 
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Tidak ada pendaftaran guru atau orang tua yang menunggu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Riwayat Guru dan Orang Tua yang sudah diproses */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Riwayat Persetujuan / Penolakan</h2>
        {loading ? <Spinner /> : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Nama</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Peran</th>
                    <th className="py-2 px-4 border-b">Tanggal Daftar</th>
                    <th className="py-2 px-4 border-b text-center">Status</th>
                    <th className="py-2 px-4 border-b text-center">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {[...historyTeachers, ...historyParents].length > 0 ? (
                  [...historyTeachers, ...historyParents].map((user) => (
                    <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-center">{user.name}</td>
                    <td className="py-2 px-4 border-b text-center">{user.username}</td>
                    <td className="py-2 px-4 border-b text-center">{user.email}</td>
                    <td className="py-2 px-4 border-b text-center capitalize">{user.role}</td>
                    <td className="py-2 px-4 border-b text-center">
                        {format(new Date(user.createdAt), 'd MMM yyyy', { locale: id })}
                    </td>
                    <td className="py-2 px-4 border-b text-center capitalize">{user.status}</td>
                    <td className="py-2 px-4 border-b text-center">
                        <div className="flex gap-2 justify-center text-sm">
                        {user.status === 'rejected' && (
                            <>
                            <button
                                onClick={() => handleSetActive(user._id)}
                                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                                title="Aktifkan kembali"
                            >
                                <FaRedo className='text-base'/>
                                Aktifkan
                            </button>
                            <button
                                onClick={() => handleDelete(user._id)}
                                className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                                title="Hapus permanen"
                            >
                                <FaTrash className='text-base'/>
                                Hapus
                            </button>
                            </>
                        )}
                        {user.status === 'active' && (
                            <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                            title="Hapus akun"
                            >
                            <FaTrash className='text-base'/>
                            Hapus
                            </button>
                        )}
                        </div>
                    </td>
                    </tr>
                  )) 
                ) : (
                    <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                        Belum ada riwayat persetujuan atau penolakan.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, userId: null, action: '' })}
        onConfirm={confirmAction}
        title={modalInfo.action === 'delete' ? 'Hapus Akun' : 'Tolak Akun'}
        message={
          modalInfo.action === 'delete'
            ? 'Yakin ingin menghapus akun ini secara permanen?'
            : 'Yakin ingin menolak akun ini?'
        }
        confirmText={modalInfo.action === 'delete' ? 'Hapus' : 'Tolak'}
      />
    </div>
  );
};

export default AdminDashboard;
