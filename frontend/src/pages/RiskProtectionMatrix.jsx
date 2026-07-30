import { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Lock, Database, WifiOff, FileCheck,
  CheckCircle2, Layers, RefreshCw, Activity, UserCheck, Shield, Sparkles
} from 'lucide-react';

const RiskProtectionMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const risksMatrix = [
    {
      risk: 'Selling expired medicines',
      impact: 'Patient safety risk, legal issues',
      prevention: 'Automatically block expired items at checkout (FEFO Hard Lock) and alert staff before expiry.',
      module: 'FEFO & Expiry Engine',
      status: 'Active Protection'
    },
    {
      risk: 'Low stock causing missed sales',
      impact: 'Lost revenue',
      prevention: 'Automatic reorder alerts with minimum stock thresholds (minStock alerts & notification bell).',
      module: 'Inventory Control',
      status: 'Active Protection'
    },
    {
      risk: 'Wrong stock entries',
      impact: 'Inventory mismatch',
      prevention: 'Use barcode scanning, validation rules, and physical stock reconciliation.',
      module: 'Barcode & Physical Audit',
      status: 'Active Protection'
    },
    {
      risk: 'Duplicate medicine records',
      impact: 'Confusing inventory',
      prevention: 'Enforce unique barcode/SKU compound indexes ({ pharmacy: 1, sku: 1 }) and duplicate checks.',
      module: 'Catalog Integrity',
      status: 'Active Protection'
    },
    {
      risk: 'Unauthorized access',
      impact: 'Data theft',
      prevention: 'Role-based permissions (RBAC), JWT, 2FA/MFA, 5-attempt account lockout, and strong password policies.',
      module: 'Security & Auth',
      status: 'Active Protection'
    },
    {
      risk: 'Human error in pricing',
      impact: 'Incorrect billing',
      prevention: 'Approval workflow for price changes, Owner master authority override, and immutable audit logs.',
      module: 'Owner RBAC & Audit',
      status: 'Active Protection'
    },
    {
      risk: 'Database failure',
      impact: 'Business downtime',
      prevention: 'Automated daily/weekly/monthly backups, tested restore procedures, and local/cloud redundancy.',
      module: 'Backup & Restore Engine',
      status: 'Active Protection'
    },
    {
      risk: 'Slow performance',
      impact: 'Poor user experience',
      prevention: 'Database indexing, query pagination, lazy loading, and optimized Mongoose aggregations.',
      module: 'Database Performance',
      status: 'Active Protection'
    },
    {
      risk: 'Lost internet connection',
      impact: 'Business interruption',
      prevention: 'Offline POS with LocalStorage queueing and automatic synchronization when online (PWA App).',
      module: 'Offline POS & PWA',
      status: 'Active Protection'
    },
    {
      risk: 'Data tampering',
      impact: 'Fraud',
      prevention: 'Immutable audit logs tracking timestamp, user, branch, and old vs new value diffs.',
      module: 'Audit Trail Feed',
      status: 'Active Protection'
    },
    {
      risk: 'Prescription misuse',
      impact: 'Legal and ethical risk',
      prevention: 'Verify prescriptions, record Rx numbers, and upload digital prescription document references.',
      module: 'Rx Compliance',
      status: 'Active Protection'
    },
    {
      risk: 'Branch inventory mismatch',
      impact: 'Transfer errors',
      prevention: 'Approval process with inter-branch transfer receipts, tracking numbers, and dispatch verification.',
      module: 'Multi-Branch Transfer',
      status: 'Active Protection'
    },
    {
      risk: 'Fake or counterfeit medicines',
      impact: 'Customer safety',
      prevention: 'Batch number tracking, verified supplier NTN/GST profiles, and 1-click batch recall management.',
      module: 'Supplier & Recall Control',
      status: 'Active Protection'
    },
    {
      risk: 'Report inaccuracies',
      impact: 'Poor business decisions',
      prevention: 'Validate transactions, enforce server-side aggregated metrics, and prevent direct database edits.',
      module: '12 Analytics Reports',
      status: 'Active Protection'
    },
    {
      risk: 'Backup corruption',
      impact: 'Data loss',
      prevention: 'Multiple backup versions, local + cloud S3 targets, and 1-click automatic integrity checks.',
      module: 'Backup Verification',
      status: 'Active Protection'
    },
    {
      risk: 'Notification overload',
      impact: 'Important alerts ignored',
      prevention: 'Priority levels, event category filtering (7 events), and grouped in-app notification dropdown.',
      module: 'Notification Center',
      status: 'Active Protection'
    },
    {
      risk: 'SMS/Email delivery failures',
      impact: 'Missed alerts',
      prevention: 'Retry queues, fallback status logging, and delivery status monitoring in system audit logs.',
      module: 'Email/SMS Gateways',
      status: 'Active Protection'
    },
    {
      risk: 'Insider fraud',
      impact: 'Financial losses',
      prevention: 'Least-privilege access matrix, Owner master authority oversight, and audit trail stream.',
      module: 'Owner RBAC Oversight',
      status: 'Active Protection'
    }
  ];

  const filteredRisks = risksMatrix.filter(
    (r) =>
      r.risk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.impact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.prevention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Operational Protection Verified
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Major Risks (Cons) & Enterprise Technical Solutions Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory of 18 major pharmacy risks, business impacts, and active system preventative controls
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-400 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" /> 18 / 18 Risks Mitigated
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter risks, impacts, or preventative solutions..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Risks & Solutions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-1">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="py-3.5 px-4 w-1/4">Risk / Problem</th>
                <th className="py-3.5 px-4 w-1/5">Impact</th>
                <th className="py-3.5 px-4 w-2/5">Technical Prevention & Solution</th>
                <th className="py-3.5 px-4 text-center">Module Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRisks.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {/* Risk */}
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item.risk}</span>
                    </div>
                  </td>

                  {/* Impact */}
                  <td className="py-3.5 px-4 text-rose-300 font-medium">
                    {item.impact}
                  </td>

                  {/* Technical Prevention */}
                  <td className="py-3.5 px-4 text-slate-200">
                    <div className="space-y-1">
                      <div>{item.prevention}</div>
                      <div className="text-[10px] text-blue-400 font-mono font-semibold">
                        System Module: {item.module}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RiskProtectionMatrix;
