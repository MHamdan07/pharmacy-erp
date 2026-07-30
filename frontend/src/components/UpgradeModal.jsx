import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight, X, ShieldAlert } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, requiredFeature = 'this module', currentPlan = 'Starter', requiredPlan = 'Professional' }) => {
  const navigate = useNavigate();

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
          <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-amber-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Upgrade Required</h2>
          <p className="text-xs text-slate-400">
            Your current <strong className="text-amber-400">{currentPlan} Plan</strong> subscription does not include access to <strong className="text-white">{requiredFeature}</strong>.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Current Subscription:</span>
            <span className="font-bold text-slate-200">{currentPlan} Plan</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Required Plan:</span>
            <span className="font-extrabold text-purple-400">{requiredPlan} Plan or Higher</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              navigate('/settings/subscription');
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Upgrade Subscription Now
            <ArrowRight className="w-4 h-4" />
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

export default UpgradeModal;
