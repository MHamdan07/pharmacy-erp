import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Edit3,
  ShoppingCart,
  FileCheck,
  ShieldAlert,
  Award
} from 'lucide-react';
import { Card, Button, Input, Textarea, Badge } from '../ui';

const PharmacistReviewConsole = ({ prescription, onReviewAction, onConvertToPos, loading }) => {
  const [licenseNumber, setLicenseNumber] = useState('PHARM-LIC-99482');
  const [signature, setSignature] = useState('Dr. Alex Morgan, PharmD');
  const [rejectionReason, setRejectionReason] = useState('');
  const [clarificationNotes, setClarificationNotes] = useState('');
  const [activeAction, setActiveAction] = useState(null); // null | 'reject' | 'clarify'

  if (!prescription) {
    return (
      <Card variant="glass" className="p-6 text-center text-slate-500 text-xs">
        Select a prescription from the queue to open the Pharmacist Workstation console.
      </Card>
    );
  }

  const handleApprove = () => {
    onReviewAction(prescription._id, {
      action: 'approve',
      pharmacistLicense: licenseNumber,
      digitalSignature: signature,
      notes: 'Prescription reviewed, dosage verified, clinical safety passed.'
    });
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    onReviewAction(prescription._id, {
      action: 'reject',
      rejectionReason: rejectionReason || 'Prescription unreadable or clinical contraindication.'
    });
    setActiveAction(null);
  };

  const handleClarifySubmit = (e) => {
    e.preventDefault();
    onReviewAction(prescription._id, {
      action: 'request_clarification',
      clarificationNotes: clarificationNotes || 'Physician confirmation required regarding dosage frequency.'
    });
    setActiveAction(null);
  };

  const isApproved = prescription.status === 'approved' || prescription.status === 'fulfilled';

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Pharmacist Clinical Review & Sign-Off Workstation
              <Badge
                variant={
                  prescription.status === 'approved' || prescription.status === 'fulfilled'
                    ? 'success'
                    : prescription.status === 'rejected'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              >
                {prescription.status.replace('_', ' ')}
              </Badge>
            </h3>
            <p className="text-[11px] text-slate-400">
              Rx Code: <span className="font-mono text-slate-300">#{prescription._id.slice(-8)}</span> • Issued for {prescription.patientName}
            </p>
          </div>
        </div>

        {isApproved && (
          <Button
            variant="success"
            size="sm"
            leftIcon={ShoppingCart}
            loading={loading}
            onClick={() => onConvertToPos(prescription._id)}
            className="shadow-lg shadow-emerald-500/20"
          >
            Unlock POS Cashier Billing
          </Button>
        )}
      </div>

      {/* Pharmacist Digital License Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
        <Input
          label="Pharmacist State License #"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          placeholder="PHARM-LIC-XXXXX"
        />
        <Input
          label="Digital E-Signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Dr. Pharmacist Name, PharmD"
        />
      </div>

      {/* Action Buttons */}
      {!isApproved && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="success"
              size="sm"
              leftIcon={CheckCircle2}
              loading={loading}
              onClick={handleApprove}
              className="shadow-lg shadow-emerald-500/20 flex-1"
            >
              Approve Prescription
            </Button>

            <Button
              variant="outline"
              size="sm"
              leftIcon={HelpCircle}
              onClick={() => setActiveAction(activeAction === 'clarify' ? null : 'clarify')}
            >
              Request Clarification
            </Button>

            <Button
              variant="danger"
              size="sm"
              leftIcon={XCircle}
              onClick={() => setActiveAction(activeAction === 'reject' ? null : 'reject')}
            >
              Reject Prescription
            </Button>
          </div>

          {/* Clarification Drawer */}
          {activeAction === 'clarify' && (
            <form onSubmit={handleClarifySubmit} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Request Physician Clarification
              </div>
              <Textarea
                rows={2}
                value={clarificationNotes}
                onChange={(e) => setClarificationNotes(e.target.value)}
                placeholder="Specify details required from prescribing doctor..."
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveAction(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="warning" size="sm" loading={loading}>
                  Send Clarification Request
                </Button>
              </div>
            </form>
          )}

          {/* Rejection Drawer */}
          {activeAction === 'reject' && (
            <form onSubmit={handleRejectSubmit} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Clinical Rejection Reason
              </div>
              <Textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State medical or administrative reason for rejection..."
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveAction(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm" loading={loading}>
                  Confirm Rejection
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Card>
  );
};

export default PharmacistReviewConsole;
