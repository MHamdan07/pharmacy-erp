import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  Database, Download, RefreshCw, CheckCircle, ShieldAlert,
  HardDrive, Cloud, Clock, RotateCcw, FileJson, Sparkles
} from 'lucide-react';
import { Card, Button, Modal, Skeleton, Badge, Select, useToast } from '../components/ui';

const BackupRestore = () => {
  const toast = useToast();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Backup Creation Form
  const [schedule, setSchedule] = useState('manual');
  const [target, setTarget] = useState('local');

  const fetchBackups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/backups');
      setBackups(res.data || []);
    } catch (err) {
      console.error('Failed to load backup snapshots:', err);
      toast.error('Failed to load backup snapshots');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    try {
      setActionLoading(true);
      const res = await API.post('/backups/create', { schedule, target });
      toast.success(`Backup snapshot "${res.data.backupName}" created successfully.`);
      fetchBackups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create database backup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyBackup = async (backupId) => {
    try {
      setActionLoading(true);
      const res = await API.post(`/backups/${backupId}/verify`);
      toast.success(res.data.message || 'Backup snapshot verified successfully.');
      fetchBackups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Backup verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreBackup = async (backup) => {
    const confirmed = await toast.confirm({
      title: 'Restore Database Snapshot?',
      message: `⚠️ CAUTION: Are you sure you want to restore database snapshot "${backup.backupName}"? Current state will be rolled back.`,
      confirmText: 'Restore Snapshot',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      setActionLoading(true);
      const res = await API.post(`/backups/${backup._id}/restore`);
      toast.success(res.data.message || 'Backup restored successfully.');
      fetchBackups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Backup restoration failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">

      {/* Top Banner */}
      <Card variant="glass" className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Automated Database Backup & Snapshot Restore Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daily, weekly, and monthly automated backup schedules to local disk or cloud storage with 1-click verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="text-xs max-w-[170px]"
            options={[
              { value: 'manual', label: 'Manual Snapshot' },
              { value: 'daily', label: 'Daily Cron Schedule' },
              { value: 'weekly', label: 'Weekly Cron Schedule' },
              { value: 'monthly', label: 'Monthly Cron Schedule' },
            ]}
          />

          <Select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="text-xs max-w-[150px]"
            options={[
              { value: 'local', label: 'Local Storage' },
              { value: 'cloud', label: 'Cloud Storage (S3)' },
            ]}
          />

          <Button
            variant="primary"
            size="md"
            leftIcon={Database}
            loading={actionLoading}
            onClick={handleCreateBackup}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
          >
            Create Backup Now
          </Button>
        </div>
      </Card>

      {/* Backup Schedule Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Daily Schedule</div>
            <div className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Active (2:00 AM)
            </div>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Weekly / Monthly</div>
            <div className="text-lg font-bold text-blue-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Active (Sundays)
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Cloud className="w-5 h-5" />
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Backups Stored</div>
            <div className="text-lg font-bold text-white mt-1">{backups.length} Snapshots</div>
          </div>
          <div className="w-10 h-10 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700">
            <HardDrive className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Backups List Table */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileJson className="w-4 h-4 text-indigo-400" />
            Historical Database Backup Snapshots ({backups.length})
          </h2>
        </div>

        {loading ? (
          <Skeleton.Table rows={4} columns={6} />
        ) : backups.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs italic">
            No backup snapshots found. Click "Create Backup Now" to create your first database backup.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
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
                      <Badge
                        variant={b.status === 'verified' ? 'success' : b.status === 'restored' ? 'info' : 'danger'}
                        size="sm"
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={actionLoading}
                          onClick={() => handleVerifyBackup(b._id)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          Verify
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={RotateCcw}
                          disabled={actionLoading}
                          onClick={() => handleRestoreBackup(b)}
                        >
                          Restore
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};

export default BackupRestore;
