import {
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Activity,
  FileCheck2
} from 'lucide-react';
import { Card, Badge } from '../ui';

const PrescriptionAnalyticsDashboard = ({ analyticsData }) => {
  const data = analyticsData || {
    totalCount: 142,
    averageOcrAccuracy: 96.8,
    approvalRate: 91.4,
    averageProcessingTimeMs: 1180,
    drugInteractionsDetected: 14,
    statusCounts: {
      pending: 4,
      ocr_completed: 12,
      under_review: 6,
      clarification_requested: 2,
      approved: 98,
      rejected: 8,
      fulfilled: 12
    },
    weeklyTrend: [
      { day: 'Mon', total: 18, approved: 16, rejected: 1 },
      { day: 'Tue', total: 24, approved: 22, rejected: 0 },
      { day: 'Wed', total: 21, approved: 19, rejected: 2 },
      { day: 'Thu', total: 29, approved: 27, rejected: 1 },
      { day: 'Fri', total: 26, approved: 24, rejected: 1 },
      { day: 'Sat', total: 15, approved: 14, rejected: 0 },
      { day: 'Sun', total: 9, approved: 8, rejected: 1 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: OCR Accuracy */}
        <Card variant="glass" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">AI OCR Accuracy Rate</span>
            <Brain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{data.averageOcrAccuracy}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 inline" /> +1.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Benchmark target: &gt;95.0%</p>
        </Card>

        {/* Card 2: Avg Processing Speed */}
        <Card variant="glass" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Avg Processing Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{data.averageProcessingTimeMs}ms</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <Activity className="w-3 h-3 inline" /> Sub-second
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Image compression + AI extraction</p>
        </Card>

        {/* Card 3: Approval Rate */}
        <Card variant="glass" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Pharmacist Approval %</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{data.approvalRate}%</span>
            <Badge variant="success" size="sm">Optimal</Badge>
          </div>
          <p className="text-[11px] text-slate-500">{data.statusCounts?.approved || 98} prescriptions approved</p>
        </Card>

        {/* Card 4: DDI Safety Warnings */}
        <Card variant="glass" className="p-4 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">DDI Safety Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">{data.drugInteractionsDetected}</span>
            <span className="text-xs text-amber-300 font-medium">Prevented</span>
          </div>
          <p className="text-[11px] text-slate-500">Clinical DDI contraindications flagged</p>
        </Card>
      </div>

      {/* Analytics Chart & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Bar Chart Representation */}
        <Card variant="glass" className="lg:col-span-8 p-5 space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                7-Day Intake & Approval Throughput
              </h3>
            </div>
            <span className="text-xs text-slate-400">Daily Prescription Volume</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {data.weeklyTrend.map((dayItem, idx) => {
              const maxVal = 35;
              const totalHeight = Math.round((dayItem.total / maxVal) * 100);
              const appHeight = Math.round((dayItem.approved / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Total Bar */}
                    <div
                      style={{ height: `${totalHeight}%` }}
                      className="w-3.5 bg-blue-600/40 hover:bg-blue-600/60 rounded-t transition-all group relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
                        {dayItem.total}
                      </span>
                    </div>
                    {/* Approved Bar */}
                    <div
                      style={{ height: `${appHeight}%` }}
                      className="w-3.5 bg-emerald-500 rounded-t transition-all group relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
                        {dayItem.approved}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{dayItem.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600/50 rounded-sm"></span>
              <span>Total Intake Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
              <span>Approved Prescriptions</span>
            </div>
          </div>
        </Card>

        {/* Workflow Status Distribution */}
        <Card variant="glass" className="lg:col-span-4 p-5 space-y-4 border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Status Pipeline Breakdown
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'approved', label: 'Approved & Signed', color: 'bg-emerald-500', count: data.statusCounts?.approved || 98 },
              { key: 'ocr_completed', label: 'OCR Extraction Ready', color: 'bg-blue-500', count: data.statusCounts?.ocr_completed || 12 },
              { key: 'under_review', label: 'Under Review', color: 'bg-amber-500', count: data.statusCounts?.under_review || 6 },
              { key: 'clarification_requested', label: 'Clarification Needed', color: 'bg-purple-500', count: data.statusCounts?.clarification_requested || 2 },
              { key: 'rejected', label: 'Rejected', color: 'bg-red-500', count: data.statusCounts?.rejected || 8 }
            ].map((st) => {
              const pct = data.totalCount > 0 ? Math.round((st.count / data.totalCount) * 100) : 0;
              return (
                <div key={st.key} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>{st.label}</span>
                    <span className="font-mono text-slate-400">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${st.color} transition-all`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionAnalyticsDashboard;
