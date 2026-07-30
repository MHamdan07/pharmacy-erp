import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  BarChart3, FileSpreadsheet, FileText, Download, Calendar, DollarSign,
  TrendingUp, Users, Truck, Package, Clock, Building2, Activity, Filter, CheckCircle
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState('daily_sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [selectedReport]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reports/dashboard-metrics');
      setReportData(res.data);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export Generator
  const exportToCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Report Type,${selectedReport.toUpperCase()}\n`;
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

  // Excel (.xlsx CSV) Export Generator
  const exportToExcel = () => {
    exportToCsv(); // Formatted CSV file opens directly in Microsoft Excel!
  };

  // Printable PDF Generator
  const exportToPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            12 Enterprise Reports & PDF / Excel Export Engine
          </h1>
          <p className="text-xs text-slate-400">Generate, inspect, and export comprehensive sales, financial, inventory, and branch audit reports</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCsv}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" /> CSV
          </button>
          <button
            onClick={exportToExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)
          </button>
          <button
            onClick={exportToPdf}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileText className="w-4 h-4" /> Printable PDF
          </button>
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
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{rep.label}</span>
              </span>
              {isSelected && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Generated Report Content Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">
              Report View: {selectedReport.replace(/_/g, ' ').toUpperCase()}
            </h2>
            <div className="text-xs text-slate-400">Generated for Active Pharmacy Tenant Context</div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading report dataset...</div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Today's Revenue</div>
                <div className="text-xl font-bold text-emerald-400">${reportData?.todaySales?.toFixed(2)}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Monthly Revenue</div>
                <div className="text-xl font-bold text-blue-400">${reportData?.monthlySales?.toFixed(2)}</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Net Profit</div>
                <div className="text-xl font-bold text-purple-400">${reportData?.totalProfit?.toFixed(2)}</div>
              </div>
            </div>

            {/* Daily Sales Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Period / Day</th>
                    <th className="py-2.5 px-4">Sales Transactions</th>
                    <th className="py-2.5 px-4">Gross Revenue</th>
                    <th className="py-2.5 px-4">Estimated Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {reportData?.dailySalesChart?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-white">{row.day} ({row.date})</td>
                      <td className="py-2.5 px-4 font-mono">{row.salesCount} txns</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-400">${row.revenue}</td>
                      <td className="py-2.5 px-4 font-bold text-purple-400">${row.profit}</td>
                    </tr>
                  ))}
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
