import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from './ui';

const CancelSubscriptionModal = ({
  isOpen,
  onClose,
  onConfirm,
  expirationDate = 'end of billing period'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Subscription"
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Keep Subscription
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Cancel Subscription
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-rose-500/15 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/30 shadow-lg">
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
          Are you sure you want to cancel your pharmacy subscription?
        </p>

        <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-4 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs text-left space-y-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
          <p className="font-semibold text-amber-400">
            • Your subscription will remain active until <strong className="text-white dark:text-white light:text-slate-900">{expirationDate}</strong>.
          </p>
          <p>• After expiration, ERP modules will be locked.</p>
          <p className="text-emerald-400 font-semibold">• Your data will remain preserved for 90 days.</p>
          <p>• You can reactivate anytime before or after expiration.</p>
        </div>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModal;
