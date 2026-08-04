import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import {
  Truck, Plus, Search, Calendar, DollarSign, FileText, CheckCircle2,
  AlertCircle, Star, Building2, UserCheck, ShieldAlert, FileCheck, ArrowRight,
  Clock, CreditCard, ChevronRight, X, Upload, ExternalLink, RefreshCw
} from 'lucide-react';
import { Button, Input, Select, Card, Badge, Modal, DataTable, Skeleton, useToast } from '../components/ui';

const PurchasesSuppliers = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [receivingPo, setReceivingPo] = useState(null);
  const [paymentSupplier, setPaymentSupplier] = useState(null);
  const [selectedSupplierHistory, setSelectedSupplierHistory] = useState(null);

  // New Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    company: '',
    taxId: '',
    phone: '',
    email: '',
    address: '',
    rating: 5
  });

  // Receive GRN Items Form State
  const [receiveItemsState, setReceiveItemsState] = useState([]);

  // Make Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'bank_transfer',
    notes: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'purchases') {
        const res = await API.get('/purchases');
        setPurchases(res.data || []);
      }
      const supRes = await API.get('/inventory/suppliers');
      setSuppliers(supRes.data || []);
    } catch (err) {
      console.error('Failed to load purchases/suppliers data:', err);
      toast.error('Failed to load purchase orders or supplier profiles.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, toast]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inventory/suppliers', supplierForm);
      toast.success(`Supplier profile '${supplierForm.company}' created successfully!`);
      setShowAddSupplierModal(false);
      setSupplierForm({ name: '', company: '', taxId: '', phone: '', email: '', address: '', rating: 5 });
      fetchData();
    } catch (err) {
      console.error('Failed to add supplier:', err);
      toast.error(err.response?.data?.message || 'Failed to add supplier profile.');
    }
  };

  const openReceiveModal = (po) => {
    setReceivingPo(po);
    setReceiveItemsState(
      po.items.map((item, idx) => ({
        itemIndex: idx,
        medicineId: item.medicine?._id || item.medicine,
        medicineName: item.medicineName,
        orderedQty: item.orderedQuantity,
        previouslyReceived: item.receivedQuantity || 0,
        receivedQty: item.orderedQuantity - (item.receivedQuantity || 0),
        batchNumber: item.batchNumber || `BT-${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().slice(0, 10) : '',
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        rackNumber: item.rackNumber || 'Rack A-1'
      }))
    );
  };

  const handleConfirmReceiveStock = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/purchases/orders/${receivingPo._id}/receive`, {
        receivedItems: receiveItemsState
      });
      toast.success(res.data.message || 'Goods Received Note (GRN) confirmed successfully!');
      setReceivingPo(null);
      fetchData();
    } catch (err) {
      console.error('Failed to receive stock:', err);
      toast.error(err.response?.data?.message || 'Failed to receive stock.');
    }
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/purchases/supplier-payments', {
        supplierId: paymentSupplier._id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes
      });
      toast.success(`Payment of $${paymentForm.amount} recorded successfully.`);
      setPaymentSupplier(null);
      fetchData();
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error(err.response?.data?.message || 'Failed to record payment.');
    }
  };

  const fetchSupplierHistoryDetails = async (supplierId) => {
    try {
      const res = await API.get(`/purchases/suppliers/${supplierId}/history`);
      setSelectedSupplierHistory(res.data);
    } catch (err) {
      console.error('Failed to load supplier history:', err);
      toast.error('Failed to load supplier ledger history.');
    }
  };

  // Filtered Purchases & Suppliers
  const filteredPurchases = purchases.filter((po) =>
    po.purchaseOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplierInvoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter((sup) =>
    sup.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sup.phone?.includes(searchTerm) ||
    sup.taxId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const purchaseColumns = [
    {
      header: 'PO Number & Invoice',
      render: (po) => (
        <div>
          <div className="font-mono font-bold text-blue-400 text-sm">{po.purchaseOrderNumber}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            Inv #: {po.supplierInvoiceNumber || 'N/A'} · {new Date(po.createdAt).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      header: 'Supplier',
      render: (po) => (
        <span className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          {po.supplier?.company || po.supplier?.name}
        </span>
      )
    },
    {
      header: 'Ordered / Received Items',
      render: (po) => (
        <div>
          <div className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            {po.items?.length || 0} line items
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-xs">
            {po.items?.map(i => `${i.medicineName} (${i.receivedQuantity || 0}/${i.orderedQuantity})`).join(', ')}
          </div>
        </div>
      )
    },
    {
      header: 'Grand Total',
      render: (po) => (
        <span className="font-bold text-emerald-400 font-mono text-sm">
          ${po.grandTotal?.toFixed(2)}
        </span>
      )
    },
    {
      header: 'Paid / Balance Due',
      render: (po) => (
        <div className="font-mono text-xs">
          <div className="text-emerald-400 font-semibold">Paid: ${po.paidAmount?.toFixed(2)}</div>
          <div className="text-rose-400 text-[10px]">Due: ${po.balanceDue?.toFixed(2)}</div>
        </div>
      )
    },
    {
      header: 'GRN Status',
      render: (po) => {
        const variantMap = {
          received: 'success',
          partially_received: 'warning',
          pending: 'info'
        };
        const labelMap = {
          received: 'Received',
          partially_received: 'Partial GRN',
          pending: 'Pending'
        };
        return (
          <Badge variant={variantMap[po.status] || 'neutral'} size="sm" dot>
            {labelMap[po.status] || po.status}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (po) => (
        <div className="flex justify-end">
          {po.status !== 'received' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={FileCheck}
              onClick={() => openReceiveModal(po)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Receive Stock
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
              <Truck className="w-6 h-6 text-blue-400" />
              Supplier & Purchase Order Management (GRN)
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              Automated GRN stock reception, partial deliveries, tax calculations, and supplier ledgers
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Single fixed Add Supplier Profile button (Duplicate removed) */}
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => setShowAddSupplierModal(true)}
            >
              Add Supplier Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-3">
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'purchases' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={FileText}
            onClick={() => setActiveTab('purchases')}
          >
            Purchase Orders & GRNs ({purchases.length})
          </Button>
          <Button
            variant={activeTab === 'suppliers' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={Building2}
            onClick={() => setActiveTab('suppliers')}
            className={activeTab === 'suppliers' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : ''}
          >
            Supplier Profiles ({suppliers.length})
          </Button>
        </div>

        <div className="w-full md:w-72">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'purchases' ? 'Search PO #, Supplier, Invoice...' : 'Search Supplier Name, NTN, Phone...'}
            leftIcon={Search}
            size="sm"
          />
        </div>
      </div>

      {/* TAB 1: PURCHASE ORDERS & GRNs */}
      {activeTab === 'purchases' && (
        <Card variant="solid" className="p-5 border-slate-800">
          <DataTable
            columns={purchaseColumns}
            data={filteredPurchases}
            loading={loading}
            searchable={false}
            emptyMessage="No purchase orders found."
          />
        </Card>
      )}

      {/* TAB 2: SUPPLIER PROFILES & LEDGER */}
      {activeTab === 'suppliers' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-60 rounded-2xl" />
              <Skeleton className="h-60 rounded-2xl" />
              <Skeleton className="h-60 rounded-2xl" />
            </div>
          ) : filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((sup) => (
                <Card key={sup._id} variant="solid" hoverGlow className="p-5 space-y-4 flex flex-col justify-between border-slate-800">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                          {sup.company}
                        </h3>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" /> {sup.name}
                        </div>
                      </div>
                      <Badge variant="warning" size="sm" icon={Star}>
                        {sup.rating || 5}.0 Stars
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-400">NTN / GST / Tax ID:</span>
                        <span className="font-mono font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                          {sup.taxId || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="text-slate-200 dark:text-slate-200 light:text-slate-800">{sup.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-blue-400 font-mono">{sup.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Outstanding Balance</div>
                        <div className="text-lg font-extrabold text-red-400 font-mono">${sup.balancePayable?.toFixed(2) || '0.00'}</div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={DollarSign}
                        onClick={() => {
                          setPaymentSupplier(sup);
                          setPaymentForm({ amount: sup.balancePayable || 0, paymentMethod: 'bank_transfer', notes: '' });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Make Payment
                      </Button>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => fetchSupplierHistoryDetails(sup._id)}
                    >
                      View Purchase & Payment Ledger ➔
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="solid" className="p-12 text-center text-slate-400 text-xs italic">
              No supplier profiles match search terms.
            </Card>
          )}
        </div>
      )}

      {/* CREATE SUPPLIER MODAL */}
      <Modal
        isOpen={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
        title="Add Supplier Profile"
        description="Register a new pharmaceutical supplier or vendor profile with Tax ID and rating."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowAddSupplierModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateSupplier}>
              Save Supplier Profile
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSupplier} className="space-y-3">
          <Input
            label="Company Name"
            required
            value={supplierForm.company}
            onChange={(e) => setSupplierForm({ ...supplierForm, company: e.target.value })}
            placeholder="PharmaCorp Global Ltd"
          />

          <Input
            label="Contact Person Name"
            required
            value={supplierForm.name}
            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
            placeholder="Alex Rivera"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="NTN / GST / Tax ID"
              value={supplierForm.taxId}
              onChange={(e) => setSupplierForm({ ...supplierForm, taxId: e.target.value })}
              placeholder="NTN-892019"
            />
            <Select
              label="Rating (1-5 Stars)"
              value={supplierForm.rating}
              onChange={(e) => setSupplierForm({ ...supplierForm, rating: Number(e.target.value) })}
              options={[
                { value: 5, label: '5 Stars (Excellent)' },
                { value: 4, label: '4 Stars (Good)' },
                { value: 3, label: '3 Stars (Average)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              required
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              placeholder="+1 800 123 4567"
            />
            <Input
              label="Email Address"
              type="email"
              value={supplierForm.email}
              onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
              placeholder="orders@supplier.com"
            />
          </div>

          <Input
            label="Office / Warehouse Address"
            value={supplierForm.address}
            onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
            placeholder="900 Industrial Ave"
          />
        </form>
      </Modal>

      {/* RECEIVE STOCK (GRN) MODAL */}
      <Modal
        isOpen={Boolean(receivingPo)}
        onClose={() => setReceivingPo(null)}
        title={`Receive Goods Received Note (GRN): ${receivingPo?.purchaseOrderNumber || ''}`}
        description="Receiving stock automatically increases batch quantities and updates supplier balance due."
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setReceivingPo(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmReceiveStock}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Confirm GRN & Increase Stock Inventory
            </Button>
          </>
        }
      >
        <form onSubmit={handleConfirmReceiveStock} className="space-y-4 text-xs">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-400">
              Items Received List (Supports Partial Delivery)
            </label>
            {receiveItemsState.map((item, idx) => (
              <div key={idx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-2">
                <div className="flex justify-between font-bold text-slate-100 text-sm">
                  <span>{item.medicineName}</span>
                  <span className="text-blue-400 font-mono">Ordered: {item.orderedQty} units</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input
                    label="Received Qty Now"
                    type="number"
                    required
                    min="0"
                    max={item.orderedQty - item.previouslyReceived}
                    value={item.receivedQty}
                    onChange={(e) => {
                      const updated = [...receiveItemsState];
                      updated[idx].receivedQty = Number(e.target.value);
                      setReceiveItemsState(updated);
                    }}
                  />
                  <Input
                    label="Batch Number"
                    type="text"
                    required
                    value={item.batchNumber}
                    onChange={(e) => {
                      const updated = [...receiveItemsState];
                      updated[idx].batchNumber = e.target.value.toUpperCase();
                      setReceiveItemsState(updated);
                    }}
                  />
                  <Input
                    label="Expiry Date (FEFO)"
                    type="date"
                    required
                    value={item.expiryDate}
                    onChange={(e) => {
                      const updated = [...receiveItemsState];
                      updated[idx].expiryDate = e.target.value;
                      setReceiveItemsState(updated);
                    }}
                  />
                  <Input
                    label="Rack Location"
                    type="text"
                    value={item.rackNumber}
                    onChange={(e) => {
                      const updated = [...receiveItemsState];
                      updated[idx].rackNumber = e.target.value;
                      setReceiveItemsState(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      </Modal>

      {/* MAKE SUPPLIER PAYMENT MODAL */}
      <Modal
        isOpen={Boolean(paymentSupplier)}
        onClose={() => setPaymentSupplier(null)}
        title={`Record Payment to ${paymentSupplier?.company || ''}`}
        description="Enter payment amount and payment method to update supplier ledger balance."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setPaymentSupplier(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMakePayment}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Submit Payment
            </Button>
          </>
        }
      >
        <form onSubmit={handleMakePayment} className="space-y-3">
          <Input
            label="Payment Amount ($)"
            type="number"
            step="0.01"
            required
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
          />

          <Select
            label="Payment Method"
            value={paymentForm.paymentMethod}
            onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
            options={[
              { value: 'bank_transfer', label: 'Bank Wire Transfer' },
              { value: 'cash', label: 'Cash' },
              { value: 'cheque', label: 'Company Cheque' },
              { value: 'card', label: 'Corporate Credit Card' }
            ]}
          />

          <Input
            label="Reference Notes"
            type="text"
            value={paymentForm.notes}
            onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
            placeholder="Check # or Transfer Reference"
          />
        </form>
      </Modal>

      {/* SUPPLIER HISTORY LEDGER MODAL */}
      <Modal
        isOpen={Boolean(selectedSupplierHistory)}
        onClose={() => setSelectedSupplierHistory(null)}
        title={`Supplier Ledger: ${selectedSupplierHistory?.supplier?.company || ''}`}
        description={`Contact: ${selectedSupplierHistory?.supplier?.name || ''} · Tax ID: ${selectedSupplierHistory?.supplier?.taxId || 'N/A'}`}
        size="lg"
      >
        <div className="space-y-4 text-xs">
          {/* Purchase History */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-blue-400">
              Purchase Orders & GRN History
            </div>
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">PO #</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Grand Total</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedSupplierHistory?.purchaseHistory?.length > 0 ? (
                    selectedSupplierHistory.purchaseHistory.map((p) => (
                      <tr key={p._id}>
                        <td className="p-2.5 font-mono text-blue-400">{p.purchaseOrderNumber}</td>
                        <td className="p-2.5 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="p-2.5 font-bold text-emerald-400 font-mono">${p.grandTotal?.toFixed(2)}</td>
                        <td className="p-2.5">
                          <Badge variant={p.status === 'received' ? 'success' : 'warning'} size="sm">
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-slate-500 italic">No purchase orders recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Payment Disbursements History
            </div>
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Receipt #</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Method</th>
                    <th className="p-2.5">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedSupplierHistory?.paymentHistory?.length > 0 ? (
                    selectedSupplierHistory.paymentHistory.map((pay) => (
                      <tr key={pay._id}>
                        <td className="p-2.5 font-mono text-amber-400">{pay.paymentReceiptNumber}</td>
                        <td className="p-2.5 text-slate-400">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                        <td className="p-2.5 text-slate-300 uppercase">{pay.paymentMethod}</td>
                        <td className="p-2.5 font-bold text-emerald-400 font-mono">${pay.amount?.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-slate-500 italic">No payments recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default PurchasesSuppliers;

