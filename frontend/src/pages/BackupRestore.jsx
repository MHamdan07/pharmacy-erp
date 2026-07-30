import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  Database, Download, RefreshCw, CheckCircle, ShieldAlert,
  HardDrive, Cloud, Clock, RotateCcw, FileJson, Sparkles
} from 'lucide-react';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Backup Creation Form
  const [schedule, setSchedule] = useState('manual');
  const [target, setTarget] = useState('local');

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await API.get('/backups');
      setBackups(res.data || []);
    } catch (err) {
      console.error('Failed to load backup snapshots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setActionLoading(true);
      const res = await API.post('/backups/create', { schedule, target });
      alert(`Backup snapshot "${res.data.backupName}" created successfully.`);
      fetchBackups();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create database backup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyBackup = async (backupId) => {
    try {
      setActionLoading(true);
      const res = await API.post(`/backups/${backupId}/verify`);
      alert(res.data.message);
      fetchBackups();
    } catch (err) {
      alert(err.response?.data?.message || 'Backup verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreBackup = async (backup) => {
    if (!window.confirm(`⚠️ CAUTION: Are you sure you want to restore database snapshot "${backup.backupName}"? Current state will be rolled back.`)) return;

    try {
      setActionLoading(true);
      const res = await API.post(`/backups/${backup._id}/restore`);
      alert(res.data.message);
      fetchBackups();
    } catch (err) {
      alert(err.response?.data?.message || 'Backup restoration failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Automated Database Backup & Snapshot Restore Engine
          </h1>
          <p className="text-xs text-slate-400">Daily, weekly, and monthly automated backup schedules to local disk or cloud storage with 1-click verification</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="manual">Manual Snapshot</option>
            <option value="daily">Daily Cron Schedule</option>
            <option value="weekly">Weekly Cron Schedule</option>
            <option value="monthly">Monthly Cron Schedule</option>
          </select>

          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="local">Local Storage</option>
            <option value="cloud">Cloud Storage (S3)</option>
          </select>

          <button
            onClick={handleCreateBackup}
            disabled={actionLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Database className="w-4 h-4" /> Create Backup Now
          </button>
        </div>
      </div>

      {/* Backup Schedule Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Daily Schedule</div>
            <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Active (2:00 AM)
            </div>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Weekly / Monthly</div>
            <div className="text-lg font-bold text-blue-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Active (Sundays)
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Cloud className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Backups Stored</div>
            <div className="text-lg font-bold text-white mt-1">{backups.length} Snapshots</div>
          </div>
          <div className="w-10 h-10 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Backups List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileJson className="w-4 h-4 text-indigo-400" />
            Historical Database Backup Snapshots ({backups.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading backup snapshots...</div>
        ) : backups.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs italic">
            No backup snapshots found. Click "Create Backup Now" to create your first database backup.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4">Backup Name</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Target Storage</th>
                  <th className="py-3 px-4">Size & Records</th>
                  <th className="py-3 px-4">Integrity Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {backups.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{b.backupName}</td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-300">{b.schedule}</td>
                    <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-1.5">
                      {b.target === 'cloud' ? <Cloud className="w-3.5 h-3.5 text-blue-400" /> : <HardDrive className="w-3.5 h-3.5 text-emerald-400" />}
                      {b.target.toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>{(b.sizeBytes / 1024).toFixed(1)} KB</div>
                      <div className="text-[10px] text-slate-400">{b.recordCount} docs</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        b.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'restored'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleVerifyBackup(b._id)}
                          className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer text-[11px]"
                          title="Verify Integrity"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(b)}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                      </div>
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

export default BackupRestore;
