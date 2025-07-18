import React, { useContext, useState } from 'react';
import AuthContext from '../components/context/AuthContext';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaCopy, FaCheck, FaUser } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  if (!user) return <p className="text-center">Loading...</p>;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-gray-400 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Nama Lengkap</p>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center space-x-4">
          <FaUser className="text-gray-400 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-medium">@{user.username}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-4">
          <FaEnvelope className="text-gray-400 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
        </div>

        {/* Peran */}
        <div className="flex items-center space-x-4">
          <FaIdBadge className="text-gray-400 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Peran</p>
            <p className="text-lg font-medium capitalize">{user.role}</p>
          </div>
        </div>

        {/* Kode Siswa */}
        {user.role === 'student' && user.studentCode && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Bagikan kode ini pada orang tua/guru:</p>
            <div className="flex items-center space-x-4 bg-gray-100 p-3 rounded-lg">
              <p className="text-2xl font-mono tracking-widest text-blue-600">{user.studentCode}</p>
              <button onClick={() => copyToClipboard(user.studentCode)} className="text-gray-500 hover:text-blue-600">
                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
