import React from 'react';
import StatusDot from './StatusDot';

const variantClasses = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-200',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 light:bg-amber-50 light:text-amber-700 light:border-amber-200',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 light:bg-red-50 light:text-red-700 light:border-red-200',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 light:bg-blue-50 light:text-blue-700 light:border-blue-200',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30 light:bg-purple-50 light:text-purple-700 light:border-purple-200',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/30 light:bg-slate-100 light:text-slate-700 light:border-slate-300',
  accent: 'bg-accent-soft text-accent border-accent-subtle',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const appliedVariant = variantClasses[variant] || variantClasses.neutral;
  const appliedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide uppercase ${appliedVariant} ${appliedSize} ${className}`}
      {...props}
    >
      {dot && <StatusDot variant={variant} pulse={pulse} size="sm" />}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
