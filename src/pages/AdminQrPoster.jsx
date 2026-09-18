import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import Button from '../components/Button';
import {
  BookOpen,
  Phone,
  Printer,
  Download,
  Copy,
  Check,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const PRODUCTION_DOMAIN = import.meta.env.VITE_APP_URL || 'https://cardmakers.vercel.app';
const QR_TARGET_URL = `${PRODUCTION_DOMAIN.replace(/\/$/, '')}/register`;

export default function AdminQrPoster() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const posterRef = useRef(null);

  useEffect(() => {
    async function generateQr() {
      try {
        const url = await QRCode.toDataURL(QR_TARGET_URL, {
          width: 800,
          margin: 2,
          errorCorrectionLevel: 'H', // High error tolerance (30%), optimal for printed paper
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }
    generateQr();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(QR_TARGET_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setIsDownloadingPng(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = 'CardMaker-Registration-QR-Standee.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download PNG:', err);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!posterRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Standard A4 portrait: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Measure poster aspect ratio
      const elWidth = posterRef.current.offsetWidth || 600;
      const elHeight = posterRef.current.offsetHeight || 800;
      const aspect = elHeight / elWidth;

      // Fit nicely onto A4 with margins
      const renderWidth = 180;
      const renderHeight = renderWidth * aspect;
      const xOffset = (pageWidth - renderWidth) / 2;
      const yOffset = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
      pdf.save('CardMaker-Registration-QR-Standee.pdf');
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Top Breadcrumb / Nav */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Panel</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copied ? Check : Copy}
              className="text-xs"
            >
              {copied ? 'Copied Link!' : 'Copy /register Link'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPng}
              isLoading={isDownloadingPng}
              icon={Download}
              className="text-xs"
            >
              Download PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloadingPdf}
              icon={Download}
              className="text-xs"
            >
              Download PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={Printer}
              className="text-xs font-bold"
            >
              Print Standee
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="no-print mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-left text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
          <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-950">
              Official CardMaker Student Registration QR Standee
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Place this printed QR standee at the reception desk. When students scan the QR code with their mobile phone camera or Google Lens, it immediately opens{' '}
              <span className="font-mono font-bold">{QR_TARGET_URL}</span> and allows them to register directly.
            </p>
          </div>
        </div>

        {/* =========================================================================
            THE PRINTABLE QR STANDEE POSTER
            ========================================================================= */}
        <div className="flex justify-center">
          <div
            ref={posterRef}
            id="printable-qr-poster"
            className="w-full max-w-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/40 text-center select-none"
            style={{
              boxShadow: '0 25px 50px -12px rgba(234, 88, 12, 0.25)',
            }}
          >
            {/* Header: Strong Orange Section with Hindi & Emblem */}
            <div
              className="card-header-orange relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white px-6 py-6 border-b-4 border-orange-700/40"
              style={{ backgroundColor: '#ea580c' }}
            >
              <div className="flex items-center justify-center gap-3.5 mb-2">
                <div className="w-14 h-14 rounded-full bg-white text-orange-600 p-1 flex items-center justify-center shadow-md border-2 border-amber-200 shrink-0">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white">
                    <BookOpen className="w-6 h-6 drop-shadow-xs" />
                    <span className="text-[6px] font-black uppercase tracking-tighter leading-none mt-0.5">
                      CARDMAKER
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide leading-tight drop-shadow-sm">
                    CardMaker
                  </h1>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-200 block">
                    Digital Membership Card System
                  </span>
                </div>
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white tracking-wide mt-1">
                Student Registration Portal
              </div>
            </div>

            {/* Middle Section: QR Code & Direct Callouts */}
            <div className="p-8 bg-white space-y-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-2">
                  Scan to Register
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Scan to Get Membership Card
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Use your phone camera or Google Lens to register instantly
                </p>
              </div>

              {/* QR Code Container with double frame */}
              <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 shadow-inner">
                <div className="p-2.5 rounded-2xl bg-white shadow-md border border-slate-200">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="CardMaker Registration QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Callout */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-400 text-xs font-black tracking-wider uppercase shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scan this QR code to register</span>
                </span>
                <p className="font-mono text-[11px] text-slate-400 mt-2">
                  {QR_TARGET_URL}
                </p>
              </div>

              {/* 3 Simple Steps */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                    1
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Scan QR
                  </span>
                  <span className="text-[9px] text-slate-400">With phone camera</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                    2
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Fill Details
                  </span>
                  <span className="text-[9px] text-slate-400">Takes 30 seconds</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                    3
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 block">
                    Get Card
                  </span>
                  <span className="text-[9px] text-slate-400">Instant digital PDF</span>
                </div>
              </div>
            </div>

            {/* Footer: Emerald Green Band */}
            <div
              className="card-footer-green bg-emerald-700 text-white px-6 py-4 border-t-4 border-emerald-800"
              style={{ backgroundColor: '#047857' }}
            >
              <p
                className="text-xs sm:text-sm font-bold tracking-wide leading-snug drop-shadow-xs"
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              >
                कंसाना टावर, प्री सैनिक स्कूल के पास, गुड़ी-गुड़ा का नाका
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-100 mt-1">
                <Phone className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                <span className="font-mono">9806248236, 9630852930</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
