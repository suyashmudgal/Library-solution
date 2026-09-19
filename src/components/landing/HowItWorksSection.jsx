import React from 'react';
import { UserCheck, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Register',
      desc: 'Member scans the venue QR code or fills out the online registration form with their personal and membership details.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Approve',
      desc: 'Admin verifies the member application, checks fee payment, allocates desk/seat if needed, and approves with one click.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Get Your Card',
      desc: 'Member immediately receives their verified digital membership card. Easily view on phone, save to wallet, or print as PDF.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50/60 dark:bg-slate-950/60 px-4 sm:px-6 lg:px-8 scroll-mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Simple 3-Step Flow
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            How CardMaker Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            From registration to verified digital card delivery in minutes — frictionless for both members and administrators.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl dark:hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                <div>
                  {/* Top indicator & step number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      STEP {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/80 group-hover:scale-105 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle connector accent on desktop */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Seamless experience</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Quick Action */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
          >
            <span>Ready to test the registration flow?</span>
            <span className="underline underline-offset-4">Register as Member &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
