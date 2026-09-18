import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import ApplicationSubmitted from './pages/ApplicationSubmitted';
import Status from './pages/Status';
import Card from './pages/Card';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/application-submitted" element={<ApplicationSubmitted />} />
            <Route path="/status" element={<Status />} />
            <Route path="/card/:memberId" element={<Card />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
