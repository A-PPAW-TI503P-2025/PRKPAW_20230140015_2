import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
// Pastikan nama file di sini disesuaikan jika berbeda, 
// saya menggunakan DashboardPresensiPage yang Anda berikan
import DashboardPage from './components/DashboardPage'; 

function App() {
  return (
    <Router>
      <div>
        {/* Navigasi - Disesuaikan dengan tema pastel */}
        <nav className="p-4 bg-white/70 backdrop-blur-sm shadow-md flex justify-center sticky top-0 z-20">
          <Link 
             to="/login" 
             className="mr-6 text-gray-700 hover:text-primary font-semibold transition duration-150"
          >
             Login
          </Link>
          <Link 
             to="/register" 
             className="text-gray-700 hover:text-primary font-semibold transition duration-150"
          >
             Register
          </Link>
        </nav>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;