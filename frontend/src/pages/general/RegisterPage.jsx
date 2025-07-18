import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, username, email, password, password2, role } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Password tidak cocok');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/users', formData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setSuccess(data.message);
      }
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Buat Akun Baru</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4"><p>{success}</p><p className="mt-2 text-sm">Silakan tunggu persetujuan untuk dapat login.</p><Link to="/login" className="font-bold hover:underline">Kembali ke halaman Login</Link></div>}
      {!success && (
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Lengkap</label>
            <input type="text" name="name" value={name} onChange={onChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input type="text" name="username" value={username} onChange={onChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Saya adalah</label>
            <select name="role" value={role} onChange={onChange} className="w-full p-2 border rounded-lg bg-white">
              <option value="student">Siswa</option>
              <option value="parent">Orang Tua</option>
              <option value="teacher">Guru</option>
            </select>
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full p-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700">Konfirmasi Password</label>
            <input
              type={showPassword2 ? 'text' : 'password'}
              name="password2"
              value={password2}
              onChange={onChange}
              required
              minLength="6"
              className="w-full p-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
            >
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            {loading ? <Spinner size="sm" /> : 'Daftar'}
          </button>
        </form>
      )}
      {!success &&
        <p className="text-center mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login di sini</Link>
        </p>
      }
    </div>
  );
};

export default RegisterPage;
