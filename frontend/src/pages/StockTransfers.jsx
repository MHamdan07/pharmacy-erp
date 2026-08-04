import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ArrowLeftRight, Plus, CheckCircle2, Box } from 'lucide-react';
import { Button, Input, Select, Card, Badge, Modal, DataTable, Skeleton, useToast } from '../components/ui';

const StockTransfers = () => {
  const toast = useToast();
  const { branches, activeBranchId } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Transfer Form State
  const [toBranchId, setToBranchId] = useState('');
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/transfers/transfers');
      setTransfers(res.data || []);
    } catch (err) {
      console.error('Failed to load transfers:', err);
      toast.error('Failed to load stock transfers list.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchMedicines = useCallback(async () => {
    try {
      const res = await API.get('/inventory/medicines');
      const data = res.data || [];
      setMedicines(data);
      if (data.length > 0 && !selectedMedicineId) {
        setSelectedMedicineId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load medicines for transfer:', err);
    }
  }, [selectedMedicineId]);

  useEffect(() => {
    fetchTransfers();
    fetchMedicines();
  }, [activeBranchId, fetchTransfers, fetchMedicines]);

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    if (!toBranchId) {
      toast.warning('Please select a destination branch.');
      return;
    }
    if (!selectedMedicineId) {
      toast.warning('Please select a medicine to transfer.');
      return;
    }

    setSubmitting(true);
    try {
      // Find selected medicine to get batch info if available
      const selMed = medicines.find(m => m._id === selectedMedicineId);
      const effectiveBatch = batchNumber.trim() || (selMed?.batches?.[0]?.batchNumber) || `BT-${Date.now().toString().slice(-6)}`;

      const payload = {
        toBranchId,
        items: [
          {
            medicine: selectedMedicineId, // Dynamic user-selected medicine ObjectId
            batchNumber: effectiveBatch,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            quantity: Number(quantity)
          }
        ],
        notes
      };

      await API.post('/transfers/transfers', payload);
      toast.success('Stock transfer request created successfully!');
      setShowModal(false);
      // Reset form
      setToBranchId('');
      setBatchNumber('');
      setQuantity(10);
      setNotes('');
      fetchTransfers();
    } catch (err) {
      console.error('Transfer request failed:', err);
      toast.error(err.response?.data?.message || 'Transfer request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/transfers/transfers/${id}/status`, { status });
      toast.success(`Transfer status updated to ${status}.`);
      fetchTransfers();
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error(err.response?.data?.message || 'Status update failed.');
    }
  };

  const columns = [
    {
      header: 'Transfer #',
      accessor: 'transferNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-400">{row.transferNumber}</span>
      )
    },
    {
      header: 'Origin Branch',
      render: (row) => (
        <span className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          {row.fromBranch?.name || 'Main HQ'}
        </span>
      )
    },
    {
      header: 'Destination Branch',
      render: (row) => (
        <span className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          {row.toBranch?.name || 'Branch'}
        </span>
      )
    },
    {
      header: 'Items Transferred',
      render: (row) => (
        <div className="space-y-1">
          {row.items?.map((it, i) => (
            <div key={i} className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono text-xs">
              <span className="font-semibold">{it.medicine?.name || it.medicineName || 'Medicine'}</span> — Batch: {it.batchNumber} (x{it.quantity})
            </div>
          ))}
        </div>
      )
    },
    {
      header: 'Requested By',
      render: (row) => (
        <span className="text-slate-400 text-xs">
          {row.requestedBy?.name || 'Staff'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const variantMap = {
          received: 'success',
          pending: 'warning',
          in_transit: 'info',
          rejected: 'danger'
        };
        return (
          <Badge variant={variantMap[row.status] || 'neutral'} size="sm" dot>
            {row.status}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          {row.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={CheckCircle2}
              onClick={() => handleStatusChange(row._id, 'received')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Confirm Receipt
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">

      {/* Top Banner Header */}
      <Card variant="solid" className="p-5 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2 tracking-tight">
              <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
              Inter-Branch Stock Transfers
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              Transfer inventory batches between main headquarters and branch stores with real-time audit tracking
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Request Stock Transfer
          </Button>
        </div>
      </Card>

      {/* Main Stock Transfers Data Table */}
      <Card variant="solid" className="p-5 border-slate-800">
        <DataTable
          columns={columns}
          data={transfers}
          loading={loading}
          searchable
          searchPlaceholder="Search transfer #, branch, medicine, status..."
          emptyMessage="No stock transfer requests recorded."
        />
      </Card>

      {/* Request Stock Transfer Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Inter-Branch Stock Transfer"
        description="Select target branch, medicine item, and batch details to transfer stock."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateTransfer}
              isLoading={submitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Submit Transfer Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTransfer} className="space-y-4">

          {/* Destination Branch Selector */}
          <Select
            label="Destination Branch"
            required
            value={toBranchId}
            onChange={(e) => setToBranchId(e.target.value)}
            options={[
              { value: '', label: '-- Select Target Branch --', disabled: true },
              ...branches.map((b) => ({
                value: b._id,
                label: `${b.name} (${b.code || 'BRANCH'})`
              }))
            ]}
          />

          {/* Medicine Selector (Dynamic ObjectId reference) */}
          <Select
            label="Medicine Item to Transfer"
            required
            value={selectedMedicineId}
            onChange={(e) => {
              const medId = e.target.value;
              setSelectedMedicineId(medId);
              const selMed = medicines.find((m) => m._id === medId);
              if (selMed?.batches?.[0]?.batchNumber) {
                setBatchNumber(selMed.batches[0].batchNumber);
              }
            }}
            options={[
              { value: '', label: '-- Select Medicine --', disabled: true },
              ...medicines.map((m) => ({
                value: m._id,
                label: `${m.name} (SKU: ${m.sku} | Price: $${m.unitPrice?.toFixed(2)})`
              }))
            ]}
          />

          {/* Batch Number & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Batch Number"
              required
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
              placeholder="e.g. BT-AMX-001"
            />
            <Input
              label="Quantity to Transfer"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Notes */}
          <Input
            label="Notes / Reason (Optional)"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Stock balancing for Branch A demand surge"
          />

        </form>
      </Modal>

    </div>
  );
};

export default StockTransfers;

