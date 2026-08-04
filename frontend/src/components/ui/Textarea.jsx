import React from 'react';

export const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 3,
      fullWidth = true,
      className = '',
      containerClassName = '',
      id,
      name,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-1.5"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          disabled={disabled}
          required={required}
          className={`w-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-500 light:placeholder:text-slate-400 border py-2.5 px-3.5 text-sm rounded-xl transition-all duration-150 outline-none ${
            error
              ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
              : 'border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-800/40' : ''} ${className}`}
          {...props}
        />

        {error ? (
          <p className="mt-1 text-xs font-medium text-red-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
