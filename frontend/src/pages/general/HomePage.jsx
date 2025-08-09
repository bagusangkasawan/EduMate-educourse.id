import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaChild, FaStar, FaUsers, FaTrophy, FaRobot } from 'react-icons/fa';
import heroBackground from '/hero.webp';

const FeatureCard = ({ icon, title, text }) => (
  <div className="group bg-white p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:shadow-2xl hover:scale-[1.03] hover:bg-blue-50">
    <div className="flex justify-center mb-4">
      {React.cloneElement(icon, {
        className: "text-4xl text-blue-500 group-hover:scale-110 transition-transform duration-300",
      })}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const Testimonial = ({ name, role, text }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col justify-between h-full 
                  transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-blue-50">
    <div className="text-gray-700 italic mb-4">"{text}"</div>
    <div className="mt-auto">
      <p className="font-bold text-blue-600">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

const HomePage = () => (
  <div className="text-center">
    {/* Hero Section */}
    <section className="relative h-[500px] flex items-center justify-start overflow-hidden">
      <img
        src={heroBackground}
        alt="Hero background"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="relative z-10 text-left px-4 sm:px-10 md:px-24 max-w-6xl w-full text-white">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-4">
          EduMate: Platform Belajar Interaktif
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Buat proses belajar lebih seru dengan gamifikasi, lacak perkembangan siswa secara real-time, dan libatkan orang tua dalam perjalanan belajar.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full 
                    hover:bg-blue-600 hover:text-white hover:shadow-xl hover:scale-105 
                    transition-all duration-300 ease-in-out text-lg group"
        >
          Akses Dashboard <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-10">Fitur Unggulan Kami</h2>
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
    </section>

    {/* Statistics Section */}
    <section className="py-16 bg-white px-4">
      <h2 className="text-3xl font-bold mb-10">Statistik Penggunaan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
        <div>
          <FaUsers className="text-4xl text-blue-500 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold">5.000+</h3>
          <p className="text-gray-600">Pengguna Terdaftar</p>
        </div>
        <div>
          <FaTrophy className="text-4xl text-blue-500 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold">12.000+</h3>
          <p className="text-gray-600">Lencana Diberikan</p>
        </div>
        <div>
          <FaRobot className="text-4xl text-blue-500 mb-2 mx-auto" />
          <h3 className="text-2xl font-bold">24/7</h3>
          <p className="text-gray-600">Bantuan AI Aktif</p>
        </div>
      </div>
    </section>

    {/* Testimonial Section */}
    <section className="py-16 bg-gray-100 px-4">
      <h2 className="text-3xl font-bold mb-10">Apa Kata Mereka?</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Testimonial
          name="Bunda Rina"
          role="Orang Tua Siswa"
          text="Saya jadi bisa tahu perkembangan anak saya setiap harinya. Platform ini benar-benar membantu."
        />
        <Testimonial
          name="Pak Ari"
          role="Pengajar"
          text="Kuis dan dashboard-nya sangat mudah untuk digunakan. Anak-anak jadi lebih semangat belajar."
        />
        <Testimonial
          name="Salsa"
          role="Siswa"
          text="Aku suka main kuis, ngerjain materi, dan dapet penghargaan! Asik banget belajarnya di EduMate."
        />
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 bg-blue-600 text-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Mulai Perjalanan Belajar Anda Hari Ini!</h2>
        <p className="text-lg mb-8">Daftar sekarang dan nikmati semua fitur interaktif EduMate secara gratis.</p>
        <Link
          to="/register"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full 
                    hover:text-blue-600 hover:bg-blue-100 hover:shadow-xl hover:scale-105
                    transition-all duration-300 ease-in-out text-lg"
        >
          Daftar Sekarang
        </Link>
      </div>
    </section>
  </div>
);

export default HomePage;
