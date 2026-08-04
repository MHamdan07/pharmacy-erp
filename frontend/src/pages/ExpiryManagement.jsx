import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  Clock, ShieldAlert, Mail, MessageSquare, Lock, AlertTriangle,
  CheckCircle, Calendar, Pill, RefreshCw, Layers
} from 'lucide-react';
import { Button, Badge, StatusDot, Card, Modal, DataTable, Skeleton, useToast } from '../components/ui';

const ExpiryManagement = () => {
  const toast = useToast();
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
      toast.error('Failed to load expiry analytics data.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExpiryData();
  }, [fetchExpiryData]);

  const handleTriggerAlert = async (alertType) => {
    try {
      setActionLoading(true);
      const res = await API.post('/expiry/trigger-alert', { alertType });
      toast.success(res.data.message || 'Alert triggered successfully');
      fetchExpiryData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to trigger alert');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Card key={i} className="h-28" />
          ))}
        </div>
        <Skeleton.Table rows={6} columns={7} />
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

  const columns = [
    {
      header: 'Batch Number',
      key: 'batchNumber',
      render: (batch) => <span className="font-mono font-bold text-amber-400">{batch.batchNumber}</span>
    },
    {
      header: 'Medicine & SKU',
      key: 'medicine',
      render: (batch) => (
        <div>
          <div className="font-semibold text-white">{batch.medicine?.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">SKU: {batch.medicine?.sku}</div>
        </div>
      )
    },
    {
      header: 'Expiry Date',
      key: 'expiryDate',
      render: (batch) => (
        <span className="font-mono font-bold text-rose-400">
          {new Date(batch.expiryDate).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Stock Quantity',
      key: 'quantity',
      render: (batch) => <span className="font-bold text-white font-mono">{batch.quantity}</span>
    },
    {
      header: 'Rack Location',
      key: 'rackNumber',
      render: (batch) => <span className="text-slate-400">{batch.rackNumber || 'N/A'}</span>
    },
    {
      header: 'Supplier',
      key: 'supplier',
      render: (batch) => <span className="text-slate-300">{batch.supplier?.company || batch.supplier?.name || 'N/A'}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (batch) => (
        <Badge
          variant={batch.status === 'expired' ? 'danger' : 'warning'}
          size="sm"
          dot
          pulse={batch.status === 'expired'}
        >
          {batch.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <Card variant="glass" className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            Automated FEFO Expiry Management & POS Lock
          </h1>
          <p className="text-xs text-slate-400 mt-1">Automated monitoring for 7, 30, 60, and 90-day expiry windows with POS hard-lock protection</p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={Mail}
            isLoading={actionLoading}
            onClick={() => handleTriggerAlert('email')}
          >
            Email Alerts
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={MessageSquare}
            isLoading={actionLoading}
            onClick={() => handleTriggerAlert('sms')}
            className="bg-amber-600 hover:bg-amber-500"
          >
            SMS Alerts
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={Lock}
            isLoading={actionLoading}
            onClick={() => handleTriggerAlert('lock')}
          >
            Lock Expired POS Sales
          </Button>
        </div>
      </Card>

      {/* Threshold Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Expired */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('expired')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === 'expired'
              ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-rose-400">Expired</span>
            <StatusDot variant="danger" pulse size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{thresholdCounts.expired || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Passed Expiry</div>
        </Card>

        {/* Today */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('today')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === 'today'
              ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-amber-400">Today</span>
            <StatusDot variant="warning" pulse size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{thresholdCounts.expiringToday || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Expiring Today</div>
        </Card>

        {/* 7 Days Left */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('7days')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === '7days'
              ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-purple-400">7 Days Left</span>
            <StatusDot variant="purple" size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{thresholdCounts.days7 || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Critical Window</div>
        </Card>

        {/* 30 Days Left */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('30days')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === '30days'
              ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-blue-400">30 Days Left</span>
            <StatusDot variant="info" size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">{thresholdCounts.days30 || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Near Expiry Alert</div>
        </Card>

        {/* 60 Days Left */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('60days')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === '60days'
              ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-indigo-400">60 Days Left</span>
            <StatusDot variant="neutral" size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{thresholdCounts.days60 || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">FEFO Priority</div>
        </Card>

        {/* 90 Days Left */}
        <Card
          variant="glass"
          hoverGlow
          onClick={() => setActiveThreshold('90days')}
          className={`p-4 cursor-pointer transition-all ${
            activeThreshold === '90days'
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-emerald-400">90 Days Left</span>
            <StatusDot variant="success" size="sm" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{thresholdCounts.days90 || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1 font-medium">Advance Notice</div>
        </Card>

      </div>

      {/* Threshold Batches Table */}
      <DataTable
        columns={columns}
        data={currentList}
        loading={loading}
        searchable
        searchPlaceholder="Filter batch number, medicine, supplier..."
        pagination
        pageSize={10}
        emptyMessage={`No batches found in the "${activeThreshold}" expiry window.`}
      />

    </div>
  );
};

export default ExpiryManagement;
