import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  ShoppingCart, Search, Barcode, Trash2, Plus, Minus, CheckCircle,
  Printer, User, Phone, Stethoscope, FileText, QrCode, Building2,
  DollarSign, CreditCard, Landmark, Smartphone, ShieldCheck, Award
} from 'lucide-react';

const POSBilling = () => {
  const { user, activeBranchId, branches } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  // Customer & Prescription Info
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [prescriptionUrl, setPrescriptionUrl] = useState('');

  // Discount, Tax & Loyalty Points
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);

  // Payment Method: 'cash', 'card', 'bank_transfer', 'jazzcash', 'easypaisa', 'credit_account'
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Checkout State & Thermal Invoice Print Modal
  const [loading, setLoading] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  const activeBranch = branches.find(b => b._id === activeBranchId) || user?.branch;

  useEffect(() => {
    fetchMedicines();
  }, [activeBranchId]);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/inventory/medicines');
      setMedicines(res.data || []);
    } catch (err) {
      console.error('Failed to load inventory for POS:', err);
    }
  };

  const addToCart = (med) => {
    if (med.stockQty <= 0) return;

    const existingIndex = cart.findIndex((item) => item.medicineId === med._id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingIndex].quantity + 1 > med.stockQty) {
        alert(`Cannot exceed available stock of ${med.stockQty} ${med.unit}s.`);
        return;
      }
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          medicineId: med._id,
          name: med.name,
          sku: med.sku,
          unitPrice: med.unitPrice,
          taxRate: med.taxRate || 0,
          unit: med.unit || 'Strip',
          stockQty: med.stockQty,
          quantity: 1
        }
      ]);
    }
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;

    if (newQty <= 0) {
      updated.splice(index, 1);
    } else if (newQty > updated[index].stockQty) {
      alert(`Cannot exceed available stock of ${updated[index].stockQty}.`);
      return;
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const calculateTax = () => {
    return cart.reduce((acc, item) => {
      const lineSubtotal = item.unitPrice * item.quantity;
      return acc + lineSubtotal * (item.taxRate / 100);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const payload = {
        patientName,
        customerPhone: patientPhone,
        patientPhone,
        doctorName,
        prescriptionNumber,
        prescriptionDocumentUrl: prescriptionUrl,
        items: cart,
        discountAmount,
        taxAmount: tax,
        paymentMethod,
        redeemLoyaltyPoints: redeemLoyalty
      };

      const res = await API.post('/pos/sales', payload);
      setCompletedSale(res.data.sale);
      setCart([]);
      setDiscountAmount(0);
      fetchMedicines(); // Refresh stock counts
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.genericName && m.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.barcode && m.barcode.includes(searchTerm))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] overflow-hidden">
      
      {/* LEFT: MEDICINE CATALOG & BARCODE SCANNER (7 cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-4 h-full overflow-hidden">
        {/* Search & Barcode Input */}
        <div className="relative shrink-0">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Medicine Name, Generic, SKU, or Scan Barcode..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-md"
          />
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-0">
          {filteredMedicines.map((med) => {
            const isOutOfStock = med.stockQty <= 0;
            return (
              <div
                key={med._id}
                onClick={() => addToCart(med)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isOutOfStock
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:scale-[1.01] shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm">{med.name}</h3>
                    {med.rxRequired && (
                      <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/30">
                        Rx
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{med.brandName || med.genericName}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">SKU: {med.sku} · {med.dosageForm}</p>
                </div>

                <div className="mt-3 flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-base font-extrabold text-emerald-400">${med.unitPrice?.toFixed(2)}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isOutOfStock ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {isOutOfStock ? 'Out of stock' : `${med.stockQty} in stock`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: BILLING CART & PAYMENTS (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-full max-h-full overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" /> Billing Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-red-400 hover:underline cursor-pointer">Clear</button>
            )}
          </div>

          {/* Patient Details & Prescription Upload */}
          <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs shrink-0 mt-3">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Patient Name"
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
              />
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="Patient Phone"
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Doctor Name"
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
              />
              <input
                type="text"
                value={prescriptionNumber}
                onChange={(e) => setPrescriptionNumber(e.target.value)}
                placeholder="Rx Number"
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs"
              />
            </div>
          </div>

          {/* DYNAMIC CART ITEMS CONTAINER (Fills available space & scrolls internally) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2 my-3">
            {cart.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs italic flex flex-col items-center justify-center h-full">
                <span>Cart is empty.</span>
                <span className="text-[11px]">Select medicines from the left to start billing.</span>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="bg-slate-800/60 p-2.5 rounded-xl flex items-center justify-between border border-slate-700/60 text-xs">
                  <div className="max-w-[170px]">
                    <div className="font-bold text-white truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400">${item.unitPrice?.toFixed(2)} / {item.unit}</div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white font-mono min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white cursor-pointer">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => updateQuantity(idx, -item.quantity)} className="p-1 text-red-400 hover:bg-slate-700 rounded cursor-pointer ml-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Summary & Payment Methods (Pinned at bottom, shrink-0) */}
        <div className="pt-3 border-t border-slate-800 space-y-3 shrink-0">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax (GST/VAT):</span>
              <span className="font-mono text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 items-center">
              <span>Discount ($):</span>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-right text-white font-mono"
              />
            </div>
            <div className="flex justify-between font-extrabold text-base text-white pt-1.5 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector Grid */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'cash' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'card' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Card
            </button>
            <button
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'bank_transfer' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" /> Bank
            </button>
            <button
              onClick={() => setPaymentMethod('jazzcash')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'jazzcash' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-red-400" /> JazzCash
            </button>
            <button
              onClick={() => setPaymentMethod('easypaisa')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'easypaisa' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> EasyPaisa
            </button>
            <button
              onClick={() => setPaymentMethod('credit_account')}
              className={`p-2 rounded-lg border flex items-center justify-center gap-1 cursor-pointer ${
                paymentMethod === 'credit_account' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Credit
            </button>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 text-xs cursor-pointer transition-all"
          >
            {loading ? 'Processing Sale...' : `Complete Sale ($${grandTotal.toFixed(2)})`}
          </button>
        </div>
      </div>

      {/* THERMAL RECEIPT PRINT MODAL */}
      {completedSale && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 font-mono text-xs">
            {/* Header / Store Info */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
              <h2 className="font-extrabold text-base uppercase tracking-tight">{user?.pharmacy?.name}</h2>
              <div>{activeBranch?.name} · {activeBranch?.address}</div>
              <div>License #: {user?.pharmacy?.licenseNumber} · Tax ID: {user?.pharmacy?.taxId}</div>
              <div>Phone: {user?.pharmacy?.phone}</div>
            </div>

            {/* Invoice Meta */}
            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-3">
              <div className="flex justify-between font-bold">
                <span>Invoice #:</span>
                <span>{completedSale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date:</span>
                <span>{new Date(completedSale.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Patient:</span>
                <span>{completedSale.patientName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment:</span>
                <span className="uppercase font-bold">{completedSale.paymentMethod}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-3">
              {completedSale.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span>{item.quantity}x {item.medicineName} (BT: {item.batchNumber})</span>
                  <span className="font-bold">${item.total?.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-1 font-bold text-xs pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${completedSale.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${completedSale.taxAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${completedSale.discountAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold border-t border-slate-900 pt-1">
                <span>GRAND TOTAL:</span>
                <span>${completedSale.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

            {/* QR Verification Payload */}
            <div className="pt-3 border-t border-dashed border-slate-400 text-center space-y-2 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-950 p-1 rounded flex flex-wrap gap-1 items-center justify-center">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className={`w-3.5 h-3.5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-950'}`}></span>
                ))}
              </div>
              <div className="text-[9px] text-slate-500">Scan to Verify Invoice Authenticity</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default POSBilling;
