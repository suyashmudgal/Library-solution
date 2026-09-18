import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMembershipById } from '../services/membershipService';
import MembershipCard from '../components/MembershipCard';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import { downloadCardAsPdf } from '../utils/cardUtils';
import { Download, Printer, Share2, ArrowLeft, AlertCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function Card() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null); // { message, type }

  const cardRef = useRef(null);

  useEffect(() => {
    async function loadCard() {
      if (!memberId) {
        setError('No Member ID specified.');
        setLoading(false);
        return;
      }
      try {
        const data = await getMembershipById(memberId);
        if (data) {
          setMember(data);
        } else {
          setError(`No membership found for ID "${memberId}".`);
        }
      } catch (err) {
        console.error('Error fetching card:', err);
        setError('Unable to connect to the membership service. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadCard();
  }, [memberId]);

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
      console.error('PDF Generation failed:', err);
      setDownloadToast({
        type: 'error',
        message: 'Unable to generate PDF. Please try again.',
      });
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Study Room Card - ${member?.name}`,
          text: `Digital Membership Card for ${member?.name} (${member?.memberId})`,
          url,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingState message="Loading digital card..." className="flex-1" />;
  }

  if (error || !member) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Card Not Available</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {error || 'This digital membership card does not exist or has not yet been approved.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/status" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Check Status
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = member.cardStatus === 'EXPIRED';

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation & Actions Top Bar */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link
            to="/status"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Status</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={Printer}
              title="Print Card"
              className="hidden sm:inline-flex"
            >
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              icon={copied ? Check : Share2}
              title="Share Card Link"
            >
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Expired Warning Banner if applicable */}
        {isExpired && (
          <div className="no-print mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-left flex items-start gap-3">
            <span className="text-xl leading-none shrink-0">⚠️</span>
            <div>
              <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Membership Expired
              </h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                This membership expired on {member.validTill}. Please visit reception desk to renew.
              </p>
            </div>
          </div>
        )}

        {/* The Digital Membership Card */}
        <div className="mb-6 flex justify-center">
          <MembershipCard ref={cardRef} member={member} />
        </div>

        {/* Primary & Secondary Card Actions */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePrint}
            icon={Printer}
            className="w-full sm:w-auto flex-1 font-bold shadow-md hover:shadow-lg text-base py-3.5"
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
            className="w-full sm:w-auto flex-1 font-bold border-2 border-slate-300 hover:border-slate-400 py-3.5"
          >
            DOWNLOAD PDF
          </Button>
        </div>

        {/* Download Feedback Banner */}
        {downloadToast && (
          <div
            className={`no-print mt-4 max-w-md mx-auto p-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all animate-fadeIn ${
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

        {/* Usage Instructions */}
        <div className="no-print mt-8 p-4 rounded-2xl bg-white border border-slate-200/90 text-left text-xs text-slate-500 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Digital Card Instructions</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li>Show this digital card on your phone to gain entry to your allotted study seat.</li>
            <li>You can download and save the official PDF membership card to your device.</li>
            <li>Membership validity is strictly non-transferable.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
