import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal, Button } from './ui';

const ReactivateSubscriptionModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reactivate Subscription"
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="success" size="sm" onClick={onConfirm}>
            Reactivate Subscription
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg">
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
          Restore your active subscription and ensure uninterrupted access to all pharmacy modules.
        </p>

        <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-4 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs text-left space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Instant ERP Module Access
          </div>
          <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">
            Reactivating restores auto-renewal and keeps all your custom feature flags and limits intact.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReactivateSubscriptionModal;
