import Purchase from '../models/Purchase.js';
import Supplier from '../models/Supplier.js';
import Batch from '../models/Batch.js';
import Medicine from '../models/Medicine.js';
import AuditLog from '../models/AuditLog.js';
import SupplierPayment from '../models/SupplierPayment.js';

// Create Purchase Order (PO / Draft)
export const createPurchaseOrder = async (req, res) => {
  const { supplierId, supplierInvoiceNumber, items, subtotal, taxAmount, discountAmount, grandTotal, paidAmount, invoiceDocumentUrl, notes } = req.body;

  try {
    const supplier = await Supplier.findOne({ _id: supplierId, pharmacy: req.pharmacyId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const poNumber = `PO-${Date.now().toString().slice(-6)}`;
    const initialPaid = paidAmount || 0;
    const balanceDue = grandTotal - initialPaid;

    const purchase = await Purchase.create({
      purchaseOrderNumber: poNumber,
      supplierInvoiceNumber: supplierInvoiceNumber || '',
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      supplier: supplierId,
      receivedBy: req.userFull._id,
      status: 'pending',
      items,
      subtotal,
      taxAmount: taxAmount || 0,
      discountAmount: discountAmount || 0,
      grandTotal,
      paidAmount: initialPaid,
      balanceDue,
      paymentStatus: initialPaid >= grandTotal ? 'paid' : initialPaid > 0 ? 'partially_paid' : 'unpaid',
      invoiceDocumentUrl: invoiceDocumentUrl || '',
      notes: notes || ''
    });

    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'PURCHASE_ORDER_CREATED',
      module: 'Procurement',
      details: `Created Purchase Order ${poNumber} for Supplier "${supplier.company}" (Total: $${grandTotal.toFixed(2)})`
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Receive Stock (GRN) — AUTOMATED WORKFLOW!
export const receivePurchaseStock = async (req, res) => {
  const { purchaseId } = req.params;
  const { receivedItems, supplierInvoiceNumber, invoiceDocumentUrl } = req.body; // Array of { itemIndex/medicineId, receivedQty, batchNumber, expiryDate, mfgDate, rackNumber, costPrice, sellingPrice }

  try {
    const purchase = await Purchase.findOne({ _id: purchaseId, pharmacy: req.pharmacyId }).populate('supplier');
    if (!purchase) return res.status(404).json({ message: 'Purchase Order not found' });

    let isFullyReceived = true;
    let isPartiallyReceived = false;

    // Process Received Items & Auto-Update Inventory Batches & Medicine Prices
    for (let i = 0; i < purchase.items.length; i++) {
      const item = purchase.items[i];
      const match = receivedItems?.find(r => r.medicineId === item.medicine.toString() || r.itemIndex === i);

      if (match) {
        const newlyReceived = Number(match.receivedQty) || 0;
        item.receivedQuantity = (item.receivedQuantity || 0) + newlyReceived;
        if (match.batchNumber) item.batchNumber = match.batchNumber;
        if (match.expiryDate) item.expiryDate = match.expiryDate;
        if (match.costPrice) item.costPrice = match.costPrice;
        if (match.sellingPrice) item.sellingPrice = match.sellingPrice;
        if (match.rackNumber) item.rackNumber = match.rackNumber;

        // 1. AUTOMATICALLY INCREASE / CREATE INVENTORY BATCH
        if (newlyReceived > 0) {
          isPartiallyReceived = true;

          // Find or create batch
          let batch = await Batch.findOne({
            pharmacy: req.pharmacyId,
            branch: req.branchId,
            medicine: item.medicine,
            batchNumber: item.batchNumber
          });

          if (batch) {
            batch.quantity += newlyReceived;
            batch.expiryDate = item.expiryDate || batch.expiryDate;
            batch.costPrice = item.costPrice || batch.costPrice;
            batch.sellingPrice = item.sellingPrice || batch.sellingPrice;
            batch.status = 'active';
            await batch.save();
          } else {
            await Batch.create({
              medicine: item.medicine,
              pharmacy: req.pharmacyId,
              branch: req.branchId,
              supplier: purchase.supplier._id,
              batchNumber: item.batchNumber,
              expiryDate: item.expiryDate || new Date(Date.now() + 365*24*60*60*1000),
              manufacturingDate: item.manufacturingDate || null,
              costPrice: item.costPrice,
              sellingPrice: item.sellingPrice,
              mrp: item.sellingPrice,
              quantity: newlyReceived,
              rackNumber: item.rackNumber || '',
              status: 'active'
            });
          }

          // 2. AUTOMATICALLY UPDATE MEDICINE COST & SELLING PRICES
          await Medicine.findByIdAndUpdate(item.medicine, {
            costPrice: item.costPrice,
            unitPrice: item.sellingPrice
          });
        }
      }

      if (item.receivedQuantity < item.orderedQuantity) {
        isFullyReceived = false;
      }
    }

    if (supplierInvoiceNumber) purchase.supplierInvoiceNumber = supplierInvoiceNumber;
    if (invoiceDocumentUrl) purchase.invoiceDocumentUrl = invoiceDocumentUrl;

    purchase.status = isFullyReceived ? 'received' : isPartiallyReceived ? 'partially_received' : purchase.status;
    await purchase.save();

    // 3. AUTOMATICALLY UPDATE SUPPLIER OUTSTANDING BALANCE
    const supplier = await Supplier.findById(purchase.supplier._id || purchase.supplier);
    if (supplier) {
      supplier.balancePayable += (purchase.grandTotal - purchase.paidAmount);
      await supplier.save();
    }

    // 4. AUTOMATICALLY CREATE AUDIT LOG
    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'PURCHASE_RECEIVED',
      module: 'Procurement',
      details: `Received Stock for PO ${purchase.purchaseOrderNumber} from ${supplier?.company || 'Supplier'}. Status: ${purchase.status.toUpperCase()}. Supplier balance updated.`
    });

    res.json({
      message: 'Purchase stock received successfully. Inventory, medicine prices, and supplier balance updated.',
      purchase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ pharmacy: req.pharmacyId })
      .populate('supplier')
      .populate('receivedBy', 'name email')
      .populate('branch', 'name code')
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record Supplier Payment
export const makeSupplierPayment = async (req, res) => {
  const { supplierId, purchaseId, amount, paymentMethod, notes } = req.body;

  try {
    const supplier = await Supplier.findOne({ _id: supplierId, pharmacy: req.pharmacyId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const payNum = `PAY-SUP-${Date.now().toString().slice(-6)}`;

    const payment = await SupplierPayment.create({
      paymentReceiptNumber: payNum,
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      supplier: supplierId,
      purchaseOrder: purchaseId || null,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'bank_transfer',
      notes: notes || '',
      paidBy: req.userFull._id
    });

    // Reduce Supplier Outstanding Balance
    supplier.balancePayable = Math.max(0, supplier.balancePayable - Number(amount));
    await supplier.save();

    // If linked to a purchase order, update purchase payment status
    if (purchaseId) {
      const po = await Purchase.findById(purchaseId);
      if (po) {
        po.paidAmount += Number(amount);
        po.balanceDue = Math.max(0, po.grandTotal - po.paidAmount);
        po.paymentStatus = po.balanceDue === 0 ? 'paid' : 'partially_paid';
        await po.save();
      }
    }

    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'SUPPLIER_PAYMENT_MADE',
      module: 'Procurement',
      details: `Paid $${Number(amount).toFixed(2)} to Supplier "${supplier.company}". Receipt: ${payNum}. New Balance: $${supplier.balancePayable.toFixed(2)}`
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Supplier Payment History & Purchase History
export const getSupplierHistory = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const supplier = await Supplier.findOne({ _id: supplierId, pharmacy: req.pharmacyId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const purchaseHistory = await Purchase.find({ pharmacy: req.pharmacyId, supplier: supplierId }).sort({ createdAt: -1 });
    const paymentHistory = await SupplierPayment.find({ pharmacy: req.pharmacyId, supplier: supplierId }).populate('paidBy', 'name').sort({ createdAt: -1 });

    res.json({
      supplier,
      purchaseHistory,
      paymentHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
