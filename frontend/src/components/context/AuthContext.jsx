import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../utils/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  });

  // Logout: hapus token dan reset state auth
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    });
  }, []);

  // Fetch profil user saat token valid
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/users/profile');
      setAuth((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: res.data,
        loading: false
      }));
    } catch (error) {
      logout();
    }
  }, [logout]);

  // Cek token dan validasi user saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          fetchUser();
        }
      } catch (err) {
        logout();
      }
    } else {
      setAuth((prev) => ({
        ...prev,
        loading: false
      }));
    }
  }, [fetchUser, logout]);

  // Login: simpan token dan set user
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

    const { _id, name, username, email, role, children, studentCode } = userData;

    setAuth({
      token: userData.token,
      isAuthenticated: true,
      loading: false,
      user: { _id, name, username, email, role, children, studentCode }
    });
  };

  // Update data user di state
  const updateUser = (newUserData) => {
    setAuth((prev) => ({
      ...prev,
      user: newUserData
    }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, updateUser }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
