import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaChild, FaStar } from 'react-icons/fa';
import heroBackground from '/hero.webp';

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
    <section className="relative h-[500px] sm:h-[480px] md:h-[450px] flex items-center justify-start overflow-hidden">
      {/* Lazy-loaded image as background */}
      <img
        src={heroBackground}
        alt="Hero background"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      {/* Content */}
      <div className="relative z-10 text-left px-4 sm:px-10 md:px-24 max-w-6xl w-full text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug mb-4">
          EduMate: Platform Belajar Interaktif
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl">
          Buat proses belajar lebih seru dengan gamifikasi, lacak perkembangan siswa secara real-time,
          dan libatkan orang tua dalam perjalanan belajar.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-white text-blue-600 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full hover:bg-gray-200 transition text-base sm:text-lg"
        >
          Akses Dashboard →
        </Link>
      </div>
    </section>

    {/* Features Section */}
    <div className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10">Fitur Unggulan Kami</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
