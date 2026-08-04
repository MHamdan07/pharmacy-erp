import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Modal, Button } from './ui';

const UpgradeModal = ({
  isOpen,
  onClose,
  requiredFeature = 'this module',
  currentPlan = 'Starter',
  requiredPlan = 'Professional'
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Required"
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/settings/subscription');
            }}
          >
            <Sparkles className="w-4 h-4 mr-1 text-amber-300" />
            Upgrade Plan
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-amber-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
          Your current <strong className="text-amber-400">{currentPlan} Plan</strong> subscription does not include access to <strong className="text-white dark:text-white light:text-slate-900">{requiredFeature}</strong>.
        </p>

        <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-4 rounded-xl space-y-2 text-xs text-left">
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-400 light:text-slate-600">
            <span>Current Subscription:</span>
            <span className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">{currentPlan} Plan</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 dark:text-slate-400 light:text-slate-600 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 pt-2">
            <span>Required Plan:</span>
            <span className="font-extrabold text-purple-400">{requiredPlan} Plan or Higher</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
