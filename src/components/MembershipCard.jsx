import React, { forwardRef } from 'react';
import { formatDate, isMembershipExpired } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import { Phone, CheckCircle2, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';

const MembershipCard = forwardRef(function MembershipCard(
  { member, className = '' },
  ref
) {
  if (!member) return null;

  const isExpired = isMembershipExpired(member.validTill) || member.cardStatus === 'EXPIRED';
  const isApproved = member.status === 'APPROVED';
  const isActive = isApproved && !isExpired;

  // Format date helper (DD/MM/YYYY)
  const formatCardDate = (d) => {
    if (!d) return '-';
    return formatDate(d, 'slash');
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* 
        Horizontal Physical-Style Membership Card
        Standard ID Card Ratio: ~1.6 : 1
      */}
      <div
        ref={ref}
        id="printable-card"
        className="relative w-full max-w-[560px] bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-600/30 flex flex-col justify-between text-slate-900 transition-all select-none"
        style={{
          boxShadow: '0 16px 40px -10px rgba(234, 88, 12, 0.22), 0 6px 16px -4px rgba(15, 23, 42, 0.1)',
        }}
      >
        {/* =========================================================
            1. ORANGE HEADER (Strong orange/red-orange section)
            ========================================================= */}
        <div
          className="card-header-orange relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white px-4 sm:px-6 py-3 sm:py-3.5 border-b-2 border-orange-700/40 shadow-sm"
          style={{ backgroundColor: '#ea580c' }}
        >
          {/* Subtle background ornamentation */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px',
            }}
          />

          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Logo Emblem */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-orange-600 p-1 flex items-center justify-center shadow-md border-2 border-amber-200 shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
                  <span className="text-[6px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    CARDMAKER
                  </span>
                </div>
              </div>

              {/* Title & Contacts */}
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight drop-shadow-sm">
                  Balaji Library
                </h1>

                {/* Contact numbers */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-100 tracking-wide mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                  <span className="font-mono">9806248236, 9630852930</span>
                </div>
              </div>
            </div>

            {/* Status Indicator: Only ACTIVE or EXPIRED (No PENDING on approved card) */}
            <div className="shrink-0 text-right">
              {isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-white text-emerald-700 shadow-md border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE</span>
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-white text-rose-700 shadow-md border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>EXPIRED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white/90 text-amber-700">
                  <span>PENDING</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            2. WHITE INFORMATION SECTION (Student Registered Details)
            ========================================================= */}
        <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 flex-1 flex flex-col justify-between text-left relative">
          {/* Subtle Security Guilloche Background */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ea580c 1px, transparent 1px)',
              backgroundSize: '14px 14px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-y-2 sm:gap-x-4">
            {/* Primary Student Details (Left 7 Cols) */}
            <div className="sm:col-span-7 space-y-1.5 text-xs sm:text-sm">
              {/* Name */}
              <div className="flex items-baseline gap-2 border-b border-slate-200/70 pb-1">
                <span className="font-bold text-slate-800 min-w-[95px] shrink-0">
                  Name:
                </span>
                <span className="font-extrabold text-slate-950 text-sm sm:text-base tracking-tight truncate">
                  {member.name || '-'}
                </span>
              </div>

              {/* Father's Name */}
              <div className="flex items-baseline gap-2 border-b border-slate-200/70 pb-1">
                <span className="font-bold text-slate-800 min-w-[95px] shrink-0">
                  Father's Name:
                </span>
                <span className="font-semibold text-slate-800 truncate">
                  {member.fatherName || '-'}
                </span>
              </div>

              {/* Date of Joining */}
              <div className="flex items-baseline gap-2 border-b border-slate-200/70 pb-1">
                <span className="font-bold text-slate-800 min-w-[95px] shrink-0">
                  Date of Joining:
                </span>
                <span className="font-semibold font-mono text-slate-900">
                  {formatCardDate(member.joiningDate)}
                </span>
              </div>

              {/* Seat */}
              <div className="flex items-baseline gap-2 border-b border-slate-200/70 pb-1">
                <span className="font-bold text-slate-800 min-w-[95px] shrink-0">
                  Seat:
                </span>
                <span className="font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono text-xs sm:text-sm">
                  #{member.seatNumber || '-'}
                </span>
              </div>

              {/* Mob. */}
              <div className="flex items-baseline gap-2 border-b border-slate-200/70 pb-1">
                <span className="font-bold text-slate-800 min-w-[95px] shrink-0">
                  Mob.:
                </span>
                <span className="font-bold font-mono text-slate-900">
                  {member.mobileNumber || member.mobile ? `+91 ${member.mobileNumber || member.mobile}` : '-'}
                </span>
              </div>
            </div>

            {/* Secondary Membership Details & Official Seal (Right 5 Cols) */}
            <div className="sm:col-span-5 flex flex-col justify-between pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-slate-200/80 sm:pl-4 space-y-2">
              {/* Member ID Badge */}
              <div className="bg-slate-900 text-white rounded-lg p-2 text-center shadow-xs">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                  Member ID
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-400 tracking-wider">
                  {member.memberId || '-'}
                </span>
              </div>

              {/* Membership Plan & Fee */}
              <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                <div className="bg-orange-50 border border-orange-200/80 rounded-lg p-1.5">
                  <span className="text-[9px] uppercase text-orange-800 font-bold block">
                    Plan
                  </span>
                  <span className="font-extrabold text-orange-950 text-xs truncate block">
                    {member.membershipPlan || '-'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                  <span className="text-[9px] uppercase text-slate-600 font-bold block">
                    Fee Paid
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {formatCurrency(member.feePaid)}
                  </span>
                </div>
              </div>

              {/* Valid Till Highlight */}
              <div
                className={`p-1.5 rounded-lg border text-center ${
                  isExpired
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <span className="text-[9px] uppercase font-bold tracking-wider block opacity-80">
                  Valid Till
                </span>
                <span className="font-black font-mono text-xs sm:text-sm">
                  {formatCardDate(member.validTill)}
                </span>
              </div>

              {/* Student Signature Line */}
              <div className="pt-2 text-right">
                <div className="font-serif italic text-xs font-bold text-slate-800 pr-1 -rotate-2 select-none truncate max-w-[140px] ml-auto">
                  {member.name || 'Authorized Sign.'}
                </div>
                <div className="w-28 h-[1px] bg-slate-400 ml-auto mt-0.5" />
                <span className="text-[8px] uppercase tracking-wider text-slate-500 block mt-0.5 truncate max-w-[140px] ml-auto">
                  हस्ताक्षर / {member.name || 'Sign.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            3. GREEN FOOTER (Exact Address Band)
            ========================================================= */}
        <div
          className="card-footer-green bg-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 border-t-2 border-emerald-800 text-center shadow-inner"
          style={{ backgroundColor: '#047857' }}
        >
          <p
            className="text-xs sm:text-sm font-bold tracking-wide leading-snug drop-shadow-xs"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            कंसाना टावर, प्री सैनिक स्कूल के पास, गुड़ी-गुड़ा का नाका
          </p>
        </div>
      </div>
    </div>
  );
});

export default MembershipCard;
