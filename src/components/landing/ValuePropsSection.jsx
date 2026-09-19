import React from 'react';
import { Zap, Smartphone, BarChart3, Coins, Sparkles } from 'lucide-react';

export default function ValuePropsSection() {
  const valueProps = [
    {
      icon: Zap,
      title: 'Fast Approval',
      desc: 'Approve membership requests and issue cards quickly with streamlined admin verification.',
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200/70 dark:border-amber-800/60',
    },
    {
      icon: Smartphone,
      title: 'Digital First',
      desc: 'Give members instant access to their official digital membership card right from their phones.',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200/70 dark:border-emerald-800/60',
    },
    {
      icon: BarChart3,
      title: 'Simple Management',
      desc: 'Manage member information, seat numbers, fees, and validity using the existing admin workflow.',
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200/70 dark:border-blue-800/60',
    },
    {
      icon: Coins,
      title: 'Reduce Physical Card Costs',
      desc: 'Replace repetitive physical card printing and lost card replacements with permanent digital cards.',
      iconColor: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-200/70 dark:border-teal-800/60',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3 border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Why Choose CardMaker</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Everything you need to manage digital memberships
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Eliminate paperwork, speed up verification, and deliver an elevated membership experience to your users.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-700/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.borderColor} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
