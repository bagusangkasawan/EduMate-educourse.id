# 📘 EduMate (educourse.id) — Platform Edukasi Interaktif

**EduMate** adalah aplikasi berbasis web yang dirancang untuk memfasilitasi proses belajar interaktif antara siswa, guru, dan orang tua. Aplikasi ini menyediakan fitur manajemen materi, kuis, pelaporan progres, dan sistem penghargaan untuk meningkatkan motivasi belajar.

---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Peran Pengguna

* **Siswa**: Mengakses materi dan kuis, serta mendapatkan rewards.
* **Guru**: Menambah, mengedit materi dan kuis, mengelola rewards, dan menyetujui akun orang tua.
* **Orang Tua**: Melihat progres siswa, menautkan anak dengan kode unik.
* **Admin**: Menyetujui akun guru/orang tua dan mengelola siswa.

### 📚 Materi & Kuis

* CRUD (Create, Read, Update, Delete) topik, materi, dan kuis.
* Review hasil kuis.

### 🏆 Sistem Reward

* Guru/Admin dapat menambahkan reward untuk memotivasi siswa.
* Siswa dapat menukar poin dengan reward.

### 📊 Dashboard Interaktif

* Statistik kuis, materi selesai, topik dipelajari.
* Grafik skor dan aktivitas terbaru siswa (untuk orang tua & guru).

### 🤖 Chatbot

* Chatbot edukatif berbasis AI untuk mendukung siswa belajar mandiri.

---

## ⚙️ Teknologi yang Digunakan

### 🔧 Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **RESTful API**
* **Express Async Handler & Middleware**

### 💻 Frontend

* **React.js (Vite) + React Router**
* **Tailwind CSS**
* **Axios**
* **Date-fns** (lokalisasi tanggal)
* **React Icons**

---

## 🛠️ Instalasi & Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/bagusangkasawan/EduMate-educourse.id.git
cd EduMate-educourse.id
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` dan isi dengan konfigurasi:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Untuk membuat akun admin default, jalankan:

```bash
node admin/seedAdmin.js
```

Lalu jalankan backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env` dan isi dengan konfigurasi:

```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

Lalu jalankan frontend:

```bash
npm run dev
```

---

## 🌐 Rute API (Utama)

* `POST /api/users/register` – Registrasi user
* `POST /api/users/login` – Login user
* `GET /api/topics` – List topik
* `GET /api/admin/students` – List semua siswa (admin)
* `POST /api/admin/link-student` – Tautkan siswa ke guru/ortu
* Dan banyak lagi di `routes/`...

---

## 📂 Struktur Folder (Singkat)

```
/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── admin/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── general/
│       │   ├── topic/
│       │   ├── quiz/
│       │   ├── lesson/
│       │   ├── reward/
│       │   └── management/
│       ├── components/
│       │   ├── layout/
│       │   ├── routing/
│       │   ├── context/
│       │   ├── ui/
│       │   ├── dashboard/
│       │   └── chatbot/
│       ├── utils/
│       └── App.jsx
│
└── README.md
```

---

## 🧠 Kontributor

* 🧑‍💻 **Bagus Angkasawan Sumantri Putra** – Developer

---

## 📄 Hak Cipta

© 2025 Bagus Angkasawan Sumantri Putra. Seluruh hak cipta dilindungi undang-undang.
