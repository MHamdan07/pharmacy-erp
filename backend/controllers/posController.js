import Sale from '../models/Sale.js';
import Batch from '../models/Batch.js';
import Medicine from '../models/Medicine.js';
import Customer from '../models/Customer.js';
import AuditLog from '../models/AuditLog.js';

export const processSale = async (req, res) => {
  const {
    customerPhone, patientName, patientPhone, doctorName, prescriptionNumber,
    prescriptionDocumentUrl, items, discountAmount, taxAmount, paymentMethod,
    redeemLoyaltyPoints
  } = req.body;

  try {
    const pharmacyId = req.pharmacyId;
    const branchId = req.branchId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    // 1. Process Customer (or Walk-in) & Loyalty Points
    let customer = null;
    if (customerPhone) {
      customer = await Customer.findOne({ pharmacy: pharmacyId, phone: customerPhone });
      if (!customer && patientName) {
        customer = await Customer.create({
          pharmacy: pharmacyId,
          name: patientName,
          phone: customerPhone
        });
      }
    }

    const saleItems = [];
    let calculatedSubtotal = 0;
    const now = new Date();

    // 2. FEFO Batch Stock Allocation Loop (HARD LOCK EXCLUSION OF EXPIRED BATCHES!)
    for (const cartItem of items) {
      let remainingQtyToDeduct = cartItem.quantity;

      const activeBatches = await Batch.find({
        pharmacy: pharmacyId,
        branch: branchId,
        medicine: cartItem.medicineId,
        status: 'active',
        quantity: { $gt: 0 },
        expiryDate: { $gt: now } // HARD LOCK: Prevents sale of expired medicines!
      }).sort({ expiryDate: 1 }); // FEFO Sort

      const totalAvailable = activeBatches.reduce((acc, b) => acc + b.quantity, 0);
      if (totalAvailable < cartItem.quantity) {
        const med = await Medicine.findById(cartItem.medicineId);
        return res.status(400).json({
          message: `Sale locked: Insufficient unexpired stock for "${med?.name || 'Item'}". Requested: ${cartItem.quantity}, Available: ${totalAvailable}`
        });
      }

      for (const batch of activeBatches) {
        if (remainingQtyToDeduct <= 0) break;

        const deductQty = Math.min(batch.quantity, remainingQtyToDeduct);
        batch.quantity -= deductQty;
        if (batch.quantity === 0) {
          batch.status = 'exhausted';
        }
        await batch.save();

        const itemSubtotal = deductQty * cartItem.unitPrice;
        calculatedSubtotal += itemSubtotal;

        saleItems.push({
          medicine: cartItem.medicineId,
          medicineName: cartItem.name,
          batch: batch._id,
          batchNumber: batch.batchNumber,
          quantity: deductQty,
          unitPrice: cartItem.unitPrice,
          discount: cartItem.discount || 0,
          taxRate: cartItem.taxRate || 0,
          total: itemSubtotal
        });

        remainingQtyToDeduct -= deductQty;
      }
    }

    // 3. Financial Totals & Loyalty Points Calculation
    const disc = Number(discountAmount) || 0;
    const tax = Number(taxAmount) || 0;
    let grandTotal = Math.max(0, calculatedSubtotal - disc + tax);

    let pointsEarned = 0;
    let pointsRedeemed = 0;

    if (customer) {
      if (redeemLoyaltyPoints && customer.loyaltyPoints >= 10) {
        pointsRedeemed = Math.min(customer.loyaltyPoints, Math.floor(grandTotal * 10));
        const pointDiscount = pointsRedeemed / 10;
        grandTotal = Math.max(0, grandTotal - pointDiscount);
        customer.loyaltyPoints -= pointsRedeemed;
      }

      pointsEarned = Math.floor(grandTotal / 10);
      customer.loyaltyPoints += pointsEarned;

      if (paymentMethod === 'credit_account') {
        customer.creditBalance += grandTotal;
      }

      await customer.save();
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    const qrPayload = JSON.stringify({
      inv: invoiceNumber,
      total: grandTotal.toFixed(2),
      date: new Date().toISOString(),
      branch: branchId
    });

    const newSale = await Sale.create({
      invoiceNumber,
      pharmacy: pharmacyId,
      branch: branchId,
      cashier: req.userFull._id,
      customer: customer?._id || null,
      patientName: patientName || 'Walk-in Customer',
      patientPhone: patientPhone || customerPhone || '',
      doctorName: doctorName || '',
      prescriptionNumber: prescriptionNumber || '',
      prescriptionDocumentUrl: prescriptionDocumentUrl || '',
      items: saleItems,
      subtotal: calculatedSubtotal,
      discountAmount: disc,
      taxAmount: tax,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsRedeemed: pointsRedeemed,
      grandTotal,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      qrVerificationData: qrPayload
    });

    await AuditLog.create({
      pharmacy: pharmacyId,
      branch: branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'POS_SALE_COMPLETED',
      module: 'POS Billing',
      details: `Completed Invoice ${invoiceNumber} ($${grandTotal.toFixed(2)}) via ${paymentMethod.toUpperCase()}`
    });

    res.status(201).json({
      message: 'Sale completed successfully',
      sale: newSale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesHistory = async (req, res) => {
  try {
    const query = { pharmacy: req.pharmacyId };
    if (req.branchId) query.branch = req.branchId;

    const sales = await Sale.find(query)
      .populate('cashier', 'name')
      .populate('customer')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, pharmacy: req.pharmacyId })
      .populate('cashier', 'name')
      .populate('customer');

    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkout = processSale;
export const getSales = getSalesHistory;
