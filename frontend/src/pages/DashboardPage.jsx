import React, { useContext } from 'react';
import AuthContext from '../components/context/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import ParentTeacherDashboard from '../components/dashboard/ParentTeacherDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import Spinner from '../components/ui/Spinner';

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;
  if (!user) return <p className="text-center">Silakan login untuk melihat dashboard.</p>;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'parent':
    case 'teacher':
      return <ParentTeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <p className="text-center text-red-500">Peran tidak dikenali.</p>;
  }
};

export default DashboardPage;
