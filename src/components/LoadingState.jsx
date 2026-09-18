import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading details...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Please wait a moment</p>
    </div>
  );
}
