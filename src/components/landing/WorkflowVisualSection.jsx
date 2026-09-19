import React from 'react';
import { QrCode, FileText, CheckCircle2, CreditCard, User, ChevronRight } from 'lucide-react';

export default function WorkflowVisualSection() {
  const steps = [
    {
      icon: QrCode,
      name: 'QR Code',
      desc: 'Member scans QR standee at reception',
      badge: 'Step 1',
    },
    {
      icon: FileText,
      name: 'Registration',
      desc: 'Fills quick online details from mobile',
      badge: 'Step 2',
    },
    {
      icon: CheckCircle2,
      name: 'Admin Approval',
      desc: 'Admin verifies fee and approves card',
      badge: 'Step 3',
    },
    {
      icon: CreditCard,
      name: 'Digital Card',
      desc: 'Card generated with unique Member ID',
      badge: 'Step 4',
    },
    {
      icon: User,
      name: 'Member Access',
      desc: 'Instant mobile view & PDF download',
      badge: 'Step 5',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white dark:from-slate-900 via-slate-50/70 dark:via-slate-950 to-white dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            End-To-End Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            How data flows through CardMaker
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            A frictionless automated chain from venue QR scan to verified digital card delivery.
          </p>
        </div>

        {/* Workflow Chain Visual */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200 dark:from-emerald-800 dark:via-teal-700 dark:to-emerald-800 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center group hover:-translate-y-1"
                >
                  {/* Badge */}
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full mb-3">
                    {item.badge}
                  </span>

                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200/80 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Flow Arrow for mobile/tablet */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden mt-4 text-emerald-500">
                      <ChevronRight className="w-5 h-5 mx-auto rotate-90 sm:rotate-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
