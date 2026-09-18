import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>CardMaker</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>कंसाना टावर, प्री सैनिक स्कूल के पास, गुड़ी-गुड़ा का नाका</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>9806248236, 9630852930</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link to="/register" className="hover:text-emerald-600 transition-colors">
              New Registration
            </Link>
            <span>•</span>
            <Link to="/status" className="hover:text-emerald-600 transition-colors">
              Card Status
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-emerald-600 transition-colors font-medium">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} CardMaker • Digital Membership Card System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fast, official digital membership system</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
