import { AlertTriangle, ShieldAlert, HeartPulse, Baby, CheckCircle, Info } from 'lucide-react';
import { Card, Badge } from '../ui';

const ClinicalValidationCard = ({ validationData, alerts = [] }) => {
  const ddiAlerts = alerts.length > 0 ? alerts : [
    { level: 'HIGH', pair: ['Paracetamol 500mg', 'Ibuprofen 400mg'], warningMessage: 'Dual NSAID co-administration risk.' }
  ];

  const allergyWarnings = validationData?.allergyWarnings || [
    { patientAllergy: 'Penicillin', triggeringDrug: 'Amoxicillin 500mg', severity: 'CRITICAL' }
  ];

  const dosageWarnings = validationData?.dosageWarnings || [
    { medicineName: 'Paracetamol 500mg', extractedDosage: '8 tabs/day', maxDailyDosage: '4000mg/day', issue: 'Exceeds maximum safe daily dosage.' }
  ];

  const pregnancyWarnings = validationData?.pregnancyWarnings || [
    { medicineName: 'Ibuprofen 400mg', fdaCategory: 'Category C/D (3rd Trimester)', warningText: 'Contraindicated in 3rd trimester of pregnancy.' }
  ];

  const overallSafe = ddiAlerts.every((a) => a.level !== 'CRITICAL') && allergyWarnings.every((a) => a.severity !== 'CRITICAL');

  return (
    <Card variant="glass" className="p-4 space-y-4 border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${overallSafe ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-red-600/20 text-red-400 border-red-500/30'}`}>
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Clinical Validation & Safety Guardrails
              <Badge variant={overallSafe ? 'success' : 'danger'} size="sm">
                {overallSafe ? 'Passed Clinical Screening' : 'Action Required'}
              </Badge>
            </h3>
            <p className="text-[11px] text-slate-400">
              Automated drug interaction, patient allergy, dosage threshold, and contraindication scanner
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Safety Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* 1. Drug Interaction (DDI) Matrix */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Drug Interactions (DDI)
            </span>
            <Badge variant="warning" size="sm">{ddiAlerts.length} Alerts</Badge>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1.5 custom-scrollbar">
            {ddiAlerts.map((item, idx) => (
              <div key={idx} className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-amber-200">
                  <span>{item.pair?.join(' + ') || 'Drug Pair'}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 uppercase">
                    {item.level || 'MODERATE'}
                  </span>
                </div>
                <p className="text-slate-400 text-[10.5px]">{item.warningMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Allergy Warnings */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="font-bold text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Patient Allergy Triggers
            </span>
            <Badge variant="danger" size="sm">{allergyWarnings.length} Warnings</Badge>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1.5 custom-scrollbar">
            {allergyWarnings.map((item, idx) => (
              <div key={idx} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-red-200">
                  <span>Patient Allergy: {item.patientAllergy}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 uppercase">
                    {item.severity}
                  </span>
                </div>
                <p className="text-slate-300">Triggered by prescribed drug: <strong>{item.triggeringDrug}</strong></p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Dosage Validation */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" /> Dosage Limit Check
            </span>
            <Badge variant="secondary" size="sm">Standard Limits</Badge>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1.5 custom-scrollbar">
            {dosageWarnings.map((item, idx) => (
              <div key={idx} className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[11px] space-y-0.5 text-slate-300">
                <div className="font-bold text-blue-200">{item.medicineName}</div>
                <p className="text-[10.5px]">Extracted: {item.extractedDosage} (Max: {item.maxDailyDosage})</p>
                <p className="text-blue-400 text-[10px] italic">{item.issue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Pregnancy Contraindications */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-purple-400" /> Pregnancy Contraindications
            </span>
            <Badge variant="warning" size="sm">FDA Safety</Badge>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1.5 custom-scrollbar">
            {pregnancyWarnings.map((item, idx) => (
              <div key={idx} className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[11px] space-y-0.5 text-purple-200">
                <div className="flex items-center justify-between font-bold">
                  <span>{item.medicineName}</span>
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">{item.fdaCategory}</span>
                </div>
                <p className="text-slate-300 text-[10.5px]">{item.warningText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicalValidationCard;
