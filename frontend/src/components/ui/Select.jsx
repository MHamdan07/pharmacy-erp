import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      children,
      size = 'md',
      fullWidth = true,
      className = '',
      containerClassName = '',
      id,
      name,
      disabled = false,
      required = false,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'py-1.5 pl-3 pr-8 text-xs rounded-lg',
      md: 'py-2 pl-3.5 pr-10 text-sm rounded-xl',
      lg: 'py-2.5 pl-4 pr-10 text-base rounded-xl',
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            name={name}
            disabled={disabled}
            required={required}
            className={`w-full appearance-none bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border transition-all duration-150 outline-none ${
              error
                ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                : 'border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent'
            } ${sizeClasses[size] || sizeClasses.md} ${
              disabled ? 'opacity-50 cursor-not-allowed bg-slate-800/40' : 'cursor-pointer'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-500 bg-slate-900 text-slate-400">
                {placeholder}
              </option>
            )}
            {options && options.length > 0
              ? options.map((opt) => (
                  <option
                    key={opt.value ?? opt.id ?? opt.label}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 light:bg-white light:text-slate-900"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="mt-1 text-xs font-medium text-red-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
