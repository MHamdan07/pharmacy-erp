import React from 'react';

const dotColorMap = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  neutral: 'bg-slate-400',
  accent: 'bg-accent',
};

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

export const StatusDot = ({
  variant = 'neutral',
  pulse = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const color = dotColorMap[variant] || dotColorMap.neutral;
  const dimension = sizeMap[size] || sizeMap.md;

  return (
    <span className={`relative flex items-center justify-center shrink-0 ${dimension} ${className}`} {...props}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${color}`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-full w-full ${color}`} />
    </span>
  );
};

export default StatusDot;
