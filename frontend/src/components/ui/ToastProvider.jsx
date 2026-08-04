/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  // Auto-dismiss helper
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => showToast({ type: 'success', title, message }),
    [showToast]
  );

  const error = useCallback(
    (message, title = 'Error') => showToast({ type: 'error', title, message }),
    [showToast]
  );

  const warning = useCallback(
    (message, title = 'Warning') => showToast({ type: 'warning', title, message }),
    [showToast]
  );

  const info = useCallback(
    (message, title = 'Information') => showToast({ type: 'info', title, message }),
    [showToast]
  );

  // Modern replacement for window.confirm() returning a Promise<boolean>
  const confirm = useCallback(
    ({
      title = 'Are you sure?',
      message = 'This action cannot be undone.',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'danger',
    }) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          onConfirm: () => {
            setConfirmState(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmState(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  // Modern replacement for window.alert() returning a Promise<void>
  const alert = useCallback(
    ({ title = 'Alert', message = '', buttonText = 'OK', variant = 'primary' }) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText: buttonText,
          cancelText: null,
          variant,
          onConfirm: () => {
            setConfirmState(null);
            resolve(true);
          },
          onCancel: () => {
            setConfirmState(null);
            resolve(true);
          },
        });
      });
    },
    []
  );

  const toastIcons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const toastBorders = {
    success: 'border-emerald-500/40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-emerald-50',
    error: 'border-red-500/40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-red-50',
    warning: 'border-amber-500/40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-amber-50',
    info: 'border-blue-500/40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-blue-50',
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        confirm,
        alert,
      }}
    >
      {children}

      {/* Global Toast Stack Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-5 ${
              toastBorders[toast.type] || toastBorders.info
            }`}
          >
            {toastIcons[toast.type] || toastIcons.info}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 mt-0.5 break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Global Confirm / Alert Modal Dialog */}
      {confirmState && (
        <Modal
          isOpen={confirmState.isOpen}
          onClose={confirmState.onCancel}
          title={confirmState.title}
          size="sm"
          footer={
            <>
              {confirmState.cancelText && (
                <Button variant="outline" size="sm" onClick={confirmState.onCancel}>
                  {confirmState.cancelText}
                </Button>
              )}
              <Button variant={confirmState.variant} size="sm" onClick={confirmState.onConfirm}>
                {confirmState.confirmText}
              </Button>
            </>
          }
        >
          <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700">
            {confirmState.message}
          </p>
        </Modal>
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
