import React from 'react';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/cardUtils';
import { Check, X, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTable({
  members = [],
  onViewDetails,
  onApprove,
  onReject,
  isProcessing = false,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4">Member ID</th>
            <th className="py-3 px-4">Student Name</th>
            <th className="py-3 px-4">Mobile</th>
            <th className="py-3 px-4">Seat</th>
            <th className="py-3 px-4">Plan</th>
            <th className="py-3 px-4">Fee Paid</th>
            <th className="py-3 px-4">Joining Date</th>
            <th className="py-3 px-4">Valid Till</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {members.map((member) => {
            const isPending = member.status === 'PENDING';
            const isApproved = member.status === 'APPROVED';

            return (
              <tr
                key={member.memberId}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Member ID */}
                <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                  {member.memberId}
                </td>

                {/* Name & Father */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{member.name}</div>
                  <div className="text-[11px] text-slate-400">
                    S/O {member.fatherName || '-'}
                  </div>
                </td>

                {/* Mobile */}
                <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                  +91 {member.mobile}
                </td>

                {/* Seat */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                    #{member.seatNumber}
                  </span>
                </td>

                {/* Plan */}
                <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                  {member.membershipPlan}
                </td>

                {/* Fee */}
                <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">
                  {formatCurrency(member.feePaid)}
                </td>

                {/* Joining */}
                <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-xs">
                  {formatDate(member.joiningDate, 'short')}
                </td>

                {/* Valid Till */}
                <td className="py-3 px-4 whitespace-nowrap text-xs font-medium text-slate-800">
                  {formatDate(member.validTill, 'short')}
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge status={member.cardStatus || member.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(member)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      title="View Details"
                      aria-label="View member details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(member.memberId)}
                          disabled={isProcessing}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          title="Approve Membership"
                          aria-label="Approve application"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(member.memberId)}
                          disabled={isProcessing}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                          title="Reject Membership"
                          aria-label="Reject application"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <Link
                        to={`/card/${member.memberId}`}
                        className="p-1.5 rounded-lg text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                        title="View Digital Card"
                        aria-label="Open digital card"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
