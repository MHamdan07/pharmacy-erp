import React from 'react';

export const ToggleSwitch = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  id,
  name,
  ...props
}) => {
  const switchId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const dimensions = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  const currentSize = dimensions[size] || dimensions.md;

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {(label || description) && (
        <div className="flex-1 cursor-pointer" onClick={handleToggle}>
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 cursor-pointer block select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 select-none">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-slate-950 ${
          currentSize.track
        } ${
          checked
            ? 'bg-accent'
            : 'bg-slate-700 dark:bg-slate-700 light:bg-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out ${
            currentSize.thumb
          } ${checked ? currentSize.translate : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
