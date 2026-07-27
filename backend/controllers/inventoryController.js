import Category from '../models/Category.js';
import Supplier from '../models/Supplier.js';
import Medicine from '../models/Medicine.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import PurchaseReceipt from '../models/PurchaseReceipt.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('category').populate('supplier').sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().populate('supplier').populate('items.medicine').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Purchase order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPurchaseReceipts = async (req, res) => {
  try {
    const receipts = await PurchaseReceipt.find().populate('purchaseOrder').populate('supplier').populate('items.medicine').sort({ createdAt: -1 });
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseReceipt = async (req, res) => {
  try {
    const receipt = await PurchaseReceipt.create(req.body);
    const purchaseOrder = await PurchaseOrder.findById(req.body.purchaseOrder);
    if (purchaseOrder) {
      purchaseOrder.status = 'received';
      await purchaseOrder.save();
    }

    for (const item of req.body.items) {
      const medicine = await Medicine.findById(item.medicine);
      if (medicine) {
        medicine.stockQty += item.quantityReceived;
        await medicine.save();
      }
    }

    res.status(201).json(receipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
