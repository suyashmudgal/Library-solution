import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Join from './pages/Join';
import ApplicationSubmitted from './pages/ApplicationSubmitted';
import Status from './pages/Status';
import Card from './pages/Card';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminQrPoster from './pages/AdminQrPoster';
import AdminAuthGuard from './components/AdminAuthGuard';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors duration-200">
          <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            {/* Direct QR scan entry route */}
            <Route path="/join" element={<Join />} />
            <Route path="/application-submitted" element={<ApplicationSubmitted />} />
            <Route path="/status" element={<Status />} />
            <Route path="/card/:memberId" element={<Card />} />
            {/* Protected Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminAuthGuard>
                  <Admin />
                </AdminAuthGuard>
              }
            />
            <Route
              path="/admin/qr"
              element={
                <AdminAuthGuard>
                  <AdminQrPoster />
                </AdminAuthGuard>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  </ThemeProvider>
  );
}
