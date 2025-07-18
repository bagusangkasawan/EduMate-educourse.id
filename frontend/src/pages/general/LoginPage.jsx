import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../components/context/AuthContext.jsx';
import api from '../../utils/api.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const { login, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', { login, password });
      authLogin(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Login ke Akun Anda</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email atau Username</label>
          <input
            type="text"
            name="login"
            value={login}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
