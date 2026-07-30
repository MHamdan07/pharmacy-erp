import { AlertTriangle, X, ShieldCheck } from 'lucide-react';

const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm, expirationDate = 'end of billing period' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/40 shadow-lg">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Cancel Subscription</h2>
          <p className="text-xs text-slate-400">
            Are you sure you want to cancel your subscription?
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
          <p className="font-semibold text-amber-300">
            • Your subscription will remain active until <strong className="text-white">{expirationDate}</strong>.
          </p>
          <p>• After expiration, ERP modules will be locked.</p>
          <p className="text-emerald-400 font-semibold">• Your data will remain preserved for 90 days.</p>
          <p>• You can reactivate anytime before or after expiration.</p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={onConfirm}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer shadow-lg shadow-rose-500/20"
          >
            Cancel Subscription
          </button>
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
