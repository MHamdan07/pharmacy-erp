import Sale from '../models/Sale.js';
import Batch from '../models/Batch.js';
import Medicine from '../models/Medicine.js';
import Branch from '../models/Branch.js';
import Supplier from '../models/Supplier.js';
import Customer from '../models/Customer.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;
    const branchId = req.branchId;

    const baseFilter = { pharmacy: pharmacyId };
    const branchFilter = { pharmacy: pharmacyId };
    if (branchId) branchFilter.branch = branchId;

    // --- 1. Real-time KPIs ---
    const totalMedicines = await Medicine.countDocuments(baseFilter);
    const activeMedicines = await Medicine.countDocuments({ ...baseFilter, status: 'active' });

    // Batches & Medicines for Stock Calculations
    const allMedicines = await Medicine.find(baseFilter).populate('category');
    const allBatches = await Batch.find(branchFilter);

    // Attach stock qty to medicines
    const medicineStockMap = allMedicines.map(med => {
      const medBatches = allBatches.filter(b => b.medicine.toString() === med._id.toString());
      const totalStock = medBatches.reduce((acc, b) => acc + (b.status === 'active' ? b.quantity : 0), 0);
      return {
        ...med.toObject(),
        stockQty: totalStock
      };
    });

    const lowStockCount = medicineStockMap.filter(m => m.stockQty > 0 && m.stockQty <= (m.reorderLevel || 10)).length;
    const outOfStockCount = medicineStockMap.filter(m => m.stockQty === 0).length;

    // Expiry KPIs
    const now = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(sixtyDaysLater.getDate() + 60);

    const expiredMedicinesCount = allBatches.filter(b => b.quantity > 0 && new Date(b.expiryDate) < now).length;
    const expiringSoonCount = allBatches.filter(
      b => b.quantity > 0 && new Date(b.expiryDate) >= now && new Date(b.expiryDate) <= sixtyDaysLater
    ).length;

    // Sales & Revenue & Profit KPIs
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesTodayList = await Sale.find({
      ...branchFilter,
      createdAt: { $gte: startOfToday },
      status: 'completed'
    });
    const todaySales = salesTodayList.reduce((acc, s) => acc + s.grandTotal, 0);

    const salesMonthList = await Sale.find({
      ...branchFilter,
      createdAt: { $gte: startOfMonth },
      status: 'completed'
    });
    const monthlySales = salesMonthList.reduce((acc, s) => acc + s.grandTotal, 0);

    // Calculate Net Profit across all sales
    const allCompletedSales = await Sale.find({ ...branchFilter, status: 'completed' });
    let totalRevenue = 0;
    let totalCost = 0;

    for (const sale of allCompletedSales) {
      totalRevenue += sale.grandTotal;
      for (const item of sale.items) {
        // Approximate cost if available or batch cost
        const itemCost = (item.unitPrice * 0.6) * item.quantity; // 40% margin estimate or batch cost
        totalCost += itemCost;
      }
    }
    const totalProfit = Math.max(0, totalRevenue - totalCost);

    // Pending Payments & Supplier Dues
    const customers = await Customer.find(baseFilter);
    const pendingPayments = customers.reduce((acc, c) => acc + (c.creditBalance || 0), 0);

    const suppliers = await Supplier.find(baseFilter);
    const supplierDues = suppliers.reduce((acc, s) => acc + (s.balancePayable || 0), 0);

    // Recent Activities (Audit Stream) - Fetch 50 entries for scrollbar stream
    const recentActivities = await AuditLog.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(50);

    // Branch Comparison
    const branches = await Branch.find(baseFilter);
    const branchComparison = [];
    for (const br of branches) {
      const brSales = await Sale.find({ pharmacy: pharmacyId, branch: br._id, status: 'completed' });
      const rev = brSales.reduce((acc, s) => acc + s.grandTotal, 0);
      branchComparison.push({
        branchName: br.name,
        branchCode: br.code,
        salesCount: brSales.length,
        totalRevenue: rev
      });
    }

    // Top Selling & Least Selling Medicines
    const medicineSalesCounter = {};
    for (const sale of allCompletedSales) {
      for (const item of sale.items) {
        const medName = item.medicineName || 'Unknown';
        medicineSalesCounter[medName] = (medicineSalesCounter[medName] || 0) + item.quantity;
      }
    }

    const sortedMedSales = Object.entries(medicineSalesCounter)
      .map(([name, qty]) => ({ name, quantitySold: qty }))
      .sort((a, b) => b.quantitySold - a.quantitySold);

    const topSellingMedicines = sortedMedSales.slice(0, 5);

    // Combine all medicines for least selling
    const allMedNames = medicineStockMap.map(m => m.name);
    const leastSellingMap = allMedNames.map(name => ({
      name,
      quantitySold: medicineSalesCounter[name] || 0
    })).sort((a, b) => a.quantitySold - b.quantitySold);

    const leastSellingMedicines = leastSellingMap.slice(0, 5);

    // --- 2. Chart Data Generation ---

    // Daily Sales (Last 7 Days)
    const dailySalesChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const daySales = allCompletedSales.filter(s => s.createdAt >= dayStart && s.createdAt <= dayEnd);
      const rev = daySales.reduce((acc, s) => acc + s.grandTotal, 0);
      const prof = rev * 0.35; // 35% net profit margin

      const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short' });
      dailySalesChart.push({
        day: dayName,
        date: dayStart.toISOString().slice(5, 10),
        salesCount: daySales.length,
        revenue: Math.round(rev),
        profit: Math.round(prof)
      });
    }

    // Monthly Sales (Last 6 Months)
    const monthlySalesChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const mSales = allCompletedSales.filter(s => s.createdAt >= monthStart && s.createdAt <= monthEnd);
      const rev = mSales.reduce((acc, s) => acc + s.grandTotal, 0);
      const prof = rev * 0.35;

      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      monthlySalesChart.push({
        month: monthName,
        revenue: Math.round(rev),
        profit: Math.round(prof),
        count: mSales.length
      });
    }

    // Stock Trends / Status Breakdown
    const healthyStockCount = Math.max(0, activeMedicines - lowStockCount - outOfStockCount);
    const stockTrendsChart = [
      { status: 'Healthy Stock', count: healthyStockCount, color: '#10B981' },
      { status: 'Low Stock Alert', count: lowStockCount, color: '#F59E0B' },
      { status: 'Out of Stock', count: outOfStockCount, color: '#EF4444' },
      { status: 'Expired Batches', count: expiredMedicinesCount, color: '#8B5CF6' }
    ];

    // Category Distribution
    const categoriesMap = {};
    for (const med of medicineStockMap) {
      const catName = med.category?.name || 'General';
      categoriesMap[catName] = (categoriesMap[catName] || 0) + 1;
    }

    const categoryDistributionChart = Object.entries(categoriesMap).map(([category, count]) => ({
      category,
      count
    }));

    res.json({
      // KPIs
      totalMedicines,
      activeMedicines,
      lowStockCount,
      outOfStockCount,
      expiredMedicinesCount,
      expiringSoonCount,
      todaySales,
      monthlySales,
      totalProfit,
      pendingPayments,
      supplierDues,

      // Activity Stream & Branch Comparison
      recentActivities,
      branchComparison,
      topSellingMedicines,
      leastSellingMedicines,

      // Chart Datasets
      dailySalesChart,
      monthlySalesChart,
      stockTrendsChart,
      categoryDistributionChart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ pharmacy: req.pharmacyId })
      .populate('branch', 'name code')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
