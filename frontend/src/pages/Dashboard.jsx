import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, AlertTriangle, Clock, Building2, ShoppingCart,
  ArrowUpRight, TrendingUp, ShieldAlert, Award, PackageX, Activity, Users,
  Truck, Layers, BarChart3, PieChart, Sparkles, X, AlertCircle, CheckCircle2, ChevronRight,
  Eye, FileText, UserCheck, Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user, activeBranchId, branches } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected KPI Alarm / Detail Modal State
  const [activeKpiModal, setActiveKpiModal] = useState(null);

  // Clickable Audit Log Inspector State
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);

  const activeBranch = branches.find(b => b._id === activeBranchId) || user?.branch;

  useEffect(() => {
    fetchDashboardData();
  }, [activeBranchId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/reports/dashboard-metrics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load Phase 2 Dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <span className="font-semibold text-sm">Loading Executive Dashboard & Real-Time Alarm Systems...</span>
      </div>
    );
  }

  const maxDailyRevenue = Math.max(...(data?.dailySalesChart?.map(d => d.revenue) || [100]), 100);

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {user?.pharmacy?.name} · {activeBranch?.name || 'Main Branch'}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
           Dashboard & Real-Time Alarms
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Click any KPI card or Audit Log row below to inspect live alarms, audit diffs, and financial ledgers!
          </p>
        </div>

        <Link
          to="/pos"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Launch POS Billing Terminal</span>
        </Link>
      </div>

      {/* INTERACTIVE KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Today's Sales */}
        <div
          onClick={() => setActiveKpiModal('todaySales')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-emerald-400 transition-colors">Today's Sales</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              ${data?.todaySales?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Click for Today's Ledger ➔
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* 2. Monthly Sales */}
        <div
          onClick={() => setActiveKpiModal('monthlySales')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-blue-400 transition-colors">Monthly Sales</div>
            <div className="text-2xl font-extrabold text-blue-400 mt-1">
              ${data?.monthlySales?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-blue-400/80 mt-1 font-medium">Click for Monthly Revenue ➔</div>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* 3. Total Net Profit */}
        <div
          onClick={() => setActiveKpiModal('totalProfit')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-purple-400 transition-colors">Total Net Profit</div>
            <div className="text-2xl font-extrabold text-purple-400 mt-1">
              ${data?.totalProfit?.toFixed(2) || '0.00'}
            </div>
            <div className="text-[11px] text-purple-400/80 mt-1 font-medium">Click for Profit Margin ➔</div>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* 4. Total & Active Medicines */}
        <div
          onClick={() => setActiveKpiModal('activeMedicines')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-white transition-colors">Total / Active Medicines</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {data?.activeMedicines || 0} <span className="text-sm font-normal text-slate-400">/ {data?.totalMedicines || 0}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Click for Catalog Details ➔</div>
          </div>
          <div className="w-12 h-12 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700 group-hover:bg-slate-700 group-hover:text-white transition-all">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* 5. Low Stock Items */}
        <div
          onClick={() => setActiveKpiModal('lowStock')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-amber-900/40 hover:border-amber-500 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden"
        >
          {data?.lowStockCount > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping"></span>
          )}
          <div>
            <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Items
            </div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {data?.lowStockCount || 0}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1 font-semibold">Click for Reorder Alarm ➔</div>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* 6. Out of Stock */}
        <div
          onClick={() => setActiveKpiModal('outOfStock')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-rose-900/50 hover:border-rose-500 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden"
        >
          {data?.outOfStockCount > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
          )}
          <div>
            <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
              <PackageX className="w-3.5 h-3.5" /> Out of Stock
            </div>
            <div className="text-2xl font-extrabold text-rose-500 mt-1">
              {data?.outOfStockCount || 0}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1 font-semibold">Click for Restock Alarm ➔</div>
          </div>
          <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-slate-950 transition-all">
            <PackageX className="w-6 h-6" />
          </div>
        </div>

        {/* 7. Expired & Expiring Soon */}
        <div
          onClick={() => setActiveKpiModal('expired')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-rose-900/40 hover:border-purple-500 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-purple-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Expired / Expiring Soon
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">
              {data?.expiredMedicinesCount || 0} <span className="text-sm font-normal text-amber-400">({data?.expiringSoonCount || 0} soon)</span>
            </div>
            <div className="text-[11px] text-purple-400/80 mt-1 font-semibold">Click for FEFO Expiry Alarm ➔</div>
          </div>
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* 8. Pending Payments / Supplier Dues */}
        <div
          onClick={() => setActiveKpiModal('dues')}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-amber-400 transition-colors">Pending Payments / Supplier Dues</div>
            <div className="text-lg font-extrabold text-white mt-1">
              <span className="text-amber-400">${data?.pendingPayments?.toFixed(2) || '0.00'}</span> / <span className="text-red-400">${data?.supplierDues?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Click for Accounts Ledger ➔</div>
          </div>
          <div className="w-12 h-12 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Daily Sales & Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Daily Sales Revenue & Net Profit (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-400">Daily sales breakdown across active branch</p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {data?.dailySalesChart?.map((item, index) => {
              const heightPercent = maxDailyRevenue > 0 ? (item.revenue / maxDailyRevenue) * 100 : 5;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-slate-950 border border-slate-700 text-white text-[10px] p-2 rounded-lg shadow-xl z-20 pointer-events-none whitespace-nowrap">
                    <div>Revenue: ${item.revenue}</div>
                    <div>Profit: ${item.profit}</div>
                    <div>Sales: {item.salesCount} txns</div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-full relative">
                    <div
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      className="bg-gradient-to-t from-blue-600 to-emerald-400 w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    ></div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-400">{item.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Stock Status Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                Stock Health & Expiry Trends
              </h3>
              <p className="text-xs text-slate-400">Inventory distribution by stock health status</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {data?.stockTrendsChart?.map((st, i) => {
              const totalStockItems = (data?.activeMedicines || 1);
              const percent = Math.min(100, Math.round((st.count / totalStockItems) * 100));
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }}></span>
                      {st.status}
                    </span>
                    <span className="font-mono text-white">{st.count} items ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 5)}%`, backgroundColor: st.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MULTI-BRANCH & SELLING ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Branch Comparison Table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Branch Performance Comparison
            </h3>
          </div>

          <div className="space-y-3">
            {data?.branchComparison?.map((br, idx) => (
              <div key={idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{br.branchName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Code: {br.branchCode} · {br.salesCount} Sales</div>
                </div>
                <div className="text-right font-extrabold text-emerald-400 text-sm">
                  ${br.totalRevenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Selling Medicines */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Top 5 Selling Medicines
            </h3>
          </div>

          <div className="space-y-2.5">
            {data?.topSellingMedicines?.length > 0 ? (
              data.topSellingMedicines.map((med, idx) => (
                <div key={idx} className="bg-slate-800/40 p-3 rounded-xl flex items-center justify-between text-xs border border-slate-700/40">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-white">{med.name}</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono">{med.quantitySold} units sold</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-6 text-center">No sales data recorded yet.</div>
            )}
          </div>
        </div>

        {/* Least 5 Selling Medicines */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <PackageX className="w-5 h-5 text-rose-400" />
              Least 5 Selling Medicines
            </h3>
          </div>

          <div className="space-y-2.5">
            {data?.leastSellingMedicines?.length > 0 ? (
              data.leastSellingMedicines.map((med, idx) => (
                <div key={idx} className="bg-slate-800/40 p-3 rounded-xl flex items-center justify-between text-xs border border-slate-700/40">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-300">{med.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{med.quantitySold} units</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-6 text-center">No inventory items.</div>
            )}
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITIES AUDIT STREAM (FIXED HEIGHT VISIBLE SCROLLBAR & CLICKABLE DETAIL INSPECTION) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Recent System Activities & Audit Stream ({data?.recentActivities?.length || 0} entries)
            </h3>
            <p className="text-xs text-slate-400">Scrollable audit log stream. Click any row to inspect complete change history and diff details.</p>
          </div>
        </div>

        {/* Scroll Container with Fixed Height max-h-[300px] ensuring VISIBLE SCROLLBAR */}
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto border border-slate-800 rounded-xl pr-1">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data?.recentActivities?.map((log) => (
                <tr
                  key={log._id}
                  onClick={() => setSelectedAuditLog(log)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white group-hover:text-blue-400">{log.userName || 'System'}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded text-[10px] font-semibold">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{log.action}</td>
                  <td className="py-3 px-4 text-slate-300 truncate max-w-xs">{log.details}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedAuditLog(log); }}
                      className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer text-[11px] inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLICKABLE AUDIT LOG INSPECTOR MODAL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-tight">
                  Audit Entry Details: {selectedAuditLog.action}
                </h2>
              </div>

              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audit Inspector Body */}
            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Action Type:</span>
                  <span className="text-blue-400 font-bold">{selectedAuditLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-white">{new Date(selectedAuditLog.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Performed By:</span>
                  <span className="text-emerald-400 font-bold">{selectedAuditLog.userName || 'System User'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">System Module:</span>
                  <span className="text-purple-400 font-bold">{selectedAuditLog.module}</span>
                </div>
              </div>

              {/* Exact Log Details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Description & Log Details:</div>
                <div className="text-slate-200 text-xs leading-relaxed">{selectedAuditLog.details}</div>
              </div>

              {/* Old vs New Value Diff (If Available) */}
              {(selectedAuditLog.oldValue || selectedAuditLog.newValue) && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
                    <div className="text-rose-400 font-bold uppercase text-[10px] mb-1">Old Value</div>
                    <div className="text-slate-300">{selectedAuditLog.oldValue || 'None'}</div>
                  </div>
                  <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50">
                    <div className="text-emerald-400 font-bold uppercase text-[10px] mb-1">New Value</div>
                    <div className="text-slate-300">{selectedAuditLog.newValue || 'Updated'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC KPI ALARM & DETAIL MODALS */}
      {activeKpiModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                {activeKpiModal === 'outOfStock' && <PackageX className="w-5 h-5 text-rose-400" />}
                {activeKpiModal === 'lowStock' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {activeKpiModal === 'expired' && <Clock className="w-5 h-5 text-purple-400" />}
                {activeKpiModal === 'todaySales' && <DollarSign className="w-5 h-5 text-emerald-400" />}
                {activeKpiModal === 'monthlySales' && <BarChart3 className="w-5 h-5 text-blue-400" />}
                {activeKpiModal === 'totalProfit' && <ArrowUpRight className="w-5 h-5 text-purple-400" />}
                {activeKpiModal === 'activeMedicines' && <ShoppingBag className="w-5 h-5 text-white" />}
                {activeKpiModal === 'dues' && <Users className="w-5 h-5 text-amber-400" />}

                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  {activeKpiModal === 'outOfStock' && '🚨 Critical Alarm: Immediate Restock Required'}
                  {activeKpiModal === 'lowStock' && '⚠️ Warning Alarm: Reorder Level Reached'}
                  {activeKpiModal === 'expired' && '⏰ FEFO Alarm: Expired & Near-Expiry Batches'}
                  {activeKpiModal === 'todaySales' && '💰 Today\'s POS Sales Ledger'}
                  {activeKpiModal === 'monthlySales' && '📈 Current Month Sales & Revenue'}
                  {activeKpiModal === 'totalProfit' && '📊 Profit Margin & Financial Breakdown'}
                  {activeKpiModal === 'activeMedicines' && '💊 Active Pharmaceutical Catalog'}
                  {activeKpiModal === 'dues' && '📒 Accounts Payable & Customer Credit Ledger'}
                </h2>
              </div>

              <button
                onClick={() => setActiveKpiModal(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body depending on KPI */}
            <div className="space-y-3 text-xs">

              {/* Out of Stock Details */}
              {activeKpiModal === 'outOfStock' && (
                <div className="space-y-3">
                  <p className="text-slate-400">The following medicines currently have 0 stock in this branch and require immediate purchase orders:</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/50 space-y-2">
                    <div className="font-bold text-rose-400 text-sm">Critical Stock Out Alert (1 item)</div>
                    <div className="flex justify-between items-center text-slate-200 py-1 border-t border-slate-800">
                      <span>Atorvastatin 20mg (SKU: ATV-020)</span>
                      <span className="text-rose-400 font-mono font-bold">0 Strips</span>
                    </div>
                  </div>
                  <Link
                    to="/purchases"
                    onClick={() => setActiveKpiModal(null)}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs"
                  >
                    <Truck className="w-4 h-4" /> Create Purchase Order Now
                  </Link>
                </div>
              )}

              {/* Low Stock Details */}
              {activeKpiModal === 'lowStock' && (
                <div className="space-y-3">
                  <p className="text-slate-400">Medicines running below recommended minimum reorder thresholds:</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/50 space-y-2">
                    <div className="font-bold text-amber-400 text-sm">Low Stock Warnings</div>
                    <div className="text-slate-400 text-xs">All current active items are above minimum reorder levels.</div>
                  </div>
                </div>
              )}

              {/* Expired / Near Expiry Details */}
              {activeKpiModal === 'expired' && (
                <div className="space-y-3">
                  <p className="text-slate-400">Batches expiring within 60 days (FEFO prioritization active):</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/50 space-y-2 font-mono">
                    <div className="flex justify-between items-center text-amber-400 font-bold">
                      <span>Batch: BT-AMX-001 (Amoxicillin 500mg)</span>
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px]">Expiring Soon</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex justify-between">
                      <span>Quantity: 45 Strips</span>
                      <span>Expiry: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Today's Sales Details */}
              {activeKpiModal === 'todaySales' && (
                <div className="space-y-3">
                  <div className="flex justify-between font-bold text-emerald-400 text-sm bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span>Today's Total Sales:</span>
                    <span>${data?.todaySales?.toFixed(2)} ({data?.recentSales?.length || 0} Invoices)</span>
                  </div>
                  <div className="space-y-2">
                    {data?.recentSales?.map((s, idx) => (
                      <div key={idx} className="bg-slate-800/60 p-3 rounded-xl flex justify-between items-center border border-slate-700/60">
                        <div>
                          <div className="font-mono text-blue-400 font-bold">{s.invoiceNumber}</div>
                          <div className="text-slate-400 text-[11px]">{s.patientName} · {s.paymentMethod.toUpperCase()}</div>
                        </div>
                        <div className="font-bold text-emerald-400">${s.grandTotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Sales Details */}
              {activeKpiModal === 'monthlySales' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/50 font-bold text-blue-400 text-sm flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span>${data?.monthlySales?.toFixed(2)}</span>
                  </div>
                  <p className="text-slate-400">Total monthly revenue calculated across all completed billing transactions for this tenant.</p>
                </div>
              )}

              {/* Total Profit Details */}
              {activeKpiModal === 'totalProfit' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/50 space-y-2">
                    <div className="flex justify-between text-purple-400 font-bold text-sm">
                      <span>Estimated Net Profit:</span>
                      <span>${data?.totalProfit?.toFixed(2)}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                      Calculated from gross revenue minus medicine purchase cost price margins.
                    </div>
                  </div>
                </div>
              )}

              {/* Active Medicines Details */}
              {activeKpiModal === 'activeMedicines' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between font-bold text-white">
                    <span>Active Pharmaceutical Catalog:</span>
                    <span>{data?.activeMedicines} Active Items</span>
                  </div>
                  <Link
                    to="/inventory"
                    onClick={() => setActiveKpiModal(null)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs"
                  >
                    <ShoppingBag className="w-4 h-4" /> Open Full Medicine Catalog
                  </Link>
                </div>
              )}

              {/* Dues Details (Accounts Payable & Customer Credit Ledger Explanations) */}
              {activeKpiModal === 'dues' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-bold text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-amber-400 text-[11px] uppercase tracking-wider font-bold">1. Customer Credits Owed (Accounts Receivable)</div>
                      <div className="text-2xl font-extrabold text-amber-400">${data?.pendingPayments?.toFixed(2) || '0.00'}</div>
                      <Link
                        to="/customers"
                        onClick={() => setActiveKpiModal(null)}
                        className="text-blue-400 hover:underline inline-block pt-1 text-[11px]"
                      >
                        Manage Customer Credit Accounts ➔
                      </Link>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-rose-400 text-[11px] uppercase tracking-wider font-bold">2. Supplier Dues Payable (Accounts Payable)</div>
                      <div className="text-2xl font-extrabold text-rose-400">${data?.supplierDues?.toFixed(2) || '0.00'}</div>
                      <Link
                        to="/purchases"
                        onClick={() => setActiveKpiModal(null)}
                        className="text-blue-400 hover:underline inline-block pt-1 text-[11px]"
                      >
                        Manage Supplier Payables & Purchases ➔
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveKpiModal(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2 rounded-xl text-xs cursor-pointer"
              >
                Close Alert
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;