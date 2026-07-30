import { Sparkles, X, CheckCircle2 } from 'lucide-react';

const ReactivateSubscriptionModal = ({ isOpen, onClose, onConfirm }) => {
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
          <div className="mx-auto w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/40 shadow-lg">
            <Sparkles className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Reactivate Subscription</h2>
          <p className="text-xs text-slate-400">
            Restore your active subscription before it expires.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Instant ERP Module Access
          </div>
          <p>Reactivating restores auto-renewal and keeps all your custom feature flags and limits intact.</p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={onConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Reactivate Subscription
          </button>
          <button
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReactivateSubscriptionModal;
