import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "mahasiswa",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3001/api/auth/register", {
        nama: formData.nama,     // ✔ SUDAH DIBETULKAN
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 fade-in">
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl backdrop-blur-sm">

        <h1 className="text-3xl font-bold text-center text-primary mb-1">
          Register
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Buat akun baru Anda
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm text-center shadow-sm">
            Registrasi berhasil! Mengarahkan...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm text-center shadow-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              placeholder="Nama lengkap"
              value={formData.nama}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Daftar sebagai</label>
            <div className="flex gap-6 mt-1 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="mahasiswa"
                  checked={formData.role === "mahasiswa"}
                  onChange={handleChange}
                  className="text-primary focus:ring-primary"
                />
                Mahasiswa
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="text-primary focus:ring-primary"
                />
                Admin
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary/80 transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Sudah punya akun?
          <Link to="/login" className="text-primary ml-1 font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;