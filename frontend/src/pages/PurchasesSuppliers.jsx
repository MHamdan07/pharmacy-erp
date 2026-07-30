import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  Truck, Plus, Search, Calendar, DollarSign, FileText, CheckCircle2,
  AlertCircle, Star, Building2, UserCheck, ShieldAlert, FileCheck, ArrowRight,
  Clock, CreditCard, ChevronRight, X, Upload, ExternalLink, RefreshCw
} from 'lucide-react';

const PurchasesSuppliers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showCreatePoModal, setShowCreatePoModal] = useState(false);
  const [receivingPo, setReceivingPo] = useState(null);
  const [paymentSupplier, setPaymentSupplier] = useState(null);
  const [selectedSupplierHistory, setSelectedSupplierHistory] = useState(null);

  // New Supplier Form State (With NTN/GST, Rating, etc.)
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    company: '',
    taxId: '',
    phone: '',
    email: '',
    address: '',
    rating: 5
  });

  // New Purchase Order Form State
  const [poForm, setPoForm] = useState({
    supplierId: '',
    supplierInvoiceNumber: '',
    invoiceDocumentUrl: '',
    notes: '',
    paidAmount: 0,
    items: [
      {
        medicineId: '',
        medicineName: '',
        orderedQuantity: 100,
        batchNumber: `BT-${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString().slice(0, 10),
        costPrice: 5.00,
        sellingPrice: 10.00,
        taxRate: 5,
        rackNumber: 'Rack A-1'
      }
    ]
  });

  // Receive GRN Items Form State (Supports Partial Delivery!)
  const [receiveItemsState, setReceiveItemsState] = useState([]);

  // Make Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'bank_transfer',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'purchases') {
        const res = await API.get('/purchases');
        setPurchases(res.data || []);
      }
      const supRes = await API.get('/inventory/suppliers');
      setSuppliers(supRes.data || []);

      const medRes = await API.get('/inventory/medicines');
      setMedicines(medRes.data || []);
    } catch (err) {
      console.error('Failed to load purchases/suppliers data:', err);
    }
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inventory/suppliers', supplierForm);
      setShowAddSupplierModal(false);
      setSupplierForm({ name: '', company: '', taxId: '', phone: '', email: '', address: '', rating: 5 });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add supplier');
    }
  };

  const handleCreatePo = async (e) => {
    e.preventDefault();
    try {
      // Calculate totals
      let subtotal = 0;
      let taxAmount = 0;
      poForm.items.forEach(item => {
        const lineTotal = item.costPrice * item.orderedQuantity;
        subtotal += lineTotal;
        taxAmount += lineTotal * (item.taxRate / 100);
      });
      const grandTotal = subtotal + taxAmount;

      await API.post('/purchases/orders', {
        ...poForm,
        subtotal,
        taxAmount,
        grandTotal
      });

      setShowCreatePoModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create purchase order');
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
        receivedQty: item.orderedQuantity - (item.receivedQuantity || 0), // Default to remaining
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
      alert(res.data.message);
      setReceivingPo(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to receive stock');
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
      alert(`Payment of $${paymentForm.amount} recorded successfully.`);
      setPaymentSupplier(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const fetchSupplierHistoryDetails = async (supplierId) => {
    try {
      const res = await API.get(`/purchases/suppliers/${supplierId}/history`);
      setSelectedSupplierHistory(res.data);
    } catch (err) {
      console.error('Failed to load supplier history:', err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            Supplier & Purchase Order Management (GRN)
          </h1>
          <p className="text-xs text-slate-400">Automated GRN stock reception, partial deliveries, tax calculations, and supplier ledgers</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddSupplierModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Supplier Profile
          </button>
          <button
            onClick={() => setShowCreatePoModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Purchase Order
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'purchases' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Purchase Orders & GRNs ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'suppliers' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Supplier Profiles ({suppliers.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PO #, Supplier, Invoice #..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: PURCHASE ORDERS & GRNs */}
      {activeTab === 'purchases' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4">PO Number & Invoice</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Ordered / Received Items</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Paid / Balance Due</th>
                  <th className="py-3 px-4">GRN Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {purchases.map((po) => (
                  <tr key={po._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-400 text-sm">{po.purchaseOrderNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Inv #: {po.supplierInvoiceNumber || 'N/A'} · {new Date(po.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-white">
                      {po.supplier?.company || po.supplier?.name}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{po.items?.length || 0} line items</div>
                      <div className="text-[10px] text-slate-400">
                        {po.items?.map(i => `${i.medicineName} (${i.receivedQuantity || 0}/${i.orderedQuantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                      ${po.grandTotal?.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="text-emerald-400 font-semibold">Paid: ${po.paidAmount?.toFixed(2)}</div>
                      <div className="text-rose-400 text-[10px]">Due: ${po.balanceDue?.toFixed(2)}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        po.status === 'received'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : po.status === 'partially_received'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {po.status === 'partially_received' ? 'Partial GRN' : po.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {po.status !== 'received' && (
                        <button
                          onClick={() => openReceiveModal(po)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Receive Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUPPLIER PROFILES & LEDGER */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3 relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{sup.company}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" /> {sup.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {sup.rating || 5}.0
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NTN / GST / Tax ID:</span>
                    <span className="font-mono text-white">{sup.taxId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-white">{sup.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-blue-400">{sup.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Outstanding Balance</div>
                    <div className="text-lg font-extrabold text-red-400">${sup.balancePayable?.toFixed(2) || '0.00'}</div>
                  </div>

                  <button
                    onClick={() => {
                      setPaymentSupplier(sup);
                      setPaymentForm({ amount: sup.balancePayable || 0, paymentMethod: 'bank_transfer', notes: '' });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Make Payment
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => fetchSupplierHistoryDetails(sup._id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2 rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1"
                >
                  View Purchase & Payment Ledger ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SUPPLIER MODAL */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Add Supplier Profile
            </h2>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.company}
                  onChange={(e) => setSupplierForm({ ...supplierForm, company: e.target.value })}
                  placeholder="PharmaCorp Global Ltd"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">NTN / GST / Tax ID</label>
                  <input
                    type="text"
                    value={supplierForm.taxId}
                    onChange={(e) => setSupplierForm({ ...supplierForm, taxId: e.target.value })}
                    placeholder="NTN-892019"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Rating (1-5 Stars)</label>
                  <select
                    value={supplierForm.rating}
                    onChange={(e) => setSupplierForm({ ...supplierForm, rating: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="+1 800 123 4567"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    placeholder="orders@supplier.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Office / Warehouse Address</label>
                <input
                  type="text"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  placeholder="900 Industrial Ave"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Save Supplier Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE STOCK (GRN) MODAL — AUTOMATED WORKFLOW */}
      {receivingPo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  Receive Goods Received Note (GRN): {receivingPo.purchaseOrderNumber}
                </h2>
                <p className="text-xs text-slate-400">Receiving stock automatically increases batch quantities and updates supplier balances.</p>
              </div>
              <button onClick={() => setReceivingPo(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReceiveStock} className="space-y-4 text-xs">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-400">Items Received List (Supports Partial Delivery)</label>
                {receiveItemsState.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between font-bold text-white text-sm">
                      <span>{item.medicineName}</span>
                      <span className="text-blue-400 font-mono">Ordered: {item.orderedQty} units</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-slate-400 text-[10px]">Received Qty Now</label>
                        <input
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
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-bold text-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[10px]">Batch Number</label>
                        <input
                          type="text"
                          required
                          value={item.batchNumber}
                          onChange={(e) => {
                            const updated = [...receiveItemsState];
                            updated[idx].batchNumber = e.target.value.toUpperCase();
                            setReceiveItemsState(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[10px]">Expiry Date (FEFO)</label>
                        <input
                          type="date"
                          required
                          value={item.expiryDate}
                          onChange={(e) => {
                            const updated = [...receiveItemsState];
                            updated[idx].expiryDate = e.target.value;
                            setReceiveItemsState(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-[10px]">Rack Location</label>
                        <input
                          type="text"
                          value={item.rackNumber}
                          onChange={(e) => {
                            const updated = [...receiveItemsState];
                            updated[idx].rackNumber = e.target.value;
                            setReceiveItemsState(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Confirm GRN & Increase Stock Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setReceivingPo(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAKE SUPPLIER PAYMENT MODAL */}
      {paymentSupplier && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Record Payment to {paymentSupplier.company}
            </h2>

            <form onSubmit={handleMakePayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Payment Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold text-emerald-400 text-base"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="bank_transfer">Bank Wire Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Company Cheque</option>
                  <option value="card">Corporate Credit Card</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reference Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  placeholder="Check # or Transfer Reference"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Submit Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentSupplier(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER HISTORY LEDGER MODAL */}
      {selectedSupplierHistory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Supplier Ledger: {selectedSupplierHistory.supplier?.company}
                </h2>
                <div className="text-xs text-slate-400">Contact: {selectedSupplierHistory.supplier?.name} · Tax ID: {selectedSupplierHistory.supplier?.taxId || 'N/A'}</div>
              </div>
              <button onClick={() => setSelectedSupplierHistory(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Purchase History */}
              <div className="space-y-2">
                <div className="font-bold text-white text-xs uppercase tracking-wider text-blue-400">Purchase Orders & GRN History</div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2">PO #</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Grand Total</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedSupplierHistory.purchaseHistory?.map(p => (
                        <tr key={p._id}>
                          <td className="p-2 font-mono text-blue-400">{p.purchaseOrderNumber}</td>
                          <td className="p-2 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="p-2 font-bold text-emerald-400">${p.grandTotal?.toFixed(2)}</td>
                          <td className="p-2 uppercase font-bold text-[10px] text-slate-300">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-2">
                <div className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">Payment Disbursements History</div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Receipt #</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Method</th>
                        <th className="p-2">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedSupplierHistory.paymentHistory?.map(pay => (
                        <tr key={pay._id}>
                          <td className="p-2 font-mono text-amber-400">{pay.paymentReceiptNumber}</td>
                          <td className="p-2 text-slate-400">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                          <td className="p-2 text-slate-300 uppercase">{pay.paymentMethod}</td>
                          <td className="p-2 font-bold text-emerald-400">${pay.amount?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PurchasesSuppliers;
