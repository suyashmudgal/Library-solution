import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { searchMemberships, getMembershipById } from '../services/membershipService';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import { Search, ExternalLink, AlertCircle, Phone, Calendar, Armchair, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Status() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError('Please enter your 10-digit mobile number or Member ID (e.g. SR-2026-00101)');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // Look up by direct ID first or by mobile/ID search
      let found = [];
      if (clean.toUpperCase().startsWith('SR-')) {
        const single = await getMembershipById(clean);
        if (single) found = [single];
      }

      if (found.length === 0) {
        found = await searchMemberships(clean);
      }

      setResults(found);
      if (found.length === 0) {
        setError('No membership record found matching this Mobile Number or Member ID.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while checking status. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Membership Verification</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check Your Membership Status
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Enter your registered mobile number or Member ID to check your approval status and access your card.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label="Mobile Number or Member ID"
              name="query"
              placeholder="e.g. 9826012345 or SR-2026-00101"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError('');
              }}
              icon={Search}
              required
              helperText="Tip: Try sample IDs: SR-2026-00101 (Pending), SR-2026-00088 (Approved), or your 10-digit mobile"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSearching}
              className="w-full font-bold shadow-xs"
            >
              Check Status
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Search Results */}
        {results && results.length > 0 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-left px-1">
              Found {results.length} Matching Membership{results.length > 1 ? 's' : ''}
            </h2>

            {results.map((item) => {
              const isApproved = item.status === 'APPROVED';
              const isExpired = item.cardStatus === 'EXPIRED';

              return (
                <div
                  key={item.memberId}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-left space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Member ID
                      </span>
                      <span className="font-mono text-base font-bold text-slate-900">
                        {item.memberId}
                      </span>
                    </div>
                    <StatusBadge status={item.cardStatus || item.status} size="md" />
                  </div>

                  {/* Main Grid Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Student Name
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Father's Name
                      </span>
                      <span className="font-medium text-slate-700">{item.fatherName || '-'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Seat Number
                      </span>
                      <span className="font-bold text-slate-900">#{item.seatNumber}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Membership Plan
                      </span>
                      <span className="font-semibold text-emerald-700">{item.membershipPlan}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Fee Paid
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(item.feePaid)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">
                        Joining Date
                      </span>
                      <span className="font-medium text-slate-700">
                        {formatDate(item.joiningDate, 'short')}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex items-center justify-between">
                      <span className="text-slate-600 font-medium text-xs">Validity:</span>
                      <span className="text-xs font-bold text-slate-900">
                        {formatDate(item.joiningDate, 'short')} → {formatDate(item.validTill, 'short')}
                      </span>
                    </div>
                  </div>

                  {/* Expiry Notice if Expired */}
                  {isExpired && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                      ⚠️ Membership Expired on {formatDate(item.validTill, 'short')}. Please renew at the study room reception desk.
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    {isApproved ? (
                      <Link to={`/card/${item.memberId}`} className="flex-1">
                        <Button
                          variant="primary"
                          size="md"
                          icon={ExternalLink}
                          className="w-full font-bold"
                        >
                          View Digital Card
                        </Button>
                      </Link>
                    ) : item.status === 'PENDING' ? (
                      <Link
                        to={`/application-submitted?memberId=${item.memberId}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="md" className="w-full">
                          View Waiting Status
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Help Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Need help locating your card? Visit the study room reception desk or call +91 98260 12345.
        </div>
      </div>
    </div>
  );
}
