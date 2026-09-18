import React from 'react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import { Check, X, Eye, ExternalLink, Calendar, Phone, Armchair } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RequestCard({
  member,
  onViewDetails,
  onApprove,
  onReject,
  isProcessing = false,
}) {
  const isPending = member.status === 'PENDING';
  const isApproved = member.status === 'APPROVED';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all text-left">
      {/* Top row: Member ID & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            ID
          </span>
          <span className="font-mono text-sm font-bold text-slate-900">
            {member.memberId}
          </span>
        </div>
        <StatusBadge status={member.cardStatus || member.status} size="sm" />
      </div>

      {/* Member Main Info */}
      <div className="space-y-2 mb-3.5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {member.name}
            </h4>
            <p className="text-xs text-slate-500">
              S/O: <span className="text-slate-700 font-medium">{member.fatherName}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Armchair className="w-3.5 h-3.5 text-slate-500" />
              Seat {member.seatNumber}
            </span>
          </div>
        </div>

        {/* Quick Details Chips */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono font-medium">{member.mobile}</span>
          </div>
          <div className="flex items-center justify-between bg-emerald-50/60 p-2 rounded-lg text-emerald-900">
            <span className="font-medium">{member.membershipPlan}</span>
            <span className="font-bold">{formatCurrency(member.feePaid)}</span>
          </div>
        </div>

        {/* Validity timeline */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 px-1">
          <span>Joining: <strong className="text-slate-700">{formatDate(member.joiningDate, 'short')}</strong></span>
          <span>Valid Till: <strong className="text-slate-700">{formatDate(member.validTill, 'short')}</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(member)}
          icon={Eye}
          className="flex-1"
        >
          Details
        </Button>

        {isPending && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApprove(member.memberId)}
              disabled={isProcessing}
              icon={Check}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Approve
            </Button>
            <Button
              variant="dangerOutline"
              size="sm"
              onClick={() => onReject(member.memberId)}
              disabled={isProcessing}
              icon={X}
              className="px-2.5"
              aria-label="Reject application"
            />
          </>
        )}

        {isApproved && (
          <Link to={`/card/${member.memberId}`} className="flex-1">
            <Button variant="secondary" size="sm" icon={ExternalLink} className="w-full">
              View Card
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
