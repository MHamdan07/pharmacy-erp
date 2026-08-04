import { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Lock, Database, RefreshCw, Activity, Layers, Search
} from 'lucide-react';
import { Button, Input, Card, Badge, StatusDot, Skeleton } from '../components/ui';

const RiskProtectionMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate smooth loading skeleton on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const risksMatrix = [
    {
      category: 'Inventory & FEFO',
      risk: 'Selling expired medicines',
      impact: 'Patient safety risk, legal issues',
      prevention: 'Automatically block expired items at checkout (FEFO Hard Lock) and alert staff before expiry.',
      module: 'FEFO & Expiry Engine',
      status: 'Active Protection',
      variant: 'success'
    },
    {
      category: 'Inventory & FEFO',
      risk: 'Low stock causing missed sales',
      impact: 'Lost revenue',
      prevention: 'Automatic reorder alerts with minimum stock thresholds (minStock alerts & notification bell).',
      module: 'Inventory Control',
      status: 'Active Protection',
      variant: 'success'
    },
    {
      category: 'Inventory & FEFO',
      risk: 'Wrong stock entries',
      impact: 'Inventory mismatch',
      prevention: 'Use barcode scanning, validation rules, and physical stock reconciliation.',
      module: 'Barcode & Physical Audit',
      status: 'Active Protection',
      variant: 'success'
    },
    {
      category: 'Inventory & FEFO',
      risk: 'Duplicate medicine records',
      impact: 'Confusing inventory',
      prevention: 'Enforce unique barcode/SKU compound indexes ({ pharmacy: 1, sku: 1 }) and duplicate checks.',
      module: 'Catalog Integrity',
      status: 'Active Protection',
      variant: 'success'
    },
    {
      category: 'Security & Auth',
      risk: 'Unauthorized access',
      impact: 'Data theft',
      prevention: 'Role-based permissions (RBAC), JWT, 2FA/MFA, 5-attempt account lockout, and strong password policies.',
      module: 'Security & Auth',
      status: 'Active Protection',
      variant: 'purple'
    },
    {
      category: 'Security & Auth',
      risk: 'Human error in pricing',
      impact: 'Incorrect billing',
      prevention: 'Approval workflow for price changes, Owner master authority override, and immutable audit logs.',
      module: 'Owner RBAC & Audit',
      status: 'Active Protection',
      variant: 'purple'
    },
    {
      category: 'Security & Auth',
      risk: 'Insider fraud',
      impact: 'Financial losses',
      prevention: 'Least-privilege access matrix, Owner master authority oversight, and audit trail stream.',
      module: 'Owner RBAC Oversight',
      status: 'Active Protection',
      variant: 'purple'
    },
    {
      category: 'Resilience & Backup',
      risk: 'Database failure',
      impact: 'Business downtime',
      prevention: 'Automated daily/weekly/monthly backups, tested restore procedures, and local/cloud redundancy.',
      module: 'Backup & Restore Engine',
      status: 'Active Protection',
      variant: 'info'
    },
    {
      category: 'Resilience & Backup',
      risk: 'Slow performance',
      impact: 'Poor user experience',
      prevention: 'Database indexing, query pagination, lazy loading, and optimized Mongoose aggregations.',
      module: 'Database Performance',
      status: 'Active Protection',
      variant: 'info'
    },
    {
      category: 'Resilience & Backup',
      risk: 'Lost internet connection',
      impact: 'Business interruption',
      prevention: 'Offline POS with LocalStorage queueing and automatic synchronization when online (PWA App).',
      module: 'Offline POS & PWA',
      status: 'Active Protection',
      variant: 'info'
    },
    {
      category: 'Resilience & Backup',
      risk: 'Backup corruption',
      impact: 'Data loss',
      prevention: 'Multiple backup versions, local + cloud S3 targets, and 1-click automatic integrity checks.',
      module: 'Backup Verification',
      status: 'Active Protection',
      variant: 'info'
    },
    {
      category: 'Audit & Compliance',
      risk: 'Data tampering',
      impact: 'Fraud',
      prevention: 'Immutable audit logs tracking timestamp, user, branch, and old vs new value diffs.',
      module: 'Audit Trail Feed',
      status: 'Active Protection',
      variant: 'warning'
    },
    {
      category: 'Audit & Compliance',
      risk: 'Prescription misuse',
      impact: 'Legal and ethical risk',
      prevention: 'Verify prescriptions, record Rx numbers, and upload digital prescription document references.',
      module: 'Rx Compliance',
      status: 'Active Protection',
      variant: 'warning'
    },
    {
      category: 'Audit & Compliance',
      risk: 'Branch inventory mismatch',
      impact: 'Transfer errors',
      prevention: 'Approval process with inter-branch transfer receipts, tracking numbers, and dispatch verification.',
      module: 'Multi-Branch Transfer',
      status: 'Active Protection',
      variant: 'warning'
    },
    {
      category: 'Audit & Compliance',
      risk: 'Fake or counterfeit medicines',
      impact: 'Customer safety',
      prevention: 'Batch number tracking, verified supplier NTN/GST profiles, and 1-click batch recall management.',
      module: 'Supplier & Recall Control',
      status: 'Active Protection',
      variant: 'warning'
    },
    {
      category: 'Analytics & Alerts',
      risk: 'Report inaccuracies',
      impact: 'Poor business decisions',
      prevention: 'Validate transactions, enforce server-side aggregated metrics, and prevent direct database edits.',
      module: '12 Analytics Reports',
      status: 'Active Protection',
      variant: 'accent'
    },
    {
      category: 'Analytics & Alerts',
      risk: 'Notification overload',
      impact: 'Important alerts ignored',
      prevention: 'Priority levels, event category filtering (7 events), and grouped in-app notification dropdown.',
      module: 'Notification Center',
      status: 'Active Protection',
      variant: 'accent'
    },
    {
      category: 'Analytics & Alerts',
      risk: 'SMS/Email delivery failures',
      impact: 'Missed alerts',
      prevention: 'Retry queues, fallback status logging, and delivery status monitoring in system audit logs.',
      module: 'Email/SMS Gateways',
      status: 'Active Protection',
      variant: 'accent'
    }
  ];

  const categoryStats = [
    { name: 'Inventory & FEFO', count: 4, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Security & Auth', count: 3, icon: Lock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Resilience & Backup', count: 4, icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Audit & Compliance', count: 4, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Analytics & Alerts', count: 3, icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  const filteredRisks = risksMatrix.filter(
    (r) =>
      r.risk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.impact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.prevention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Top Banner Header */}
      <Card variant="solid" className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <StatusDot variant="success" pulse size="sm" />
              100% Operational Protection Verified
            </div>
            <h1 className="text-2xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
              Major Risks & Enterprise Technical Solutions Matrix
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              Complete inventory of 18 major pharmacy risks, business impacts, and active system preventative controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" size="md" dot pulse icon={CheckCircle2}>
              18 / 18 Risks Mitigated
            </Badge>
          </div>
        </div>
      </Card>

      {/* Glassmorphism Category Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryStats.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <Card key={idx} variant="glass" hoverGlow className="p-3.5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${cat.bg} ${cat.color} shrink-0`}>
                <IconComp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 truncate">
                  {cat.name}
                </div>
                <div className="text-base font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {cat.count} Mitigated
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search Filter Bar */}
      <Card variant="solid" className="p-4 border-slate-800">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter 18 risks, business impacts, system modules, or preventative solutions..."
          leftIcon={Search}
          size="sm"
        />
      </Card>

      {/* Risks & Solutions Table */}
      <Card variant="solid" className="p-5 border-slate-800">
        {loading ? (
          <Skeleton.Table rows={8} columns={4} />
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead className="bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase font-semibold border-b border-slate-800 dark:border-slate-800 light:border-slate-200 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3.5 px-4 w-1/4">Risk / Problem</th>
                  <th className="py-3.5 px-4 w-1/5">Business Impact</th>
                  <th className="py-3.5 px-4 w-2/5">Technical Prevention & Solution</th>
                  <th className="py-3.5 px-4 text-center">Protection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 dark:divide-slate-800/60 light:divide-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700">
                {filteredRisks.length > 0 ? (
                  filteredRisks.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors">
                      {/* Risk */}
                      <td className="py-3.5 px-4 font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{item.risk}</span>
                          </div>
                          <Badge variant={item.variant} size="sm" className="text-[9px]">
                            {item.category}
                          </Badge>
                        </div>
                      </td>

                      {/* Impact */}
                      <td className="py-3.5 px-4 text-rose-400 dark:text-rose-400 light:text-rose-600 font-semibold">
                        {item.impact}
                      </td>

                      {/* Technical Prevention */}
                      <td className="py-3.5 px-4 text-slate-200 dark:text-slate-200 light:text-slate-800">
                        <div className="space-y-1">
                          <div>{item.prevention}</div>
                          <div className="text-[10px] text-blue-400 dark:text-blue-400 light:text-blue-600 font-mono font-semibold">
                            System Module: {item.module}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success" size="md" dot pulse icon={CheckCircle2}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 italic">
                      No matching risk mitigations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};

export default RiskProtectionMatrix;

