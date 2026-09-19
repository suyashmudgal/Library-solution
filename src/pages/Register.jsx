import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MembershipForm from '../components/MembershipForm';
import { submitMembership } from '../services/membershipService';
import { ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function Register({ isFromQr = false }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await new Promise((r) => setTimeout(r, 300));
      const created = await submitMembership(formData);
      navigate(`/application-submitted?memberId=${created.memberId}`);
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Unable to connect to the membership service. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          {isFromQr ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-bold mb-3 border border-orange-200 dark:border-orange-800 animate-fadeIn">
              <span>📷 Scanned from CardMaker Standee • Quick Registration</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3 border border-emerald-200/80 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Instant Digital Registration</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get Your Digital Membership Card
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Enter your details and submit your membership request.
          </p>
        </div>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-medium animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Main Membership Form */}
        <MembershipForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Reassurance Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Official CardMaker Membership Portal • Verified by Desk Administrator</span>
        </div>
      </div>
    </div>
  );
}
