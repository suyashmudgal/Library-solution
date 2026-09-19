import React from 'react';
import { BookOpen, GraduationCap, Library, Dumbbell, Users, Building2, CheckCircle2 } from 'lucide-react';

export default function UseCasesSection() {
  const useCases = [
    {
      icon: BookOpen,
      name: 'Libraries',
      desc: 'Issue digital library cards, track membership expiration dates, and verify active borrowers instantly without paper cards.',
      badge: 'Public & Private',
      tagline: 'Streamlined book borrowing passes',
    },
    {
      icon: GraduationCap,
      name: 'Coaching & Academies',
      desc: 'Issue digital student identity cards with enrolled batch details, validity periods, and verified admission numbers.',
      badge: 'Institutes & Tutors',
      tagline: 'Student batch verification',
    },
    {
      icon: Library,
      name: 'Study Rooms & Reading Halls',
      desc: 'Allocate seats, assign daily/monthly shifts, manage desk payments, and give students instant digital door passes.',
      badge: 'Co-study Spaces',
      tagline: 'Seat & desk pass management',
    },
    {
      icon: Dumbbell,
      name: 'Gyms & Fitness Centers',
      desc: 'Provide members with a digital fitness card showing their subscription plan, active status, and renewal due date.',
      badge: 'Health & Wellness',
      tagline: 'Subscription pass tracking',
    },
    {
      icon: Users,
      name: 'Clubs & Communities',
      desc: 'Manage verified member badges for recreational clubs, non-profits, volunteer groups, and hobby associations.',
      badge: 'Membership Clubs',
      tagline: 'Community membership passes',
    },
    {
      icon: Building2,
      name: 'Organizations & Workspaces',
      desc: 'Distribute staff, intern, or contractor digital badges with photo verification and department credentials.',
      badge: 'Corporate & Venues',
      tagline: 'Visitor & employee credentials',
    },
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 scroll-mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Versatile Platform
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Built for organizations of all kinds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Whether you run a quiet reading room, an active gym, or a bustling educational academy, CardMaker scales to fit your membership workflow.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 transition-all duration-300 hover:shadow-xl dark:hover:shadow-emerald-950/20 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                    {item.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Full digital pass support</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
