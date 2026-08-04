import React from 'react';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      size = 'md',
      fullWidth = true,
      className = '',
      containerClassName = '',
      id,
      name,
      type = 'text',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'py-1.5 px-3 text-xs rounded-lg',
      md: 'py-2 px-3.5 text-sm rounded-xl',
      lg: 'py-2.5 px-4 text-base rounded-xl',
    };

    const leftPadding = LeftIcon ? 'pl-10' : '';
    const rightPadding = RightIcon ? 'pr-10' : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3 pointer-events-none text-slate-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            disabled={disabled}
            required={required}
            className={`w-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-500 light:placeholder:text-slate-400 border transition-all duration-150 outline-none ${
              error
                ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                : 'border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent'
            } ${sizeClasses[size] || sizeClasses.md} ${leftPadding} ${rightPadding} ${
              disabled ? 'opacity-50 cursor-not-allowed bg-slate-800/40' : ''
            } ${className}`}
            {...props}
          />

          {RightIcon && (
            <div className="absolute right-3 pointer-events-none text-slate-400">
              <RightIcon className="w-4 h-4" />
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;
