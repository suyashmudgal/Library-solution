import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminTable from '../components/AdminTable';
import RequestCard from '../components/RequestCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Input from '../components/Input';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  LogOut,
  Check,
  X,
  ExternalLink,
  Users,
  RotateCcw,
  Sparkles,
  Database,
  Link2,
  QrCode,
} from 'lucide-react';
import { logoutAdmin, isAdminAuthenticated } from '../services/authService';
import {
  getAllMemberships,
  approveMembership,
  rejectMembership,
  deleteMembership,
  subscribeToMembershipUpdates,
  getGoogleAppsScriptUrl,
  setGoogleAppsScriptUrl,
  getGoogleSheetUrl,
  setGoogleSheetUrl,
  OFFICIAL_GOOGLE_SHEET_URL,
  testGoogleAppsScriptConnection,
  isGoogleSheetConnected,
} from '../services/membershipService';

export default function Admin() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED'
  const [toastMessage, setToastMessage] = useState(null);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [gasUrlInput, setGasUrlInput] = useState(getGoogleAppsScriptUrl());
  const [sheetUrlInput, setSheetUrlInput] = useState(getGoogleSheetUrl() || OFFICIAL_GOOGLE_SHEET_URL);
  const [isTestingGas, setIsTestingGas] = useState(false);
  const [gasTestStatus, setGasTestStatus] = useState(null);

  const handleOpenGoogleSheet = () => {
    const url = getGoogleSheetUrl() || OFFICIAL_GOOGLE_SHEET_URL;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Authentication check
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const loadMembers = async (forceRefresh = false) => {
    try {
      setErrorBanner('');
      const data = await getAllMemberships({ forceRefresh });
      setMembers(data);
    } catch (err) {
      console.error('Failed to load memberships:', err);
      setErrorBanner('Unable to connect to the membership service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers(false);

    // Subscribe to updates (cross-tab / storage updates)
    const unsubscribe = subscribeToMembershipUpdates(() => {
      loadMembers(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApprove = async (memberId) => {
    setProcessingId(memberId);
    try {
      const updated = await approveMembership(memberId);
      setMembers((prev) =>
        prev.map((m) => (m.memberId === memberId ? { ...m, ...updated, status: 'APPROVED', cardStatus: 'READY' } : m))
      );
      if (selectedMember && selectedMember.memberId === memberId) {
        setSelectedMember({ ...selectedMember, ...updated, status: 'APPROVED', cardStatus: 'READY' });
      }
      showToast(`Approved membership for ${updated.name || memberId}`);
    } catch (err) {
      console.error('Approval failed:', err);
      showToast('Failed to approve membership.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (memberId) => {
    setProcessingId(memberId);
    try {
      const updated = await rejectMembership(memberId);
      setMembers((prev) =>
        prev.map((m) => (m.memberId === memberId ? { ...m, ...updated, status: 'REJECTED', cardStatus: 'NOT_READY' } : m))
      );
      if (selectedMember && selectedMember.memberId === memberId) {
        setSelectedMember({ ...selectedMember, ...updated, status: 'REJECTED', cardStatus: 'NOT_READY' });
      }
      showToast(`Rejected membership for ${updated.name || memberId}`, 'info');
    } catch (err) {
      console.error('Rejection failed:', err);
      showToast('Failed to reject membership.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm(`Are you sure you want to remove member ${memberId}?`)) return;
    setProcessingId(memberId);
    try {
      await deleteMembership(memberId);
      setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
      if (selectedMember && selectedMember.memberId === memberId) {
        setSelectedMember(null);
      }
      showToast(`Deleted member ${memberId}`, 'info');
    } catch (err) {
      console.error('Deletion failed:', err);
      showToast('Failed to delete member.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  // Stats calculation
  const pendingCount = members.filter((m) => m.status === 'PENDING').length;
  const activeCount = members.filter((m) => m.cardStatus === 'ACTIVE').length;
  const expiredCount = members.filter((m) => m.cardStatus === 'EXPIRED').length;

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    // Tab filter
    if (activeTab === 'PENDING' && m.status !== 'PENDING') return false;
    if (activeTab === 'ACTIVE' && m.cardStatus !== 'ACTIVE') return false;
    if (activeTab === 'EXPIRED' && m.cardStatus !== 'EXPIRED') return false;
    if (activeTab === 'REJECTED' && m.status !== 'REJECTED') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchId = m.memberId?.toLowerCase().includes(q);
      const matchMobile = m.mobile?.includes(q);
      const matchSeat = m.seatNumber?.toLowerCase().includes(q);
      return matchName || matchId || matchMobile || matchSeat;
    }
    return true;
  });

  return (
    <div className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-semibold animate-slideUp ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-900 text-white border-emerald-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Top Bar: Title & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            CardMaker — Admin Portal
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenGoogleSheet}
            className="font-bold border-emerald-600 text-emerald-800 hover:bg-emerald-50 shadow-2xs"
            title="Open the live Google Sheet in a new tab"
          >
            📊 Open Google Sheet
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setLoading(true);
              await loadMembers(true);
              showToast('Live Google Sheet records synced successfully!');
            }}
            icon={RefreshCw}
            title="Refresh latest data from Google Sheets"
          >
            Refresh Data
          </Button>

          <Button
            variant={isGoogleSheetConnected() ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setGasUrlInput(getGoogleAppsScriptUrl());
              setSheetUrlInput(getGoogleSheetUrl() || OFFICIAL_GOOGLE_SHEET_URL);
              setGasTestStatus(null);
              setIsGasModalOpen(true);
            }}
            icon={Database}
            className={isGoogleSheetConnected() ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            title="Configure Google Sheet / Google Apps Script connection"
          >
            Google Sheet: Live
          </Button>

          <Link to="/admin/qr">
            <Button
              variant="outline"
              size="sm"
              icon={QrCode}
              title="Open and print student registration QR poster standee"
            >
              Print QR Standee
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
            className="text-slate-600 hover:text-rose-600"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center justify-between animate-fadeIn">
          <span>{errorBanner}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMembers(true)}
            icon={RefreshCw}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Pending Requests */}
        <div
          onClick={() => setActiveTab('PENDING')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all hover:shadow-md text-left ${
            activeTab === 'PENDING'
              ? 'border-amber-400 ring-2 ring-amber-200'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingCount}</span>
            <span className="text-xs text-amber-600 font-semibold">Requires Verification</span>
          </div>
        </div>

        {/* Active Members */}
        <div
          onClick={() => setActiveTab('ACTIVE')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all hover:shadow-md text-left ${
            activeTab === 'ACTIVE'
              ? 'border-emerald-400 ring-2 ring-emerald-200'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">Digital Cards Live</span>
          </div>
        </div>

        {/* Expired Members */}
        <div
          onClick={() => setActiveTab('EXPIRED')}
          className={`cursor-pointer bg-white rounded-2xl p-5 border transition-all hover:shadow-md text-left ${
            activeTab === 'EXPIRED'
              ? 'border-red-400 ring-2 ring-red-200'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Expired Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{expiredCount}</span>
            <span className="text-xs text-red-600 font-semibold">Renewal Due</span>
          </div>
        </div>
      </div>

      {/* Main Section: Membership Requests */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        {/* Controls: Search & Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 text-left">
              Membership Requests
            </h2>
            <p className="text-xs text-slate-500 text-left mt-0.5">
              Verify desk payment receipt before approving student digital pass
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID, seat..."
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-medium text-slate-600">
              {['ALL', 'PENDING', 'ACTIVE', 'EXPIRED', 'REJECTED'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL'
                    ? `All (${members.length})`
                    : tab === 'PENDING'
                    ? `Pending (${pendingCount})`
                    : tab === 'ACTIVE'
                    ? `Active (${activeCount})`
                    : tab === 'EXPIRED'
                    ? `Expired (${expiredCount})`
                    : 'Rejected'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <LoadingState message="Loading membership requests..." />
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            title="No membership records found"
            description={
              searchQuery
                ? `No requests match "${searchQuery}". Try clearing your search.`
                : 'No memberships found in this category.'
            }
            actionLabel={searchQuery ? 'Clear Search' : undefined}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <AdminTable
                members={filteredMembers}
                onViewDetails={(m) => setSelectedMember(m)}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={Boolean(processingId)}
              />
            </div>

            {/* Mobile / Tablet Stacked Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
              {filteredMembers.map((m) => (
                <RequestCard
                  key={m.memberId}
                  member={m}
                  onViewDetails={(item) => setSelectedMember(item)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={processingId === m.memberId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Admin Request Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title="Membership Request Verification"
        subtitle={selectedMember ? `Member ID: ${selectedMember.memberId}` : ''}
      >
        {selectedMember && (
          <div className="space-y-6 text-left">
            {/* Header Status Row */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-500">Current Status:</span>
              <StatusBadge
                status={selectedMember.cardStatus || selectedMember.status}
                size="md"
              />
            </div>

            {/* Student Details Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Student Details
              </h4>
              <div className="grid grid-cols-2 gap-3.5 text-xs bg-white p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Full Name
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedMember.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Father's Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedMember.fatherName || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Mobile Number
                  </span>
                  <span className="font-mono font-semibold text-slate-800">
                    +91 {selectedMember.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Seat Number
                  </span>
                  <span className="font-bold text-slate-900">
                    Seat #{selectedMember.seatNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Validity Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Payment &amp; Validity Schedule
              </h4>
              <div className="grid grid-cols-2 gap-3.5 text-xs bg-white p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Membership Plan
                  </span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                    {selectedMember.membershipPlan}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Fee Paid
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(selectedMember.feePaid)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Payment Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedMember.paymentDate, 'short')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-medium">
                    Joining Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedMember.joiningDate, 'short')}
                  </span>
                </div>
                <div className="col-span-2 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <span className="text-emerald-800 font-medium">Valid Till:</span>
                  <span className="font-bold text-emerald-950 text-sm">
                    {formatDate(selectedMember.validTill, 'long')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              {selectedMember.status === 'PENDING' ? (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleApprove(selectedMember.memberId)}
                    disabled={processingId === selectedMember.memberId}
                    icon={Check}
                    className="flex-1 font-bold bg-emerald-600 hover:bg-emerald-700"
                  >
                    ✓ APPROVE
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="md"
                    onClick={() => handleReject(selectedMember.memberId)}
                    disabled={processingId === selectedMember.memberId}
                    icon={X}
                    className="flex-1"
                  >
                    ✕ REJECT
                  </Button>
                </>
              ) : selectedMember.status === 'APPROVED' ? (
                <Link
                  to={`/card/${selectedMember.memberId}`}
                  className="flex-1"
                  onClick={() => setSelectedMember(null)}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    icon={ExternalLink}
                    className="w-full font-bold"
                  >
                    Open Digital Membership Card
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleApprove(selectedMember.memberId)}
                  disabled={processingId === selectedMember.memberId}
                  icon={Check}
                  className="flex-1 font-bold"
                >
                  Re-Approve Membership
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                onClick={() => handleDelete(selectedMember.memberId)}
                disabled={processingId === selectedMember.memberId}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Google Sheet / Google Apps Script Connection Modal */}
      <Modal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        title="Google Sheet Database Connection"
        subtitle="Connect LIBRARY'S DATA (Sheet1) via Google Apps Script"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5 text-left">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Exact 15-Column Schema (A:O) Verified</span>
            </div>
            <p className="text-slate-500 mb-2">
              This backend strictly maps to your <strong>LIBRARY'S DATA</strong> Google Sheet headers:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
              <span>A: Member ID</span>
              <span>B: Name</span>
              <span>C: Father's Name</span>
              <span>D: Mobile Number</span>
              <span>E: Seat Number</span>
              <span>F: Membership Plan</span>
              <span>G: Fee Paid</span>
              <span>H: Payment Date</span>
              <span>I: Joining Date</span>
              <span>J: Valid Till</span>
              <span>K: Status</span>
              <span>L: Card Status</span>
              <span>M: Card File URL</span>
              <span>N: Created At</span>
              <span>O: Approved At</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              label="Google Apps Script Web App URL"
              name="gasUrl"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={gasUrlInput}
              onChange={(e) => {
                setGasUrlInput(e.target.value);
                setGasTestStatus(null);
              }}
              icon={Link2}
              helperText="Deploy Code.gs as Web App (Execute as: Me, Who has access: Anyone)"
            />

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!gasUrlInput.trim()) {
                    setGasTestStatus({ success: false, message: 'Please enter a Web App URL first.' });
                    return;
                  }
                  setIsTestingGas(true);
                  setGasTestStatus(null);
                  try {
                    const res = await testGoogleAppsScriptConnection(gasUrlInput);
                    if (res && res.sheetUrl && !sheetUrlInput.trim()) {
                      setSheetUrlInput(res.sheetUrl);
                    }
                    setGasTestStatus({ success: true, message: 'Connected successfully to Google Apps Script!' });
                  } catch (e) {
                    setGasTestStatus({ success: false, message: e.message || 'Failed to connect.' });
                  } finally {
                    setIsTestingGas(false);
                  }
                }}
                isLoading={isTestingGas}
              >
                Test Connection
              </Button>

              {gasUrlInput.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGasUrlInput('');
                    setGoogleAppsScriptUrl('');
                    loadMembers();
                    setGasTestStatus(null);
                    showToast('Switched to local demonstration storage.');
                  }}
                  className="text-rose-600 hover:text-rose-700"
                >
                  Clear (Use Local Demo)
                </Button>
              )}
            </div>

            <div className="pt-2">
              <Input
                label="Google Sheet URL (Spreadsheet)"
                name="sheetUrl"
                placeholder={OFFICIAL_GOOGLE_SHEET_URL}
                value={sheetUrlInput}
                onChange={(e) => setSheetUrlInput(e.target.value)}
                icon={Database}
                helperText="Official Google Sheet opened by '📊 Open Google Sheet'"
              />
            </div>

            {gasTestStatus && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 animate-fadeIn ${
                  gasTestStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {gasTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{gasTestStatus.message}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                setGoogleAppsScriptUrl(gasUrlInput);
                setGoogleSheetUrl(sheetUrlInput.trim() || OFFICIAL_GOOGLE_SHEET_URL);
                await loadMembers();
                setIsGasModalOpen(false);
                showToast(
                  gasUrlInput.trim()
                    ? 'Connected to Google Sheet backend!'
                    : 'Switched to local demonstration mode.'
                );
              }}
              className="flex-1 font-bold"
            >
              Save &amp; Sync Data
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsGasModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
