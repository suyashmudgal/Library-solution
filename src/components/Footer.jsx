import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Sparkles, QrCode, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-6 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-800 dark:border-slate-700">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="block font-black text-slate-900 dark:text-white text-base leading-tight tracking-tight">
                  CardMaker
                </span>
                <span className="block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Digital Membership Card System
                </span>
              </div>
            </Link>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              The modern digital membership card platform built for libraries, coaching institutes, study rooms, gyms, and organizations. Eliminate plastic cards and streamline approvals.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloud Integrated & Operational</span>
            </div>
          </div>

          {/* Member Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              For Members
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Register for Card</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Check Card Status</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Platform Features
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Supported Organizations
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Management (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Administration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Admin Portal Login</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/qr" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Reception QR Poster</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
          <p>© {currentYear} CardMaker • Digital Membership Card System. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast, verified digital cards with instant delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
