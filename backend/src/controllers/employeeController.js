import Employee from '../models/Employee.js';

export const getEmployees = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.user?.pharmacy;
    const employees = await Employee.find({ pharmacy: pharmacyId }).sort({ createdAt: -1 });

    const totalStaff = employees.length;
    const activeStaff = employees.filter(e => e.isActive).length;
    const morningShift = employees.filter(e => e.shift === 'Morning').length;

    res.json({
      employees,
      stats: { totalStaff, activeStaff, morningShift }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees: ' + err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId || req.user?.pharmacy;
    const { name, email, phone, role, shift, salary, branch } = req.body;

    const employee = await Employee.create({
      pharmacy: pharmacyId,
      branch: branch || req.user?.branch,
      name,
      email,
      phone,
      role,
      shift,
      salary: salary || 0
    });

    res.status(201).json({ message: 'Employee added successfully', employee });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add employee: ' + err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Employee updated', employee: updated });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update employee: ' + err.message });
  }
};
