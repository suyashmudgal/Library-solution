import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  QrCode,
  Users,
  Clock,
  FileDown,
  Table,
  LayoutDashboard,
  Check,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: 'Digital Membership Cards',
      desc: 'Official, tamper-resistant digital cards with member ID, plan validity, seat number, and dynamic status indicators.',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Approval Workflow',
      desc: 'Intuitive review queue where staff verify applicant details, assign seats, confirm fees, and approve in one click.',
    },
    {
      icon: QrCode,
      title: 'QR Code Registration',
      desc: 'Printable reception QR poster allows members to scan from their smartphone and sign up on the spot without assistance.',
    },
    {
      icon: Users,
      title: 'Member Data Management',
      desc: 'Structured member records organized with name, father name, phone number, plan, join date, and expiration tracking.',
    },
    {
      icon: Clock,
      title: 'Automatic Status Updates',
      desc: 'Real-time status polling for applicants to track whether their membership is pending, approved, or active.',
    },
    {
      icon: FileDown,
      title: 'PDF Card Download',
      desc: 'Members can instantly generate and download high-resolution PDF cards suitable for digital wallets or physical printing.',
    },
    {
      icon: Table,
      title: 'Google Sheets Integration',
      desc: 'Seamless cloud sync directly to Google Sheets for dependable data storage, audit trail, and zero expensive database costs.',
    },
    {
      icon: LayoutDashboard,
      title: 'Simple Admin Dashboard',
      desc: 'Clean, responsive control panel for staff with member search, category filtering, stats summary, and quick actions.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/50 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Real Features, Real Efficiency
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Designed for seamless card administration
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Every feature in CardMaker is built to simplify real-world membership operations and replace unnecessary manual overhead.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Fully Integrated</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
