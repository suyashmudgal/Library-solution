import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Menu, X, Search, ArrowRight } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${anchorId}`);
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Product Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 dark:bg-slate-800 text-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 border border-slate-800 dark:border-slate-700">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="block font-black text-slate-950 dark:text-white text-lg sm:text-xl leading-none tracking-tight">
                CardMaker
              </span>
              <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-1">
                Digital Membership Card System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              How It Works
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('use-cases')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              Use Cases
            </button>

            <Link
              to="/status"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/status')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-75" />
              <span>Check Status</span>
            </Link>

            <Link
              to="/admin"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/admin')
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Right Action / CTA & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <div className="hidden sm:block">
              <Link to="/admin/login">
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-lg">
          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('features')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('use-cases')}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850"
          >
            Use Cases
          </button>

          <Link
            to="/status"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
              isActive('/status') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Check Application Status</span>
            </div>
          </Link>

          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
              isActive('/admin') ? 'bg-slate-900 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Admin Portal</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
              Staff
            </span>
          </Link>

          <div className="pt-2">
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full font-bold bg-emerald-600 text-white"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
