import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, size = 'md', className = '' }) {
  const normStatus = (status || '').toUpperCase();

  const configs = {
    PENDING: {
      label: 'Pending Approval',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
      Icon: Clock,
    },
    APPROVED: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      Icon: CheckCircle2,
    },
    ACTIVE: {
      label: 'ACTIVE',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
      dot: 'bg-emerald-500',
      Icon: ShieldCheck,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      Icon: XCircle,
    },
    EXPIRED: {
      label: 'EXPIRED',
      bg: 'bg-red-50 text-red-700 border-red-300 font-bold',
      dot: 'bg-red-500',
      Icon: AlertTriangle,
    },
    INACTIVE: {
      label: 'Inactive',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      Icon: Clock,
    },
  };

  const current = configs[normStatus] || configs.INACTIVE;
  const { Icon } = current;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide ${current.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0 animate-pulse`} />
      <Icon className={`${iconSizes[size] || iconSizes.md} shrink-0`} />
      <span>{current.label}</span>
    </span>
  );
}
