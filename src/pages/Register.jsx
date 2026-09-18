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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold mb-3 border border-orange-200 animate-fadeIn">
              <span>📷 Scanned from CardMaker Standee • Quick Registration</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant Digital Registration</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Get Your Digital Membership Card
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Enter your details and submit your membership request.
          </p>
        </div>

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Main Membership Form */}
        <MembershipForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Reassurance Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official CardMaker Membership Portal • Verified by Desk Administrator</span>
        </div>
      </div>
    </div>
  );
}
