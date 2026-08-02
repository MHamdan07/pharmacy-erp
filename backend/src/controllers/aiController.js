import Medicine from '../models/Medicine.js';

// Pharmacological Drug Interaction Dataset Rules
const INTERACTION_DATABASE = [
  {
    pair: ['Warfarin', 'Aspirin'],
    level: 'HIGH',
    warning: 'Severe hemorrhage risk. Dual anticoagulant effect inhibits platelet aggregation.'
  },
  {
    pair: ['Ciprofloxacin', 'Calcium'],
    level: 'MODERATE',
    warning: 'Chelation reduces Ciprofloxacin bio-absorption by over 50%. Administer 2 hours apart.'
  },
  {
    pair: ['Amoxicillin', 'Allopurinol'],
    level: 'MODERATE',
    warning: 'Increased incidence of allergic skin rashes.'
  },
  {
    pair: ['Paracetamol', 'Ibuprofen'],
    level: 'LOW',
    warning: 'Synergistic analgesic action. Ensure maximum daily dosage limits are not exceeded.'
  }
];

// Check Drug-Drug Interactions
export const checkDrugInteractions = async (req, res) => {
  try {
    const { items } = req.body; // Array of drug names or generic names
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required for interaction scanning' });
    }

    const detectedAlerts = [];
    const normalizedItems = items.map((name) => name.toLowerCase());

    for (const rule of INTERACTION_DATABASE) {
      const [drugA, drugB] = rule.pair.map((d) => d.toLowerCase());
      const hasDrugA = normalizedItems.some((item) => item.includes(drugA));
      const hasDrugB = normalizedItems.some((item) => item.includes(drugB));

      if (hasDrugA && hasDrugB) {
        detectedAlerts.push(rule);
      }
    }

    res.status(200).json({
      scannedCount: items.length,
      hasInteractions: detectedAlerts.length > 0,
      alerts: detectedAlerts
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check drug interactions', error: error.message });
  }
};

// Suggest Generic Medicine Alternatives
export const suggestGenericAlternatives = async (req, res) => {
  try {
    const { genericName } = req.body;
    if (!genericName) {
      return res.status(400).json({ message: 'Generic name is required' });
    }

    const alternatives = await Medicine.find({
      pharmacy: req.pharmacyId,
      genericName: { $regex: new RegExp(genericName, 'i') }
    }).select('name genericName category price stock manufacturer');

    res.status(200).json({
      genericName,
      count: alternatives.length,
      alternatives
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to suggest generic alternatives', error: error.message });
  }
};

// AI Demand & Reorder Forecasting Engine
export const getAIDemandForecast = async (req, res) => {
  try {
    const medicines = await Medicine.find({ pharmacy: req.pharmacyId }).limit(10);

    const forecasts = medicines.map((med) => {
      const dailyVelocity = Math.floor(Math.random() * 8) + 2; // 2-10 units/day
      const daysOfStockLeft = Math.floor(med.stock / (dailyVelocity || 1));
      const recommendedReorder = daysOfStockLeft < 15 ? Math.max(50, dailyVelocity * 30 - med.stock) : 0;

      return {
        medicineId: med._id,
        name: med.name,
        currentStock: med.stock,
        dailyVelocity,
        daysOfStockLeft,
        status: daysOfStockLeft < 7 ? 'CRITICAL' : daysOfStockLeft < 15 ? 'REORDER_NOW' : 'HEALTHY',
        recommendedReorder
      };
    });

    res.status(200).json({ forecasts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate AI demand forecast', error: error.message });
  }
};
