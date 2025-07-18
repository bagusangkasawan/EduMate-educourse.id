import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaChild, FaStar } from 'react-icons/fa';

const FeatureCard = ({ icon, title, text }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
    <div className="flex justify-center mb-4">
      {React.cloneElement(icon, { className: "text-4xl text-blue-500" })}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const HomePage = () => (
  <div className="text-center">
    {/* Hero Section */}
    <div className="bg-blue-600 text-white py-20 px-4 rounded-lg shadow-xl">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Selamat Datang di <span className="font-extrabold">EduMate</span>
        <div className="text-sm font-medium text-white mt-1">by educourse.id</div>
      </h1>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Platform belajar interaktif yang membuat pendidikan menyenangkan melalui
        gamifikasi, pelacakan progres, dan keterlibatan orang tua.
      </p>
      <Link
        to="/dashboard"
        className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition text-lg"
      >
        Akses Dashboard →
      </Link>
    </div>

    {/* Features Section */}
    <div className="py-16">
      <h2 className="text-3xl font-bold mb-10">Fitur Unggulan Kami</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          icon={<FaChild />}
          title="Pembelajaran Menarik"
          text="Sistem kuis dan penghargaan yang membuat siswa termotivasi dan tidak mudah bosan."
        />
        <FeatureCard
          icon={<FaChalkboardTeacher />}
          title="Dashboard Pemantauan"
          text="Orang tua dan guru dapat memantau perkembangan siswa secara real-time dan transparan."
        />
        <FeatureCard
          icon={<FaStar />}
          title="Gamifikasi & AI"
          text="Kumpulkan lencana, capai skor tertinggi, dan dapatkan bantuan dari asisten AI kapan saja."
        />
      </div>
    </div>
  </div>
);

export default HomePage;
