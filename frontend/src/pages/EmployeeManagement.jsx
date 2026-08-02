import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { Users, UserPlus, Clock, ShieldCheck, Search, Building2, CheckCircle2, User } from 'lucide-react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ totalStaff: 0, activeStaff: 0, morningShift: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cashier',
    shift: 'Morning',
    salary: 2500
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/employees');
      setEmployees(res.data.employees || []);
      setStats(res.data.stats || { totalStaff: 0, activeStaff: 0, morningShift: 0 });
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employees', formData);
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', role: 'Cashier', shift: 'Morning', salary: 2500 });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            25 Employee Management & Staff Shift Operations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage pharmacy staff roster, shift schedules, roles, and branch assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg transition"
        >
          <UserPlus className="w-4 h-4" />
          Add New Staff
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Staff Roster</p>
            <p className="text-2xl font-bold text-white">{stats.totalStaff}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Active Staff</p>
            <p className="text-2xl font-bold text-white">{stats.activeStaff}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Morning Shift Staff</p>
            <p className="text-2xl font-bold text-white">{stats.morningShift}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search employees by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <th className="p-4">Employee Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Shift Schedule</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Loading employee roster...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p className="text-[10px] text-slate-400">{emp.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-semibold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 flex items-center gap-1.5 mt-2">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {emp.shift}
                    </td>
                    <td className="p-4 text-slate-400">{emp.phone || 'N/A'}</td>
                    <td className="p-4 font-semibold text-emerald-400">${emp.salary}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Add New Staff Member
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Manager">Manager</option>
                    <option value="Inventory Staff">Inventory Staff</option>
                    <option value="Delivery Staff">Delivery Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-500 font-semibold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
