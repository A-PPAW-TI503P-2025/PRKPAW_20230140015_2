import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPresensiPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } catch (error) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      navigate("/login");
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const greet = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  if (!userData) return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  const userName = userData.nama || userData.name || "Pengguna";

  return (
    <div className="min-h-screen fade-in">
      {/* Navbar */}
      <nav className="bg-white/60 backdrop-blur-xl shadow-sm p-4 flex justify-between items-center sticky top-0 z-20 rounded-b-2xl">
        <h1 className="text-lg font-bold text-primary">Dashboard Presensi</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-danger hover:bg-danger/80 text-white rounded-xl font-semibold shadow-sm transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {/* Welcome Card */}
        <div className="bg-primary text-white rounded-3xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold">{greet()}, {userName}! ✨</h2>
          <p className="text-white/80 mt-1">
            Anda login sebagai: <span className="font-semibold">{userData.role}</span>
          </p>

          {/* Clock */}
          <div className="mt-4 bg-white/25 p-4 rounded-xl inline-block shadow-sm">
            <p className="text-2xl font-semibold">
              {currentTime.toLocaleTimeString("id-ID")}
            </p>
            <p className="text-sm text-white">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Menu */}
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Menu Presensi</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-success">
            <p className="font-bold text-success">Isi Presensi</p>
            <p className="text-sm text-gray-500 mt-1">Catat kehadiran hari ini</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-secondary">
            <p className="font-bold text-secondary">Riwayat Presensi</p>
            <p className="text-sm text-gray-500 mt-1">Lihat presensi sebelumnya</p>
          </button>

          <button className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition border-l-4 border-warning">
            <p className="font-bold text-warning">Status Kehadiran</p>
            <p className="text-sm text-gray-500 mt-1">Cek status aktif</p>
          </button>
        </div>

        {/* Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-md mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Aktivitas Terbaru
          </h3>

          <div className="p-4 bg-gray-100 rounded-xl mb-3">
            <p className="font-medium text-primary">Login berhasil 🎉</p>
            <p className="text-sm text-gray-600">
              Baru saja • {currentTime.toLocaleTimeString("id-ID")}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl">
            <p className="font-medium text-gray-800">Presensi terakhir</p>
            <p className="text-sm text-gray-600">Hari ini • 07:45</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPresensiPage;