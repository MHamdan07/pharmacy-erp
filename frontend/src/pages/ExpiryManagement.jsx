import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  Clock, ShieldAlert, Mail, MessageSquare, Lock, AlertTriangle,
  CheckCircle, Calendar, Pill, RefreshCw, Layers
} from 'lucide-react';

const ExpiryManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeThreshold, setActiveThreshold] = useState('expired');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchExpiryData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/expiry/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load expiry management data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpiryData();
  }, [fetchExpiryData]);

  const handleTriggerAlert = async (alertType) => {
    try {
      setActionLoading(true);
      const res = await API.post('/expiry/trigger-alert', { alertType });
      alert(res.data.message);
      fetchExpiryData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to trigger alert');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4"></div>
        <span className="font-semibold text-sm">Loading Expiry Monitoring System...</span>
      </div>
    );
  }

  const thresholdCounts = data?.counts || {};
  const currentList =
    activeThreshold === 'expired' ? data?.expired || [] :
    activeThreshold === 'today' ? data?.expiringToday || [] :
    activeThreshold === '7days' ? data?.days7 || [] :
    activeThreshold === '30days' ? data?.days30 || [] :
    activeThreshold === '60days' ? data?.days60 || [] :
    data?.days90 || [];

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Automated FEFO Expiry Management & POS Lock
          </h1>
          <p className="text-xs text-slate-400">Automated monitoring for 7, 30, 60, and 90-day expiry windows with POS hard-lock protection</p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerAlert('email')}
            disabled={actionLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Mail className="w-4 h-4" /> Email Alerts
          </button>
          <button
            onClick={() => handleTriggerAlert('sms')}
            disabled={actionLoading}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> SMS Alerts
          </button>
          <button
            onClick={() => handleTriggerAlert('lock')}
            disabled={actionLoading}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Lock className="w-4 h-4" /> Lock Expired POS Sales
          </button>
        </div>
      </div>

      {/* Threshold Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        <button
          onClick={() => setActiveThreshold('expired')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === 'expired'
              ? 'bg-rose-950/40 border-rose-500 text-rose-400 ring-2 ring-rose-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">Expired</div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{thresholdCounts.expired || 0}</div>
          <div className="text-[10px] mt-1">Passed Expiry</div>
        </button>

        <button
          onClick={() => setActiveThreshold('today')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === 'today'
              ? 'bg-amber-950/40 border-amber-500 text-amber-400 ring-2 ring-amber-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">Today</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{thresholdCounts.expiringToday || 0}</div>
          <div className="text-[10px] mt-1">Expiring Today</div>
        </button>

        <button
          onClick={() => setActiveThreshold('7days')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === '7days'
              ? 'bg-purple-950/40 border-purple-500 text-purple-400 ring-2 ring-purple-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">7 Days Left</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{thresholdCounts.days7 || 0}</div>
          <div className="text-[10px] mt-1">Critical Window</div>
        </button>

        <button
          onClick={() => setActiveThreshold('30days')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === '30days'
              ? 'bg-blue-950/40 border-blue-500 text-blue-400 ring-2 ring-blue-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">30 Days Left</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">{thresholdCounts.days30 || 0}</div>
          <div className="text-[10px] mt-1">Near Expiry Alert</div>
        </button>

        <button
          onClick={() => setActiveThreshold('60days')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === '60days'
              ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">60 Days Left</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{thresholdCounts.days60 || 0}</div>
          <div className="text-[10px] mt-1">FEFO Priority</div>
        </button>

        <button
          onClick={() => setActiveThreshold('90days')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeThreshold === '90days'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold uppercase">90 Days Left</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{thresholdCounts.days90 || 0}</div>
          <div className="text-[10px] mt-1">Advance Notice</div>
        </button>

      </div>

      {/* Threshold Batches Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-purple-400" />
            Active Batch Inventory ({activeThreshold.toUpperCase()}: {currentList.length} items)
          </h2>
        </div>

        {currentList.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs italic">
            No batches found in the "{activeThreshold}" expiry window.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Medicine & SKU</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4">Rack Location</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currentList.map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{batch.batchNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{batch.medicine?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {batch.medicine?.sku}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-400">
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{batch.quantity}</td>
                    <td className="py-3 px-4 text-slate-400">{batch.rackNumber || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-300">{batch.supplier?.company || batch.supplier?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        batch.status === 'expired' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default ExpiryManagement;
