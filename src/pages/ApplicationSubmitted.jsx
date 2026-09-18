import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  getMembershipById,
  subscribeToMembershipUpdates,
} from '../services/membershipService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import MembershipCard from '../components/MembershipCard';
import { downloadCardAsPdf } from '../utils/cardUtils';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Armchair,
  ExternalLink,
  Printer,
  AlertCircle,
  Check,
} from 'lucide-react';

export default function ApplicationSubmitted() {
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId') || '';

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null); // { message, type }

  const cardRef = useRef(null);

  const fetchStatus = async () => {
    if (!memberId) {
      setError('No Request ID provided. Please submit a new registration or check status.');
      setLoading(false);
      return;
    }

    try {
      const data = await getMembershipById(memberId);
      if (data) {
        setMember(data);
        setError('');

        // Trigger celebratory confetti once on approval
        if ((data.status === 'APPROVED' || data.cardStatus === 'READY' || data.cardStatus === 'ACTIVE') && !hasCelebrated) {
          setHasCelebrated(true);
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // Ignore confetti errors
          }
        }
      } else {
        setError(`Application with Request ID ${memberId} could not be found.`);
      }
    } catch (err) {
      console.error('Error fetching application status:', err);
    } finally {
      setLoading(false);
    }
  };

  const isApproved = Boolean(
    member && (member.status === 'APPROVED' || member.cardStatus === 'READY' || member.cardStatus === 'ACTIVE')
  );

  useEffect(() => {
    fetchStatus();

    // 1. Reactive subscription across tabs & storage events
    const unsubscribe = subscribeToMembershipUpdates(() => {
      fetchStatus();
    });

    // If approval is detected, stop polling immediately
    if (isApproved) {
      return () => {
        unsubscribe();
      };
    }

    // 2. Visibility-aware polling: 12 seconds when active tab, paused when hidden
    const POLLING_INTERVAL_MS = 12000;
    let timerId = null;

    const startPolling = () => {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchStatus();
        }
      }, POLLING_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStatus();
        startPolling();
      } else {
        if (timerId) clearInterval(timerId);
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      if (timerId) clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [memberId, hasCelebrated, isApproved]);

  const handleDownload = async () => {
    if (!cardRef.current || !member) return;
    setIsDownloading(true);
    setDownloadToast(null);
    try {
      await downloadCardAsPdf(cardRef.current, member.memberId);
      setDownloadToast({
        type: 'success',
        message: 'Membership card downloaded successfully.',
      });
      setTimeout(() => setDownloadToast(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadToast({
        type: 'error',
        message: 'Unable to generate PDF. Please try again.',
      });
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-700">Loading your request...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Application Not Found</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {error || 'Unable to locate this membership request in the study room records.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Register Again
              </Button>
            </Link>
            <Link to="/status" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Check Status
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isApprovedState = member.status === 'APPROVED' || member.cardStatus === 'READY' || member.cardStatus === 'ACTIVE';
  const isPending = member.status === 'PENDING' && !isApprovedState;
  const isRejected = member.status === 'REJECTED' && !isApprovedState;

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        {/* ================= PENDING STATE ================= */}
        {isPending && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm animate-fadeIn">
            {/* Hourglass / Clock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <span className="text-3xl mb-2 block" role="img" aria-label="Hourglass">
              ⏳
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Waiting for Approval
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Your membership request has been submitted successfully.
            </p>

            {/* Request Details Box */}
            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80 mb-6 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Request ID
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                    {member.memberId}
                  </span>
                </div>
                <StatusBadge status="PENDING" size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Student Name
                  </span>
                  <span className="font-semibold text-slate-800">{member.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Seat Number
                  </span>
                  <span className="font-semibold text-slate-800">Seat #{member.seatNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Plan
                  </span>
                  <span className="font-semibold text-slate-800">{member.membershipPlan}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Fee Paid
                  </span>
                  <span className="font-semibold text-slate-800">₹{member.feePaid}</span>
                </div>
              </div>
            </div>

            {/* Administrator verification guidance */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-800 mb-6 text-left flex items-start gap-2.5">
              <span className="text-base leading-none shrink-0">🟡</span>
              <p className="leading-relaxed">
                Please wait while the study room administrator verifies your payment.
                This page is live and will update automatically once verified.
              </p>
            </div>

            {/* Live Auto-Check Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Auto-detecting approval status in real-time...</span>
            </div>
          </div>
        )}

        {/* ================= APPROVED STATE ================= */}
        {isApprovedState && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-emerald-200 shadow-md animate-fadeIn">
            {/* Celebration Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <span className="text-3xl mb-2 block" role="img" aria-label="Celebration">
              🎉
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Membership Approved!
            </h1>

            <p className="text-base font-bold text-emerald-700 mb-6">
              Your Membership Card is Ready
            </p>

            {/* Digital Card Preview Container */}
            <div className="mb-6 overflow-hidden rounded-2xl shadow-sm border border-slate-200 p-2 sm:p-4 bg-slate-50/50">
              <MembershipCard ref={cardRef} member={member} />
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.print()}
                icon={Printer}
                className="flex-1 shadow-md hover:shadow-lg font-bold text-base py-3"
              >
                PRINT CARD
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownload}
                isLoading={isDownloading}
                loadingText="Generating PDF..."
                icon={Download}
                className="flex-1 font-bold border-2 border-slate-300 hover:border-slate-400 py-3"
              >
                DOWNLOAD PDF
              </Button>
              <Link to={`/card/${member.memberId}`} className="flex-1">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={ExternalLink}
                  className="w-full font-semibold py-3"
                >
                  View Full Card
                </Button>
              </Link>
            </div>

            {/* Download Toast Notification */}
            {downloadToast && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all animate-fadeIn ${
                  downloadToast.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}
              >
                {downloadToast.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{downloadToast.message}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-4">
              Tip: Download the official PDF membership card to show at the study room reception.
            </p>
          </div>
        )}

        {/* ================= REJECTED STATE ================= */}
        {isRejected && (
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-rose-200 shadow-sm animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <XCircle className="w-8 h-8 text-rose-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Membership Request Not Approved
            </h1>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Please contact the study room administrator.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Request ID:</span>
                <span className="font-mono text-sm font-bold text-slate-800">{member.memberId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <StatusBadge status="REJECTED" size="sm" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="flex-1">
                <Button variant="primary" size="md" className="w-full">
                  Submit New Request
                </Button>
              </Link>
              <a href="tel:+919826012345" className="flex-1">
                <Button variant="outline" size="md" className="w-full">
                  Call Administrator
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
