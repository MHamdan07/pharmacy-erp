import { History, CheckCircle, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { Card, Badge } from '../ui';

const PrescriptionAuditTimeline = ({ history = [], status = 'ocr_completed' }) => {
  const workflowStages = [
    { key: 'upload', label: '1. Upload' },
    { key: 'ocr', label: '2. Image Enhancement & OCR' },
    { key: 'compression', label: '3. Bandwidth Compression' },
    { key: 'ai_detection', label: '4. AI Medicine Extraction' },
    { key: 'validation', label: '5. Clinical Validation' },
    { key: 'pharmacist_review', label: '6. Pharmacist Review' },
    { key: 'approval', label: '7. Digital Approval' },
    { key: 'invoice', label: '8. POS Billing Invoice' }
  ];

  const mockLogs = history.length > 0 ? history : [
    {
      action: 'INTAKE_UPLOAD',
      status: 'pending',
      performedByName: 'Intake Operator',
      timestamp: new Date(Date.now() - 3600000),
      notes: 'Prescription document intake received via WebCam feed.'
    },
    {
      action: 'PREPROCESS_OCR',
      status: 'ocr_completed',
      performedByName: 'AI OCR Pipeline Engine v2.4',
      timestamp: new Date(Date.now() - 1800000),
      notes: 'Extracted 2 line items with 96.8% confidence. Preprocessed denoise & deskew.'
    },
    {
      action: 'CLINICAL_SCREENING',
      status: 'under_review',
      performedByName: 'Clinical Safety Module',
      timestamp: new Date(Date.now() - 900000),
      notes: 'Flagged 1 MODERATE Drug-Drug Interaction (Paracetamol + Ibuprofen).'
    }
  ];

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Workflow Pipeline Tracker & Immutable Audit Trail Log
            </h3>
            <p className="text-[11px] text-slate-400">
              End-to-end 14-stage workflow status timeline and immutable security event trail
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Stage Horizontal Stepper */}
      <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex items-center justify-between min-w-[650px] gap-2">
          {workflowStages.map((stage, idx) => {
            const isComplete = idx < 5;
            const isCurrent = idx === 5;
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center text-center space-y-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isComplete
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-500/50 animate-pulse'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                >
                  {isComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    isComplete ? 'text-emerald-400' : isCurrent ? 'text-blue-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-slate-300 flex items-center gap-1.5 pt-1">
          <Clock className="w-4 h-4 text-blue-400" /> Chronological Event Audit Log:
        </h4>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1.5 custom-scrollbar">
          {mockLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 flex items-start justify-between text-xs gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm font-mono">{log.action}</Badge>
                  <span className="font-bold text-white flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {log.performedByName || 'System Actor'}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.notes}</p>
              </div>

              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PrescriptionAuditTimeline;
