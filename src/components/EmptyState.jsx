import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-3 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} icon={ArrowRight} iconPosition="right">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
