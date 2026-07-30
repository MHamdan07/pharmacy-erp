import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  Pill, Plus, Calendar, Search, Edit, Trash2, QrCode, Barcode,
  ChevronDown, ChevronRight, Image as ImageIcon, ShieldAlert,
  Tag, Truck, Box, Check, AlertCircle, Info, ExternalLink
} from 'lucide-react';

const Inventory = () => {
  const { user, activeBranchId } = useAuth();
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Expandable batch view per medicine
  const [expandedMedId, setExpandedMedId] = useState(null);

  // Barcode & QR Code Modal
  const [qrModalData, setQrModalData] = useState(null);

  // Image Modal
  const [imageModalUrl, setImageModalUrl] = useState(null);

  // Modals & Editing State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [editingBatchId, setEditingBatchId] = useState(null);

  const isOwnerOrAdmin = ['Owner', 'Admin', 'SuperAdmin'].includes(user?.role);

  // Complete Medicine Form State (24 required fields!)
  const [medForm, setMedForm] = useState({
    name: '',
    genericName: '',
    brandName: '',
    manufacturer: '',
    sku: '',
    barcode: '',
    category: '',
    supplier: '',
    unit: 'Strip',
    strength: '500mg',
    dosageForm: 'Tablet',
    packSize: '10s',
    costPrice: 5.00,
    unitPrice: 10.00,
    defaultDiscount: 0,
    taxRate: 5,
    minStock: 10,
    maxStock: 500,
    rxRequired: false,
    storageInstructions: 'Store in a cool, dry place below 25°C.',
    sideNotes: '',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
  });

  // Batch Form State
  const [batchForm, setBatchForm] = useState({
    medicineId: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    costPrice: 5.00,
    sellingPrice: 10.00,
    mrp: 12.00,
    discount: 0,
    quantity: 100,
    rackNumber: 'Rack A-1',
    supplierId: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeBranchId, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'medicines') {
        const res = await API.get('/inventory/medicines');
        setMedicines(res.data || []);
      } else if (activeTab === 'batches') {
        const res = await API.get('/inventory/batches');
        setBatches(res.data || []);
      }
      const catRes = await API.get('/inventory/categories');
      setCategories(catRes.data || []);

      const supRes = await API.get('/inventory/suppliers');
      setSuppliers(supRes.data || []);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    }
  };

  // Medicine Save / Edit Handler
  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editingMedId) {
        await API.put(`/inventory/medicines/${editingMedId}`, medForm);
      } else {
        await API.post('/inventory/medicines', medForm);
      }
      setShowAddMedModal(false);
      setEditingMedId(null);
      resetMedForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save medicine');
    }
  };

  const handleEditClick = (med) => {
    setEditingMedId(med._id);
    setMedForm({
      name: med.name || '',
      genericName: med.genericName || '',
      brandName: med.brandName || '',
      manufacturer: med.manufacturer || '',
      sku: med.sku || '',
      barcode: med.barcode || '',
      category: med.category?._id || med.category || '',
      supplier: med.supplier?._id || med.supplier || '',
      unit: med.unit || 'Strip',
      strength: med.strength || '',
      dosageForm: med.dosageForm || 'Tablet',
      packSize: med.packSize || '10s',
      costPrice: med.costPrice || 0,
      unitPrice: med.unitPrice || 0,
      defaultDiscount: med.defaultDiscount || 0,
      taxRate: med.taxRate || 0,
      minStock: med.minStock || 10,
      maxStock: med.maxStock || 500,
      rxRequired: med.rxRequired || false,
      storageInstructions: med.storageInstructions || 'Store below 25°C',
      sideNotes: med.sideNotes || '',
      imageUrl: med.imageUrl || ''
    });
    setShowAddMedModal(true);
  };

  const handleDeleteMedicine = async (medId, medName) => {
    if (!window.confirm(`Are you sure you want to delete "${medName}" and all associated batches?`)) return;
    try {
      await API.delete(`/inventory/medicines/${medId}`);
      if (editingMedId) {
        setShowAddMedModal(false);
        setEditingMedId(null);
        resetMedForm();
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete medicine');
    }
  };

  // Batch Save / Edit / Delete Handlers
  const handleSaveBatch = async (e) => {
    e.preventDefault();
    try {
      if (editingBatchId) {
        await API.put(`/inventory/batches/${editingBatchId}`, batchForm);
      } else {
        await API.post('/inventory/batches', batchForm);
      }
      setShowAddBatchModal(false);
      setEditingBatchId(null);
      resetBatchForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save batch');
    }
  };

  const handleEditBatchClick = (batch) => {
    setEditingBatchId(batch._id);
    setBatchForm({
      medicineId: batch.medicine?._id || batch.medicine || '',
      batchNumber: batch.batchNumber || '',
      manufacturingDate: batch.manufacturingDate ? new Date(batch.manufacturingDate).toISOString().slice(0, 10) : '',
      expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toISOString().slice(0, 10) : '',
      costPrice: batch.costPrice || 0,
      sellingPrice: batch.sellingPrice || 0,
      mrp: batch.mrp || batch.sellingPrice || 0,
      discount: batch.discount || 0,
      quantity: batch.quantity || 0,
      rackNumber: batch.rackNumber || '',
      supplierId: batch.supplier?._id || batch.supplier || ''
    });
    setShowAddBatchModal(true);
  };

  const handleDeleteBatch = async (batchId, batchNumber) => {
    if (!window.confirm(`Are you sure you want to delete Batch "${batchNumber}"?`)) return;
    try {
      await API.delete(`/inventory/batches/${batchId}`);
      if (editingBatchId) {
        setShowAddBatchModal(false);
        setEditingBatchId(null);
        resetBatchForm();
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete batch');
    }
  };

  const resetMedForm = () => {
    setMedForm({
      name: '',
      genericName: '',
      brandName: '',
      manufacturer: '',
      sku: '',
      barcode: '',
      category: '',
      supplier: '',
      unit: 'Strip',
      strength: '500mg',
      dosageForm: 'Tablet',
      packSize: '10s',
      costPrice: 5.00,
      unitPrice: 10.00,
      defaultDiscount: 0,
      taxRate: 5,
      minStock: 10,
      maxStock: 500,
      rxRequired: false,
      storageInstructions: 'Store in a cool, dry place below 25°C.',
      sideNotes: '',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
    });
  };

  const resetBatchForm = () => {
    setBatchForm({
      medicineId: '',
      batchNumber: '',
      manufacturingDate: '',
      expiryDate: '',
      costPrice: 5.00,
      sellingPrice: 10.00,
      mrp: 12.00,
      discount: 0,
      quantity: 100,
      rackNumber: 'Rack A-1',
      supplierId: ''
    });
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.genericName && m.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.brandName && m.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    m.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBatches = batches.filter(b =>
    b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.medicine?.name && b.medicine.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.rackNumber && b.rackNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-400" />
            Medicine Management & FEFO Multi-Batch Control
          </h1>
          
        </div>

        <div className="flex items-center gap-2">
          {isOwnerOrAdmin && (
            <button
              onClick={() => {
                setEditingMedId(null);
                resetMedForm();
                setShowAddMedModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Medicine
            </button>
          )}
          <button
            onClick={() => {
              setEditingBatchId(null);
              resetBatchForm();
              setShowAddBatchModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Batch Stock
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'medicines' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" /> Medicine Catalog ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'batches' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> All Active Batches ({batches.length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Medicine, Brand, Generic, SKU, Batch..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* MEDICINES CATALOG TAB */}
      {activeTab === 'medicines' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-3 w-8"></th>
                  <th className="py-3 px-4">Medicine & Image</th>
                  <th className="py-3 px-4">Brand / Manufacturer</th>
                  <th className="py-3 px-4">SKU / Codes</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Cost / Selling Price</th>
                  <th className="py-3 px-4 text-center">Total Stock (Batches)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredMedicines.map((med) => {
                  const isExpanded = expandedMedId === med._id;
                  return (
                    <>
                      <tr key={med._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setExpandedMedId(isExpanded ? null : med._id)}
                            className="text-slate-400 hover:text-blue-400 cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Medicine & Image */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {med.imageUrl ? (
                              <img
                                src={med.imageUrl}
                                alt={med.name}
                                onClick={() => setImageModalUrl(med.imageUrl)}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-700 cursor-pointer hover:opacity-80 transition-all shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
                                <Pill className="w-5 h-5" />
                              </div>
                            )}

                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                {med.name}
                                {med.rxRequired && (
                                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1 py-0.2 rounded text-[9px] font-bold">
                                    Rx
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                Generic: {med.genericName || 'N/A'} · {med.dosageForm} ({med.strength})
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Brand / Manufacturer */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">{med.brandName || med.name}</div>
                          <div className="text-[10px] text-slate-400">{med.manufacturer || 'PharmaCorp'}</div>
                        </td>

                        {/* SKU & Barcode/QR Actions */}
                        <td className="py-3 px-4">
                          <div className="font-mono text-blue-400 font-semibold">{med.sku}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => setQrModalData({ type: 'barcode', title: med.name, code: med.barcode || med.sku })}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Barcode className="w-3 h-3 text-amber-400" /> Barcode
                            </button>
                            <button
                              onClick={() => setQrModalData({ type: 'qr', title: med.name, code: med.qrCodeData || med.sku })}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3 h-3 text-emerald-400" /> QR Code
                            </button>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px]">
                            {med.category?.name || 'General'}
                          </span>
                        </td>

                        {/* Cost & Selling Price */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-emerald-400">${med.unitPrice?.toFixed(2)} / {med.unit}</div>
                          <div className="text-[10px] text-slate-400">Cost: ${med.costPrice?.toFixed(2) || '0.00'}</div>
                        </td>

                        {/* Total Stock (Batches) */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center justify-center">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm ${
                              med.stockQty > (med.minStock || 10)
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : med.stockQty > 0
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30 font-extrabold'
                            }`}>
                              {med.stockQty || 0} {med.unit}s
                            </span>
                            <span className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">
                              ({med.activeBatchesCount || 0} active {med.activeBatchesCount === 1 ? 'batch' : 'batches'})
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isOwnerOrAdmin && (
                              <button
                                onClick={() => handleEditClick(med)}
                                className="p-1.5 text-blue-400 hover:bg-slate-800 rounded cursor-pointer"
                                title="Edit Medicine"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Batches Sub-Table */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80">
                          <td colSpan="8" className="p-4 border-l-4 border-blue-500">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                                <span>Multi-Batch Breakdown for {med.name}:</span>
                                <span>Storage Instructions: {med.storageInstructions || 'Keep below 25°C'}</span>
                              </div>

                              {med.batches && med.batches.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {med.batches.map((b) => (
                                    <div key={b._id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-2">
                                      <div className="flex justify-between font-mono font-bold text-amber-400">
                                        <span>Batch: {b.batchNumber}</span>
                                        <span className="text-white">{b.quantity} {med.unit}s</span>
                                      </div>
                                      <div className="flex justify-between text-slate-400">
                                        <span>Exp: {new Date(b.expiryDate).toLocaleDateString()}</span>
                                        <span>Rack: {b.rackNumber || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                                        <span>Selling: ${b.sellingPrice?.toFixed(2)}</span>
                                        <button
                                          onClick={() => handleEditBatchClick(b)}
                                          className="p-1 text-blue-400 hover:bg-slate-800 rounded cursor-pointer"
                                          title="Edit Batch"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 italic py-2">
                                  No active batches registered for this medicine. Click "Add Batch Stock" to add inventory.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL BATCHES TAB (ONLY EDIT BUTTON ON RIGHT SIDE) */}
      {activeTab === 'batches' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs min-w-[950px]">
              <thead className="bg-slate-800/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4">Expiry Date (FEFO)</th>
                  <th className="py-3 px-4">Mfg Date</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Rack #</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredBatches.map((batch) => {
                  const isNearExpiry = new Date(batch.expiryDate) < new Date(Date.now() + 60*24*60*60*1000);
                  return (
                    <tr key={batch._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{batch.batchNumber}</td>
                      <td className="py-3 px-4 font-semibold text-white">{batch.medicine?.name}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className={isNearExpiry ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {batch.manufacturingDate ? new Date(batch.manufacturingDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">${batch.costPrice?.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${batch.sellingPrice?.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-white">{batch.quantity}</td>
                      <td className="py-3 px-4 text-slate-400">{batch.rackNumber || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          batch.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditBatchClick(batch)}
                            className="p-1.5 text-blue-400 hover:bg-slate-800 rounded cursor-pointer"
                            title="Edit Batch Values"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MEDICINE MODAL (WITH TOP HEADER DELETE ONLY) */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-400" />
                {editingMedId ? 'Edit Medicine Profile' : 'Create New Pharmaceutical Product'}
              </h2>
              {editingMedId && isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedicine(editingMedId, medForm.name)}
                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Medicine
                </button>
              )}
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Medicine Name *</label>
                  <input
                    type="text"
                    required
                    value={medForm.name}
                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    placeholder="Amoxicillin Trihydrate"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Generic Name</label>
                  <input
                    type="text"
                    value={medForm.genericName}
                    onChange={(e) => setMedForm({ ...medForm, genericName: e.target.value })}
                    placeholder="Amoxicillin"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Brand Name</label>
                  <input
                    type="text"
                    value={medForm.brandName}
                    onChange={(e) => setMedForm({ ...medForm, brandName: e.target.value })}
                    placeholder="Amoxil Extra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Manufacturer</label>
                  <input
                    type="text"
                    value={medForm.manufacturer}
                    onChange={(e) => setMedForm({ ...medForm, manufacturer: e.target.value })}
                    placeholder="Pfizer / Novartis / Sun Pharma"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Category *</label>
                  <select
                    required
                    value={medForm.category}
                    onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Preferred Supplier</label>
                  <select
                    value={medForm.supplier}
                    onChange={(e) => setMedForm({ ...medForm, supplier: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={medForm.sku}
                    onChange={(e) => setMedForm({ ...medForm, sku: e.target.value.toUpperCase() })}
                    placeholder="AMX-500"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Barcode</label>
                  <input
                    type="text"
                    value={medForm.barcode}
                    onChange={(e) => setMedForm({ ...medForm, barcode: e.target.value })}
                    placeholder="8901234567890"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Unit</label>
                  <select
                    value={medForm.unit}
                    onChange={(e) => setMedForm({ ...medForm, unit: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Strip">Strip</option>
                    <option value="Box">Box</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Vial">Vial</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Ampoule">Ampoule</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Cost / Purchase Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={medForm.costPrice}
                    onChange={(e) => setMedForm({ ...medForm, costPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={medForm.unitPrice}
                    onChange={(e) => setMedForm({ ...medForm, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={medForm.taxRate}
                    onChange={(e) => setMedForm({ ...medForm, taxRate: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Min Stock (Reorder Alert)</label>
                  <input
                    type="number"
                    value={medForm.minStock}
                    onChange={(e) => setMedForm({ ...medForm, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Max Stock Capacity</label>
                  <input
                    type="number"
                    value={medForm.maxStock}
                    onChange={(e) => setMedForm({ ...medForm, maxStock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Storage Instructions</label>
                  <input
                    type="text"
                    value={medForm.storageInstructions}
                    onChange={(e) => setMedForm({ ...medForm, storageInstructions: e.target.value })}
                    placeholder="Store in a cool dry place below 25°C"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Medicine Image URL</label>
                  <input
                    type="text"
                    value={medForm.imageUrl}
                    onChange={(e) => setMedForm({ ...medForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rxReq"
                  checked={medForm.rxRequired}
                  onChange={(e) => setMedForm({ ...medForm, rxRequired: e.target.checked })}
                />
                <label htmlFor="rxReq" className="text-slate-300 font-semibold">Prescription Required (Rx)</label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  {editingMedId ? 'Update Medicine Profile' : 'Save Medicine'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BATCH MODAL (WITH TOP HEADER DELETE ONLY) */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                {editingBatchId ? 'Edit Stock Batch Details' : 'Add Stock Batch (FEFO Expiry Control)'}
              </h2>
              {editingBatchId && isOwnerOrAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteBatch(editingBatchId, batchForm.batchNumber)}
                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete Batch
                </button>
              )}
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Select Medicine *</label>
                <select
                  required
                  value={batchForm.medicineId}
                  onChange={(e) => setBatchForm({ ...batchForm, medicineId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">Select Medicine</option>
                  {medicines.map(m => <option key={m._id} value={m._id}>{m.name} ({m.sku})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={batchForm.batchNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value.toUpperCase() })}
                    placeholder="BT-AMX-99"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Rack Number</label>
                  <input
                    type="text"
                    value={batchForm.rackNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, rackNumber: e.target.value })}
                    placeholder="Rack A-1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Manufacturing Date</label>
                  <input
                    type="date"
                    value={batchForm.manufacturingDate}
                    onChange={(e) => setBatchForm({ ...batchForm, manufacturingDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Expiry Date (FEFO) *</label>
                  <input
                    type="date"
                    required
                    value={batchForm.expiryDate}
                    onChange={(e) => setBatchForm({ ...batchForm, expiryDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={batchForm.costPrice}
                    onChange={(e) => setBatchForm({ ...batchForm, costPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={batchForm.sellingPrice}
                    onChange={(e) => setBatchForm({ ...batchForm, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  {editingBatchId ? 'Update Batch Values' : 'Save Batch Stock'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE / QR CODE GENERATOR PREVIEW MODAL */}
      {qrModalData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-200 shadow-2xl space-y-4 text-center">
            <h3 className="text-md font-bold text-white">{qrModalData.title}</h3>
            <p className="text-xs text-slate-400">Generated {qrModalData.type.toUpperCase()} Code</p>

            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-900 font-mono text-xs">
              {qrModalData.type === 'barcode' ? (
                <div className="space-y-1">
                  <div className="h-16 flex items-center justify-center space-x-1">
                    {[2,1,3,1,2,4,1,2,1,3,1,2,1,4,2,1,3].map((w, i) => (
                      <span key={i} className="bg-black inline-block h-14" style={{ width: `${w * 2}px` }}></span>
                    ))}
                  </div>
                  <div className="font-bold text-sm tracking-widest">{qrModalData.code}</div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-32 h-32 bg-slate-950 p-2 rounded flex flex-wrap gap-1 justify-center items-center">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <span key={i} className={`w-4 h-4 rounded-xs ${i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-slate-950'}`}></span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate max-w-xs">{qrModalData.code}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setQrModalData(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MEDICINE IMAGE PREVIEW MODAL */}
      {imageModalUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 text-center space-y-3">
            <img src={imageModalUrl} alt="Medicine Preview" className="w-full h-64 object-cover rounded-xl border border-slate-800" />
            <button
              onClick={() => setImageModalUrl(null)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
