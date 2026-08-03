import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  Building2, Users, DollarSign, ShieldAlert, CheckCircle2, XCircle,
  AlertTriangle, RefreshCw, Layers, Sparkles, TrendingUp, Search, Filter, ShieldCheck
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Change Plan Modal State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newPlan, setNewPlan] = useState('Enterprise');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/subscriptions/admin/all-subscriptions');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tenant subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSuspend = async (pharmacyId, companyName) => {
    if (!window.confirm(`Are you sure you want to suspend "${companyName}"?`)) return;
    try {
      setActionLoading(true);
      await API.post(`/subscriptions/suspend/${pharmacyId}`);
      showToast(`Suspended subscription for ${companyName}`);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to suspend company');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenew = async (pharmacyId, companyName) => {
    try {
      setActionLoading(true);
      await API.post(`/subscriptions/renew/${pharmacyId}`);
      showToast(`Renewed subscription for ${companyName} for +30 days`);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedCompany) return;
    try {
      setActionLoading(true);
      await API.post(`/subscriptions/change-plan/${selectedCompany.pharmacy._id}`, {
        planName: newPlan
      });
      showToast(`Updated plan for ${selectedCompany.pharmacy.name} to ${newPlan}`);
      setSelectedCompany(null);
      fetchSubscriptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update plan');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCompanies = (data?.companies || []).filter((item) => {
    const matchesSearch = item.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.pharmacy.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.pharmacy.subscriptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (user?.role !== 'SuperAdmin') {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto mt-12">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">SuperAdmin Access Required</h2>
        <p className="text-slate-400 text-sm">
          You must be logged in as a Platform SuperAdmin to access the Subscription Control Panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-900/60 via-slate-900 to-blue-900/60 border border-purple-500/20 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest">
              Platform Admin
            </span>
            <span className="text-xs text-slate-400">SaaS Multi-Company Control</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
            SuperAdmin Subscription Management Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage company tenant accounts, package tiers, MRR analytics, and subscription lifecycles.
          </p>
        </div>
        <button
          onClick={fetchSubscriptions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh SaaS Stats
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Companies</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{data?.summary?.totalCompanies || 0}</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Registered Tenants
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Subscriptions</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{data?.summary?.activeCompanies || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Paying Pharmacy Chains</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Suspended Tenants</p>
            <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{data?.summary?.suspendedCompanies || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Access Locked</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Recurring (MRR)</p>
            <h3 className="text-2xl font-extrabold text-purple-400 mt-1">${data?.summary?.mrr || 0}/mo</h3>
            <p className="text-xs text-purple-300 mt-1">Platform SaaS Revenue</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search company, code or owner email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Subscription Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Companies & Subscription Master Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Registered Pharmacy Companies ({filteredCompanies.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
            <span>Loading SaaS Tenant Subscriptions...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No pharmacy companies matched your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Company & Code</th>
                  <th className="px-6 py-3">Owner Contact</th>
                  <th className="px-6 py-3">Package Plan</th>
                  <th className="px-6 py-3">Outlets / Users</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Renewal Date</th>
                  <th className="px-6 py-3 text-right">SuperAdmin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCompanies.map((item) => {
                  const pharm = item.pharmacy;
                  const sub = item.subscription;
                  const isSuspended = pharm.subscriptionStatus === 'suspended';

                  return (
                    <tr key={pharm._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold text-xs shrink-0">
                            {pharm.code?.slice(0, 3) || 'ERP'}
                          </div>
                          <div>
                            <p className="text-white font-bold">{pharm.name}</p>
                            <p className="text-xs text-slate-400">{pharm.code} • NTN: {pharm.taxId || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <p className="text-slate-200 font-semibold">{item.owner?.name}</p>
                        <p className="text-slate-400">{item.owner?.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          pharm.plan === 'Unlimited' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          pharm.plan === 'Enterprise' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          pharm.plan === 'Professional' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          {pharm.plan || 'Professional'} (${sub?.price || 299}/mo)
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">
                        <span className="text-blue-400">{item.branchCount} Branches</span> / <span className="text-slate-400">{item.userCount} Staff</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isSuspended ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          pharm.subscriptionStatus === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {isSuspended ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {pharm.subscriptionStatus?.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        {sub?.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCompany(item);
                            setNewPlan(pharm.plan || 'Enterprise');
                          }}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition"
                        >
                          Change Plan
                        </button>

                        {isSuspended ? (
                          <button
                            onClick={() => handleRenew(pharm._id, pharm.name)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(pharm._id, pharm.name)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition"
                          >
                            Suspend
                          </button>
                        )}

                        <button
                          onClick={() => handleRenew(pharm._id, pharm.name)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold transition"
                        >
                          +30 Days
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Change Plan Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Change SaaS Plan
              </h3>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Updating subscription package tier for <strong className="text-white">{selectedCompany.pharmacy.name}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Package Tier
              </label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Starter">Starter Plan ($99/mo - 1 Branch)</option>
                <option value="Professional">Professional Plan ($299/mo - 5 Branches)</option>
                <option value="Enterprise">Enterprise Plan ($799/mo - Unlimited Branches + AI)</option>
                <option value="Unlimited">Unlimited Plan ($1,499/mo - Dedicated Support)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setSelectedCompany(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePlan}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 transition flex justify-center items-center gap-2"
              >
                {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
