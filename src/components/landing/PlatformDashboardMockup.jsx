import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function PlatformDashboardMockup() {
  const recentMembers = [
    {
      name: 'Sarah Jenkins',
      id: 'CM-8492',
      org: 'Apex Academy',
      type: 'Academy',
      plan: 'Full Term',
      status: 'ACTIVE',
      time: 'Just now',
    },
    {
      name: 'Rohan Mehta',
      id: 'CM-8491',
      org: 'Central Co-Study',
      type: 'Study Room',
      plan: 'Desk #18',
      status: 'APPROVED',
      time: '3m ago',
    },
    {
      name: 'Elena Rostova',
      id: 'CM-8490',
      org: 'Titan Fitness',
      type: 'Gym & Club',
      plan: 'Annual Pass',
      status: 'ACTIVE',
      time: '12m ago',
    },
  ];

  return (
    <div className="relative w-full max-w-xl lg:max-w-none mx-auto select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-emerald-500/20 via-teal-400/15 to-indigo-500/15 dark:from-emerald-500/15 dark:via-teal-400/10 dark:to-indigo-500/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main SaaS Platform Window Shell */}
      <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 hover:border-slate-300 dark:hover:border-slate-700">
        
        {/* Window Top Navigation Bar */}
        <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
            </div>
            <div className="h-3 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>CardMaker Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Connected</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-slate-50/70 dark:from-slate-900/90 to-white dark:to-slate-950/90">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Cards Issued
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white">2,480+</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +18%
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Verification
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-black text-emerald-700 dark:text-emerald-400">Instant</span>
                <span className="text-[10px] text-slate-400 font-medium">QR/ID</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Paper Saved
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white">100%</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Zero waste</span>
              </div>
            </div>
          </div>

          {/* Central Showcase: Generic CardMaker Pass + Member Stream */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Generic High-Tech Digital Pass Preview (Left 6 cols) */}
            <div className="md:col-span-6 relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-5 shadow-xl border border-slate-800 overflow-hidden group">
                
                {/* Visual holographic background accent */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />

                {/* Pass Header */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                      CM
                    </div>
                    <div>
                      <span className="block text-xs font-black tracking-tight text-white">
                        CardMaker Pass
                      </span>
                      <span className="block text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                        Digital Membership
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-extrabold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                {/* Pass Body Info */}
                <div className="relative z-10 py-3 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Member Name</span>
                    <span className="text-xs font-bold text-white tracking-wide">Sarah Jenkins</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Member ID</span>
                    <span className="text-xs font-mono font-black text-emerald-400">#CM-8492</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Category</span>
                    <span className="text-[11px] font-semibold text-slate-200">Annual Membership</span>
                  </div>
                </div>

                {/* Pass Footer */}
                <div className="relative z-10 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                  <div className="flex items-center gap-1 text-slate-300 font-mono">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan for Instant Verification</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">2026-2027</span>
                </div>

              </div>
            </div>

            {/* Live Activity Stream (Right 6 cols) */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                <span>Recent Memberships</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync
                </span>
              </div>

              <div className="space-y-2">
                {recentMembers.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[9px] font-mono font-semibold text-slate-400 truncate shrink-0">
                            {item.id}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                          {item.org} • {item.plan}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Features Strip */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Multi-Organization Compatible</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Admin Approved Workflow</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Instant PDF Generation</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
