import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    label,
    name,
    id,
    type = 'text',
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    icon: Icon,
    prefix,
    suffix,
    className = '',
    inputClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || name;

  return (
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}

        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-semibold text-slate-500 dark:text-slate-400">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full block rounded-xl text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border transition-colors duration-150 text-sm sm:text-base py-2.5 px-3.5 placeholder:text-slate-400 dark:placeholder:text-slate-500
            ${Icon ? 'pl-10' : ''}
            ${prefix ? 'pl-12' : ''}
            ${suffix ? 'pr-12' : ''}
            ${
              error
                ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50'
            }
            ${disabled ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-700' : ''}
            ${readOnly ? 'bg-slate-50 dark:bg-slate-800/60 font-medium text-slate-700 dark:text-slate-300' : ''}
            outline-none
            ${inputClassName}`}
          {...props}
        />

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-medium text-slate-400 dark:text-slate-500">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
