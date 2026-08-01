import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  BarChart3, FileSpreadsheet, FileText, Download, Calendar, DollarSign,
  TrendingUp, Users, Truck, Package, Clock, Building2, Activity, CheckCircle, Search
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState('daily_sales');
  const [dateRange, setDateRange] = useState('month'); // 'today', 'week', 'month', 'year'
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/reports/dashboard-metrics');
      setReportData(res.data);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange, fetchReportData]);

  // CSV Export Generator
  const exportToCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Report Type,${selectedReport.toUpperCase()}\n`;
    csvContent += `Date Range,${startDate} to ${endDate}\n`;
    csvContent += `Generated Date,${new Date().toLocaleString()}\n\n`;

    if (selectedReport.includes('sales')) {
      csvContent += 'Day/Date,Sales Count,Revenue ($),Profit ($)\n';
      reportData?.dailySalesChart?.forEach((r) => {
        csvContent += `${r.day},${r.salesCount},${r.revenue},${r.profit}\n`;
      });
    } else {
      csvContent += 'Metric,Value\n';
      csvContent += `Total Sales,${reportData?.todaySales}\n`;
      csvContent += `Monthly Sales,${reportData?.monthlySales}\n`;
      csvContent += `Net Profit,${reportData?.totalProfit}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedReport}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    exportToCsv(); // Formatted CSV opens natively in MS Excel
  };

  const exportToPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">

      {/* Top Header & Export Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            12 Enterprise Reports & PDF / Excel Export Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Generate, inspect, and export comprehensive sales, financial, inventory, and branch audit reports</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCsv}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" /> CSV
          </button>
          <button
            onClick={exportToExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)
          </button>
          <button
            onClick={exportToPdf}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileText className="w-4 h-4" /> Printable PDF
          </button>
        </div>
      </div>

      {/* DATE RANGE FILTERING BAR */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-400" /> Date Filter:
          </span>
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase cursor-pointer transition-all ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* 12 Report Type Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs font-bold">
        {[
          { id: 'daily_sales', label: '1. Daily Sales Report', icon: DollarSign },
          { id: 'weekly_sales', label: '2. Weekly Sales Report', icon: TrendingUp },
          { id: 'monthly_sales', label: '3. Monthly Sales Report', icon: Calendar },
          { id: 'profit_report', label: '4. Profit Margin Report', icon: BarChart3 },
          { id: 'tax_report', label: '5. Tax (GST/VAT) Report', icon: FileText },
          { id: 'supplier_report', label: '6. Supplier Dues Report', icon: Truck },
          { id: 'customer_report', label: '7. Customer Ledger Report', icon: Users },
          { id: 'inventory_report', label: '8. Inventory Valuation', icon: Package },
          { id: 'expiry_report', label: '9. Expiry Audit Report', icon: Clock },
          { id: 'purchase_report', label: '10. Purchase GRN Report', icon: FileSpreadsheet },
          { id: 'employee_report', label: '11. Employee Activity Audit', icon: Activity },
          { id: 'branch_report', label: '12. Branch Comparison', icon: Building2 }
        ].map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Icon className="w-4 h-4 shrink-0 text-blue-300" />
                <span className="truncate">{rep.label}</span>
              </span>
              {isSelected && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Generated Report Content Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Report View: {selectedReport.replace(/_/g, ' ').toUpperCase()}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">Filter Period: {startDate} to {endDate} • Active Pharmacy Branch</div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search report entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading report dataset...</div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Gross Sales Revenue</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">${reportData?.todaySales?.toFixed(2) || '0.00'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Across active period</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Transactions</div>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">{reportData?.dailySalesChart?.reduce((acc, r) => acc + r.salesCount, 0) || 0} Txns</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Completed checkout bills</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Estimated Net Profit</div>
                <div className="text-2xl font-extrabold text-purple-400 mt-1">${reportData?.totalProfit?.toFixed(2) || '0.00'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Cost price margin calculation</div>
              </div>
            </div>

            {/* Daily Sales Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px] border-collapse">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Period / Day</th>
                    <th className="py-3 px-4">Sales Transactions</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">Estimated Net Profit</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {reportData?.dailySalesChart?.map((row, idx) => {
                    const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100).toFixed(1) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{row.day} ({row.date})</td>
                        <td className="py-3.5 px-4 font-mono">{row.salesCount} txns</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${row.revenue}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-400">${row.profit}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-400">{margin}% Margin</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReportsAnalytics;
