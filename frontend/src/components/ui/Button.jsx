import React from 'react';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 dark:bg-slate-800 dark:text-slate-100 light:bg-slate-100 light:text-slate-800 light:border-slate-300 light:hover:bg-slate-200',
  accent: 'bg-accent bg-accent-hover text-white shadow-sm shadow-accent/20 active:scale-[0.98]',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20 active:scale-[0.98]',
  outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white dark:border-slate-700 dark:text-slate-300 light:border-slate-300 light:text-slate-700 light:hover:bg-slate-100',
  ghost: 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 dark:text-slate-400 light:text-slate-600 light:hover:bg-slate-100',
};

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs font-medium gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm font-semibold gap-2 rounded-xl',
  lg: 'px-5 py-2.5 text-base font-semibold gap-2.5 rounded-xl',
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled = false,
      fullWidth = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none';

    const appliedVariant = variantClasses[variant] || variantClasses.primary;
    const appliedSize = sizeClasses[size] || sizeClasses.md;
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${appliedVariant} ${appliedSize} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : LeftIcon ? (
          <LeftIcon className="w-4 h-4 shrink-0" />
        ) : null}

        {children && <span>{children}</span>}

        {!isLoading && RightIcon ? <RightIcon className="w-4 h-4 shrink-0" /> : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
