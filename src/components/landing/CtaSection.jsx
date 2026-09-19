import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { ArrowRight, Search, Sparkles, ShieldCheck } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Transform Your Membership System</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6">
          Ready to go digital?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Start issuing digital membership cards today. Simplify member registration, eliminate card printing overhead, and manage approvals effortlessly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link to="/register" className="w-full sm:w-auto flex-1">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg hover:shadow-emerald-500/20"
            >
              Get Started
            </Button>
          </Link>

          <Link to="/status" className="w-full sm:w-auto flex-1">
            <Button
              variant="outline"
              size="lg"
              icon={Search}
              iconPosition="right"
              className="w-full text-base font-semibold border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Check Status
            </Button>
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official CardMaker Platform • Verified by Desk Administrator</span>
        </div>
      </div>
    </section>
  );
}
