import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Building2, UserPlus, Shield, Store, Plus, Check, Edit, Trash2, ShieldAlert, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const BranchUserManagement = () => {
  const { user } = useAuth();
  const isCompanyOwner = user?.role === 'Owner';
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Edit Branch State
  const [editingBranch, setEditingBranch] = useState(null);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [editBranchForm, setEditBranchForm] = useState({
    name: '',
    code: '',
    phone: '',
    address: '',
    receiptHeader: '',
    receiptFooter: ''
  });

  // Edit Staff State
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    email: '',
    role: 'Pharmacist',
    branchId: '',
    isActive: true
  });

  // New Branch Form
  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    phone: '',
    address: '',
    receiptHeader: 'Thank you for visiting!',
    receiptFooter: 'Get well soon!'
  });

  // New Staff User Form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'Pharmacist',
    phone: '',
    branchId: ''
  });

  const fetchBranches = useCallback(async () => {
    try {
      const res = await API.get('/tenants/branches');
      setBranches(res.data || []);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await API.get('/subscriptions/my-subscription');
      if (res.data) setSubscription(res.data.subscription || {});
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
    }
  }, []);

  useEffect(() => {
    if (isCompanyOwner) {
      fetchBranches();
      fetchUsers();
      fetchSubscription();
    }
  }, [isCompanyOwner, fetchBranches, fetchUsers, fetchSubscription]);

  if (!isCompanyOwner) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12 shadow-2xl space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Restricted to Company Owner</h2>
        <p className="text-xs text-slate-400">
          Multi-branch store administration and staff management can only be accessed by the Company Owner.
        </p>
      </div>
    );
  }

  const planMaxBranches = subscription?.planName === 'Starter' ? 1 : subscription?.planName === 'Enterprise' ? 10 : 3;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            Branch Stores & Staff Role Administration
          </h1>
          <p className="text-xs text-slate-400">
            Current Plan: <span className="text-blue-400 font-bold">{subscription?.planName || 'Professional'}</span> ({branches.length} / {planMaxBranches} Branches Used)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {branches.length >= planMaxBranches ? (
            <Link
              to="/settings/subscription"
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Upgrade Plan to Add Branch
            </Link>
          ) : (
            <button
              onClick={() => setShowBranchModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Branch Location
            </button>
          )}
          <button
            onClick={() => setShowUserModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Invite Staff Member
          </button>
        </div>
      </div>

      {/* Branch Stores Grid with EDIT & DELETE ACTIONS */}
      <div>
        <h2 className="text-md font-bold text-white mb-3">Onboarded Branch Stores ({branches.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div key={b._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="font-bold text-white text-md truncate max-w-[150px]">{b.name}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-800 text-blue-400 border border-slate-700 font-mono font-bold px-2 py-0.5 rounded text-xs">
                    {b.code}
                  </span>
                  <button
                    onClick={() => handleOpenEditBranch(b)}
                    className="p-1.5 text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700/60"
                    title="Edit Branch Store"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {!b.isHeadquarter && (
                    <button
                      onClick={() => handleDeleteBranch(b._id, b.name)}
                      className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-all border border-slate-700/60"
                      title="Delete Branch Store"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div>Phone: {b.phone || 'N/A'}</div>
                <div className="truncate">Address: {b.address || 'N/A'}</div>
                {b.isHeadquarter && (
                  <div className="text-amber-400 font-bold text-[10px]">★ Main Headquarter</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-md font-bold text-white mb-4">Staff Members & Assigned Roles ({users.length})</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Assigned Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-blue-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{u.branch?.name || 'All Branches'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.isActive !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEditUser(u)}
                      className="p-1.5 text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center gap-1 ml-auto font-semibold border border-slate-700/60"
                      title="Edit Staff Member Values"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD BRANCH */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Onboard New Branch Store</h2>

            <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="HealthCare Downtown Branch"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400">Branch Code (Unique) *</label>
                <input
                  type="text"
                  required
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
                  placeholder="BR-02"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">Phone *</label>
                  <input
                    type="text"
                    required
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    placeholder="+1 555 0199"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Address *</label>
                  <input
                    type="text"
                    required
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    placeholder="Downtown Plaza"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  Create Branch
                </button>
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT & DELETE BRANCH STORE */}
      {showEditBranchModal && editingBranch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                Edit Branch Store Details
              </h2>
              {!editingBranch.isHeadquarter && (
                <button
                  type="button"
                  onClick={() => handleDeleteBranch(editingBranch._id, editingBranch.name)}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>

            <form onSubmit={handleSaveEditBranch} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={editBranchForm.name}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400">Branch Code *</label>
                <input
                  type="text"
                  required
                  value={editBranchForm.code}
                  onChange={(e) => setEditBranchForm({ ...editBranchForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">Phone *</label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.phone}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Address *</label>
                  <input
                    type="text"
                    required
                    value={editBranchForm.address}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  Update Branch Values
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditBranchModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVITE STAFF */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Invite New Staff Member</h2>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Dr. Alex Rivera"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="alex@pharmacy.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">System Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Branch Manager">Branch Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400">Assign Branch</label>
                  <select
                    value={userForm.branchId}
                    onChange={(e) => setUserForm({ ...userForm, branchId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT STAFF MEMBER */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-400" />
              Edit Staff Member Details
            </h2>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400">System Role</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-bold"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Branch Manager">Branch Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400">Assign Branch</label>
                  <select
                    value={editUserForm.branchId}
                    onChange={(e) => setEditUserForm({ ...editUserForm, branchId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400">Account Status</label>
                <select
                  value={editUserForm.isActive ? 'true' : 'false'}
                  onChange={(e) => setEditUserForm({ ...editUserForm, isActive: e.target.value === 'true' })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-bold"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive / Suspended</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                >
                  Update Staff Values
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BranchUserManagement;
