import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { Users, Plus, Phone, Award, FileText, Edit, Trash2, Search, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CustomersPatients = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: 30,
    gender: 'unspecified',
    address: '',
    allergies: '',
    medicalNotes: '',
    loyaltyPoints: 0
  });

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await API.get('/customers/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setForm({
      name: '',
      phone: '',
      email: '',
      age: 30,
      gender: 'unspecified',
      address: '',
      allergies: '',
      medicalNotes: '',
      loyaltyPoints: 0
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      age: customer.age !== undefined && customer.age !== null ? customer.age : 30,
      gender: customer.gender || 'unspecified',
      address: customer.address || '',
      allergies: Array.isArray(customer.allergies) ? customer.allergies.join(', ') : (customer.allergies || ''),
      medicalNotes: customer.medicalNotes || '',
      loyaltyPoints: customer.loyaltyPoints || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        age: Number(form.age) || 0,
        allergies: typeof form.allergies === 'string' ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : form.allergies
      };

      if (editingCustomer) {
        await API.put(`/customers/customers/${editingCustomer._id}`, payload);
        showToast(`Patient profile "${form.name}" updated successfully!`);
      } else {
        await API.post('/customers/customers', payload);
        showToast(`Patient profile "${form.name}" created successfully!`);
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save patient profile');
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete patient profile "${customer.name}"?`)) return;
    try {
      await API.delete(`/customers/customers/${customer._id}`);
      showToast(`Deleted patient profile "${customer.name}"`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer profile');
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Patients & Client Directory
          </h1>
          <p className="text-xs text-slate-400">Track patient profiles, loyalty rewards, medical history, and dosage notes</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" /> Add Patient Profile
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by Patient Name, Phone Number, or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Patient Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4 text-center">Loyalty Points</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((c) => {
                const ageText = (c.age !== undefined && c.age !== null && c.age !== '') ? `${c.age} yrs` : 'N/A';
                return (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>
                        <p>{c.name}</p>
                        {c.email && <p className="text-[10px] text-slate-400 font-normal">{c.email}</p>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-400">{c.phone}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {ageText} / <span className="capitalize">{c.gender || 'unspecified'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      {c.loyaltyPoints || 0} pts
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg font-semibold text-xs transition cursor-pointer"
                        title="Edit Patient Profile"
                      >
                        <Edit className="w-3.5 h-3.5 inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold text-xs transition cursor-pointer"
                        title="Delete Patient Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                    No matching patient profiles found. Click "+ Add Patient Profile" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                {editingCustomer ? 'Edit Patient Profile' : 'Create Patient Profile'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555 9988"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="30"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unspecified">Unspecified</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Loyalty Points</label>
                  <input
                    type="number"
                    min="0"
                    value={form.loyaltyPoints}
                    onChange={(e) => setForm({ ...form, loyaltyPoints: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Known Drug Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Aspirin, Sulfa drugs"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase text-[10px] mb-1">Medical Notes & Special Instructions</label>
                <textarea
                  rows={2}
                  value={form.medicalNotes}
                  onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
                  placeholder="Patient dosage sensitivities, chronic conditions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl cursor-pointer transition shadow-md"
                >
                  {editingCustomer ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPatients;
