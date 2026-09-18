import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { QrCode, ClipboardEdit, ShieldCheck, Download, Check, ArrowRight, BookOpen, Clock, Smartphone } from 'lucide-react';

export default function Home() {
  const steps = [
    {
      num: '01',
      title: 'Scan QR Code',
      desc: 'Scan the study room reception QR code from your mobile camera.',
      icon: QrCode,
    },
    {
      num: '02',
      title: 'Enter Details',
      desc: 'Fill in your name, seat number, and chosen membership plan.',
      icon: ClipboardEdit,
    },
    {
      num: '03',
      title: 'Get Verified',
      desc: 'Admin verifies your desk fee and instantly approves your card.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: 'Download Card',
      desc: 'Access your official digital card anytime, anywhere on your phone.',
      icon: Download,
    },
  ];

  const benefits = [
    'No physical card loss or damage',
    'Instant 2-minute registration',
    'Fast desk payment approval',
    'Official digital card on your phone',
  ];

  return (
    <div className="flex-1 flex flex-col justify-center">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Digital Study Room Pass System</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-5">
            Your Study Room Membership,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              Now Digital.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Register once, get approved, and download your digital membership card — no physical card required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-12">
            <Link to="/register" className="w-full sm:w-auto flex-1">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full text-base font-bold shadow-md hover:shadow-lg"
              >
                Get Membership Card
              </Button>
            </Link>
            <Link to="/status" className="w-full sm:w-auto flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base font-semibold"
              >
                Check Application Status
              </Button>
            </Link>
          </div>

          {/* Key Benefits List */}
          <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-left text-xs sm:text-sm text-slate-700 bg-white/70 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-slate-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Process Timeline */}
      <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Simple 4-Step Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From scanning the QR code outside the study room to carrying your card on your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 transition-all hover:shadow-md text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      STEP {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick QR Info Notice */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-xl mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-center gap-5 text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-bold text-white">
              Visiting the study room right now?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Scan the physical QR printed at the entrance or reception desk to open registration instantly.
            </p>
          </div>
          <Link to="/register" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
