import Customer from '../models/Customer.js';
import Sale from '../models/Sale.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ pharmacy: req.pharmacyId }).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      pharmacy: req.pharmacyId
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerHistory = async (req, res) => {
  try {
    const sales = await Sale.find({ pharmacy: req.pharmacyId, customer: req.params.id })
      .populate('branch', 'name code')
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
