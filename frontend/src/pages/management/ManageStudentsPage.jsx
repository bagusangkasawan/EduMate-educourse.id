import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/ui/Spinner';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaLink, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ManageStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachersAndParents, setTeachersAndParents] = useState([]);
  const [linkMap, setLinkMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    studentId: null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, parentsRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/history/teachers'),
        api.get('/admin/history/parents'),
      ]);
      setStudents(studentsRes.data);
      setTeachersAndParents([...teachersRes.data, ...parentsRes.data]);
    } catch (err) {
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLink = async (studentId) => {
    const linkedUserId = linkMap[studentId];
    if (!linkedUserId) return;

    try {
      await api.post('/admin/link-student', { studentId, targetUserId: linkMap[studentId] });
      setMessage('Berhasil menautkan siswa.');
      setError('');
      setLinkMap((prev) => ({ ...prev, [studentId]: '' }));
      fetchData();
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Gagal menautkan siswa.');
    }
  };

  const openDeleteModal = (studentId) => {
    setModalInfo({ isOpen: true, studentId });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/user/${modalInfo.studentId}`);
      setMessage('Akun siswa berhasil dihapus.');
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus akun siswa.');
    } finally {
      setModalInfo({ isOpen: false, studentId: null });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft />
        <span>Kembali</span>
      </button>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Akun Siswa</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Kode Siswa</th>
                <th className="py-2 px-4 border">Tanggal Daftar</th>
                <th className="py-2 px-4 border">Tautkan ke</th>
                <th className="py-2 px-4 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="py-2 px-4 border text-center">{student.name}</td>
                  <td className="py-2 px-4 border text-center">{student.username}</td>
                  <td className="py-2 px-4 border text-center">{student.email}</td>
                  <td className="py-2 px-4 border text-center">{student.studentCode}</td>
                  <td className="py-2 px-4 border text-center">
                    {format(new Date(student.createdAt), 'd MMM yyyy', { locale: id })}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    <select
                      value={linkMap[student._id] || ''}
                      onChange={(e) =>
                        setLinkMap((prev) => ({
                          ...prev,
                          [student._id]: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Pilih Guru/Orang Tua</option>
                      {teachersAndParents.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 border text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1 text-sm"
                        onClick={() => handleLink(student._id)}
                        disabled={!linkMap[student._id]}
                        title="Tautkan ke guru/ortu"
                      >
                        <FaLink />
                        Tautkan
                      </button>
                      <button
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 flex items-center gap-1 text-sm"
                        onClick={() => openDeleteModal(student._id)}
                        title="Hapus akun siswa"
                      >
                        <FaTrash />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    Tidak ada data siswa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ isOpen: false, studentId: null })}
        onConfirm={confirmDelete}
        title="Hapus Akun Siswa"
        message="Yakin ingin menghapus akun siswa ini secara permanen?"
        confirmText="Hapus"
      />
    </div>
  );
};

export default ManageStudentsPage;
