import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import PlatformDashboardMockup from './PlatformDashboardMockup';
import { ArrowRight, CheckCircle2, ArrowDown, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection() {
  const handleScrollToExplore = (e) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 dark:from-slate-950 via-white dark:via-slate-900 to-slate-50/60 dark:to-slate-950 transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-100/40 dark:bg-teal-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: High-Impact SaaS Copy & CTAs (7 Cols on desktop) */}
          <div className="lg:col-span-6 text-left">
            
            {/* Category Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs animate-fadeIn">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Digital Membership Card Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.1] mb-6">
              Digital Membership Cards,{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500">
                Made Simple.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl">
              Create, manage, approve, and deliver digital membership cards for your organization — without the hassle of physical cards.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 max-w-md">
              <Link to="/admin/login" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full text-base font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Get Started
                </Button>
              </Link>

              <a
                href="#how-it-works"
                onClick={handleScrollToExplore}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="lg"
                  icon={ArrowDown}
                  iconPosition="right"
                  className="w-full text-base font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust Points */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>QR Registration</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Instant Approvals</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>100% Digital Pass</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Product Platform Mockup (5 Cols on desktop) */}
          <div className="lg:col-span-6 w-full">
            <PlatformDashboardMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
