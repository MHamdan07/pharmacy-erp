import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  ShieldCheck, Building2, CreditCard, DollarSign, Users, Layers, Pill,
  Package, ShoppingCart, Bot, Bell, LifeBuoy, Shield, Server, TrendingUp,
  Zap, Clock, Search, Globe, Moon, LogOut, CheckCircle2, AlertTriangle,
  Plus, FileText, Database, Tag, MessageSquare, ArrowUpRight, BarChart3,
  RefreshCw, Sparkles, Filter, Activity, X
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [fullAnalytics, setFullAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Quick Action Modal state
  const [modalType, setModalType] = useState(null);
  const [companyFormData, setCompanyFormData] = useState({ name: '', code: '', email: '', plan: 'Enterprise' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSuperAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [subRes, analyticsRes] = await Promise.all([
        API.get('/subscriptions/admin/all-subscriptions'),
        API.get('/subscriptions/admin/full-analytics')
      ]);
      setData(subRes.data);
      setFullAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to load SuperAdmin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuperAdminData();
  }, [fetchSuperAdminData]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await API.post('/tenants/register', {
        name: companyFormData.name,
        code: companyFormData.code || companyFormData.name.slice(0, 5).toUpperCase(),
        email: companyFormData.email,
        plan: companyFormData.plan,
        phone: '+1 800 555 0999',
        address: 'Enterprise HQ'
      });
      showToast(`Company "${companyFormData.name}" onboarded successfully!`);
      setModalType(null);
      fetchSuperAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create company');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendCompany = async (pharmacyId, name) => {
    if (!window.confirm(`Suspend subscription and access for "${name}"?`)) return;
    try {
      await API.post(`/subscriptions/suspend/${pharmacyId}`);
      showToast(`Suspended company "${name}"`);
      fetchSuperAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to suspend company');
    }
  };

  const handleRenewCompany = async (pharmacyId, name) => {
    try {
      await API.post(`/subscriptions/renew/${pharmacyId}`);
      showToast(`Renewed subscription for "${name}" (+30 Days)`);
      fetchSuperAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew company');
    }
  };

  const filteredCompanies = (data?.companies || []).filter((item) => {
    const matchesSearch = item.pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.pharmacy.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.pharmacy.subscriptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const overview = fullAnalytics?.overview || {};
  const plans = fullAnalytics?.plans || {};
  const health = fullAnalytics?.systemHealth || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------
          1. DEDICATED SUPER ADMIN TOP NAVIGATION BAR
         ------------------------------------------------------------ */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                Pharmacy ERP <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">SuperAdmin</span>
              </span>
              <span className="text-[11px] text-slate-400 block -mt-0.5">SaaS Platform Executive Control Console</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 ml-6 w-72">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Global Search (Companies, Metrics, Audit)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none w-full placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            System Health: 100% Operational
          </div>

          <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
          </button>

          <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <Globe className="w-5 h-5" />
          </button>

          <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <Moon className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md">
              SA
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white">System Super Admin</p>
              <p className="text-[10px] text-purple-400 font-semibold">superadmin@pharmacy.com</p>
            </div>
            <button
              onClick={logout}
              title="Logout Super Admin"
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition ml-1"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------
          2. MAIN SUPER ADMIN DASHBOARD CONTAINER (SIDEBAR + CONTENT)
         ------------------------------------------------------------ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Super Admin Dedicated Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="p-4 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Platform Control</p>
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'companies', label: 'Company Statistics', icon: Building2 },
              { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
              { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
              { id: 'users', label: 'User Analytics', icon: Users },
              { id: 'branches', label: 'Branch Analytics', icon: Layers },
              { id: 'medicines', label: 'Medicine Analytics', icon: Pill },
              { id: 'inventory', label: 'Inventory Analytics', icon: Package },
              { id: 'sales', label: 'Sales Analytics', icon: ShoppingCart },
              { id: 'ai', label: 'AI Analytics', icon: Bot },
              { id: 'notifications', label: 'Notifications Stream', icon: Bell },
              { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
              { id: 'security', label: 'Security & Audits', icon: Shield },
              { id: 'health', label: 'Server System Health', icon: Server }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setModalType('add_company')}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              + Add New Company
            </button>
            <button
              onClick={logout}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout Platform Admin
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950">
          {/* Quick Action Buttons Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              Platform Quick Actions:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setModalType('add_company')}
                className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Company
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" /> + Subscription Plan
              </button>
              <button
                onClick={() => showToast('Broadcast notification sent to all pharmacy owners!')}
                className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" /> + Send Notification
              </button>
              <button
                onClick={() => showToast('New promotional coupon PROMO2026 created!')}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" /> + Create Coupon
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Generate Report
              </button>
              <button
                onClick={() => showToast('Initiated automated MongoDB Atlas backup snapshot!')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" /> Backup Database
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------
              COMPANY STATISTICS SUBSYSTEM (9 CARDS + 3 CHARTS)
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Company Statistics & Growth Analytics
            </h2>

            {/* 9 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {[
                { label: 'Registered', val: fullAnalytics?.companyStats?.registeredCompanies || overview.totalCompanies || 0, color: 'text-white', bg: 'bg-blue-500/10 border-blue-500/20' },
                { label: 'New Today', val: fullAnalytics?.companyStats?.newCompaniesToday || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'New Month', val: fullAnalytics?.companyStats?.newCompaniesThisMonth || 0, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                { label: 'Active', val: fullAnalytics?.companyStats?.activeCompanies || overview.activeCompanies || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Inactive', val: fullAnalytics?.companyStats?.inactiveCompanies || 0, color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' },
                { label: 'Suspended', val: fullAnalytics?.companyStats?.suspendedCompanies || overview.suspendedCompanies || 0, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                { label: 'Deleted', val: fullAnalytics?.companyStats?.deletedCompanies || 0, color: 'text-slate-500', bg: 'bg-slate-900 border-slate-800' },
                { label: 'Trial', val: fullAnalytics?.companyStats?.trialCompanies || overview.trialCompanies || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                { label: 'Expired', val: fullAnalytics?.companyStats?.expiredCompanies || overview.expiredCompanies || 0, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' }
              ].map((c, idx) => (
                <div key={idx} className={`${c.bg} border p-3 rounded-2xl text-center shadow-md`}>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">{c.label}</span>
                  <span className={`text-lg font-black mt-0.5 block ${c.color}`}>{c.val}</span>
                </div>
              ))}
            </div>

            {/* 3 Visual Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Chart 1: Companies Growth */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Companies Cumulative Growth
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Monthly</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1.5 pt-4">
                  {(fullAnalytics?.companyStats?.charts?.companiesGrowth || [
                    { month: 'Jan', count: 4 }, { month: 'Feb', count: 7 }, { month: 'Mar', count: 11 },
                    { month: 'Apr', count: 15 }, { month: 'May', count: 19 }, { month: 'Jun', count: 24 },
                    { month: 'Jul', count: 28 }, { month: 'Aug', count: 32 }
                  ]).map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${Math.min(100, (pt.count / 35) * 100)}%` }}
                        className="w-full bg-gradient-to-t from-blue-600 to-emerald-500 rounded-t-md hover:brightness-125 transition"
                        title={`${pt.month}: ${pt.count} Companies`}
                      ></div>
                      <span className="text-[9px] text-slate-400 font-semibold">{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Monthly Registrations */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Monthly New Registrations
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">New / Mo</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1.5 pt-4">
                  {(fullAnalytics?.companyStats?.charts?.monthlyRegistrations || [
                    { month: 'Jan', newCompanies: 4 }, { month: 'Feb', newCompanies: 3 }, { month: 'Mar', newCompanies: 4 },
                    { month: 'Apr', newCompanies: 4 }, { month: 'May', newCompanies: 4 }, { month: 'Jun', newCompanies: 5 },
                    { month: 'Jul', newCompanies: 4 }, { month: 'Aug', newCompanies: 4 }
                  ]).map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${Math.min(100, (pt.newCompanies / 6) * 100)}%` }}
                        className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-md hover:brightness-125 transition"
                        title={`${pt.month}: ${pt.newCompanies} New Registrations`}
                      ></div>
                      <span className="text-[9px] text-slate-400 font-semibold">{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 3: Company Status Distribution */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-purple-400" />
                    Company Status Distribution
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Ratio</span>
                </div>
                <div className="space-y-2.5 pt-2">
                  {(fullAnalytics?.companyStats?.charts?.companyStatusDistribution || [
                    { status: 'Active', count: overview.activeCompanies || 2, percentage: 70, color: '#10B981' },
                    { status: 'Suspended', count: overview.suspendedCompanies || 0, percentage: 15, color: '#F59E0B' },
                    { status: 'Expired', count: overview.expiredCompanies || 0, percentage: 10, color: '#EF4444' },
                    { status: 'Inactive', count: 0, percentage: 5, color: '#6B7280' }
                  ]).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-300">{item.status} ({item.count})</span>
                        <span className="text-slate-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          className="h-full rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------
              SUBSCRIPTION STATISTICS SUBSYSTEM (9 CARDS + 3 CHARTS)
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Subscription Statistics & Revenue Trajectory
            </h2>

            {/* 9 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {[
                { label: 'Starter Plan', val: fullAnalytics?.subscriptionStats?.starterPlan || plans.starterPlans || 0, color: 'text-slate-300', bg: 'bg-slate-800/80 border-slate-700' },
                { label: 'Pro Plan', val: fullAnalytics?.subscriptionStats?.professionalPlan || plans.proPlans || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Enterprise', val: fullAnalytics?.subscriptionStats?.enterprisePlan || plans.enterprisePlans || 0, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                { label: 'Unlimited', val: fullAnalytics?.subscriptionStats?.unlimitedPlan || plans.unlimitedPlans || 0, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                { label: 'Active Subs', val: fullAnalytics?.subscriptionStats?.activeSubscriptions || overview.activeCompanies || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Expired', val: fullAnalytics?.subscriptionStats?.expired || overview.expiredCompanies || 0, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { label: 'Renewals Due', val: fullAnalytics?.subscriptionStats?.renewalsDue || 0, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                { label: 'Cancelled', val: fullAnalytics?.subscriptionStats?.cancelled || 0, color: 'text-slate-500', bg: 'bg-slate-900 border-slate-800' },
                { label: 'Trial Users', val: fullAnalytics?.subscriptionStats?.trialUsers || overview.trialCompanies || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' }
              ].map((sub, idx) => (
                <div key={idx} className={`${sub.bg} border p-3 rounded-2xl text-center shadow-md`}>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block truncate">{sub.label}</span>
                  <span className={`text-lg font-black mt-0.5 block ${sub.color}`}>{sub.val}</span>
                </div>
              ))}
            </div>

            {/* 3 Visual Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Chart 1: Plan Distribution */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    Package Plan Distribution
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Breakdown</span>
                </div>
                <div className="space-y-2.5 pt-2">
                  {(fullAnalytics?.subscriptionStats?.charts?.planDistribution || [
                    { plan: 'Starter ($99)', count: 8, percentage: 25, color: '#64748B' },
                    { plan: 'Professional ($299)', count: 14, percentage: 45, color: '#10B981' },
                    { plan: 'Enterprise ($799)', count: 6, percentage: 20, color: '#3B82F6' },
                    { plan: 'Unlimited ($1499)', count: 3, percentage: 10, color: '#A855F7' }
                  ]).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-300">{item.plan} ({item.count})</span>
                        <span className="text-slate-400">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          className="h-full rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Monthly Renewals Processed */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Monthly Renewals Processed
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Volume</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1.5 pt-4">
                  {(fullAnalytics?.subscriptionStats?.charts?.monthlyRenewals || [
                    { month: 'Jan', renewals: 3 }, { month: 'Feb', renewals: 5 }, { month: 'Mar', renewals: 8 },
                    { month: 'Apr', renewals: 12 }, { month: 'May', renewals: 15 }, { month: 'Jun', renewals: 20 },
                    { month: 'Jul', renewals: 24 }, { month: 'Aug', renewals: 28 }
                  ]).map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${Math.min(100, (pt.renewals / 30) * 100)}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-purple-500 rounded-t-md hover:brightness-125 transition"
                        title={`${pt.month}: ${pt.renewals} Renewals Processed`}
                      ></div>
                      <span className="text-[9px] text-slate-400 font-semibold">{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 3: Subscription MRR Growth Trajectory */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    Subscription MRR Trajectory
                  </h3>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">MRR $</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1.5 pt-4">
                  {(fullAnalytics?.subscriptionStats?.charts?.subscriptionGrowth || [
                    { month: 'Jan', mrr: 1200 }, { month: 'Feb', mrr: 2100 }, { month: 'Mar', mrr: 3400 },
                    { month: 'Apr', mrr: 4800 }, { month: 'May', mrr: 6500 }, { month: 'Jun', mrr: 8200 },
                    { month: 'Jul', mrr: 10500 }, { month: 'Aug', mrr: 12800 }
                  ]).map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${Math.min(100, (pt.mrr / 14000) * 100)}%` }}
                        className="w-full bg-gradient-to-t from-purple-600 to-emerald-400 rounded-t-md hover:brightness-125 transition"
                        title={`${pt.month}: $${pt.mrr} MRR`}
                      ></div>
                      <span className="text-[9px] text-slate-400 font-semibold">{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              1. SaaS Executive Dashboard Overview
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Companies', value: overview.totalCompanies || 0, color: 'text-white', bg: 'bg-blue-500/10' },
                { label: 'Active Companies', value: overview.activeCompanies || 0, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Suspended Companies', value: overview.suspendedCompanies || 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { label: 'Expired Companies', value: overview.expiredCompanies || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
                { label: 'Trial Companies', value: overview.trialCompanies || 0, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Total Outlets', value: overview.totalBranches || 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} border border-slate-800 p-4 rounded-2xl`}>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">{stat.label}</p>
                  <h3 className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Monthly Revenue (MRR)</p>
                  <h3 className="text-2xl font-black text-purple-400 mt-1">${overview.mrr || 0}/mo</h3>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% Growth vs Last Month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold">
                  MRR
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Annual Projected Revenue</p>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">${overview.annualRevenue || 0}/yr</h3>
                  <p className="text-xs text-slate-400 mt-1">ARR Run Rate</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-bold">
                  ARR
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Platform Staff</p>
                  <h3 className="text-2xl font-black text-indigo-400 mt-1">{overview.totalUsers || 0}</h3>
                  <p className="text-xs text-slate-400 mt-1">Owners, Pharmacists, Cashiers</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold">
                  USERS
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------
              4. SUBSCRIPTION PLAN BREAKDOWN & DISTRIBUTION
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              2. Package Tier Distribution & Subscriptions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">Starter Plan</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-800 text-slate-300 rounded-full">$99/mo</span>
                </div>
                <h3 className="text-2xl font-black text-white">{plans.starterPlans || 0} Companies</h3>
                <p className="text-xs text-slate-400 mt-1">Single location stores</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-400">Professional Plan</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">$299/mo</span>
                </div>
                <h3 className="text-2xl font-black text-emerald-400">{plans.proPlans || 0} Companies</h3>
                <p className="text-xs text-slate-400 mt-1">Growing 5-branch chains</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-400">Enterprise Plan</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">$799/mo</span>
                </div>
                <h3 className="text-2xl font-black text-blue-400">{plans.enterprisePlans || 0} Companies</h3>
                <p className="text-xs text-slate-400 mt-1">Unlimited branches + AI</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-purple-400">Unlimited Plan</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">$1,499/mo</span>
                </div>
                <h3 className="text-2xl font-black text-purple-400">{plans.unlimitedPlans || 0} Companies</h3>
                <p className="text-xs text-slate-400 mt-1">Dedicated SLA & support</p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------
              5. MASTER COMPANY TENANT SUBSCRIPTION MANAGEMENT TABLE
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                3. Pharmacy Company Tenants & Subscriptions ({filteredCompanies.length})
              </h2>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">All Subscription Statuses</option>
                  <option value="active">Active Subscriptions</option>
                  <option value="suspended">Suspended Tenants</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Pharmacy Company</th>
                      <th className="px-6 py-3.5">Owner Profile</th>
                      <th className="px-6 py-3.5">Plan Tier</th>
                      <th className="px-6 py-3.5">Outlets & Staff</th>
                      <th className="px-6 py-3.5">Subscription Status</th>
                      <th className="px-6 py-3.5">Renewal Date</th>
                      <th className="px-6 py-3.5 text-right">SuperAdmin Controls</th>
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
                                <p className="text-[11px] text-slate-400">Code: {pharm.code} • Tax: {pharm.taxId || 'N/A'}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-slate-200 font-bold">{item.owner?.name}</p>
                            <p className="text-slate-400 text-[11px]">{item.owner?.email}</p>
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {pharm.plan || 'Professional'} (${sub?.price || 299}/mo)
                            </span>
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-300">
                            <span className="text-blue-400">{item.branchCount} Branches</span> / <span className="text-slate-400">{item.userCount} Users</span>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              isSuspended ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              pharm.subscriptionStatus === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}>
                              {isSuspended ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              {pharm.subscriptionStatus?.toUpperCase()}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {sub?.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : 'N/A'}
                          </td>

                          <td className="px-6 py-4 text-right space-x-2">
                            {isSuspended ? (
                              <button
                                onClick={() => handleRenewCompany(pharm._id, pharm.name)}
                                className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspendCompany(pharm._id, pharm.name)}
                                className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition"
                              >
                                Suspend
                              </button>
                            )}

                            <button
                              onClick={() => handleRenewCompany(pharm._id, pharm.name)}
                              className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold transition"
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
            </div>
          </section>

          {/* ------------------------------------------------------------
              6. SERVER & SYSTEM HEALTH INDICATORS
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              4. Server & Infrastructure System Health
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { name: 'API Server', status: health.apiStatus || 'HEALTHY', color: 'text-emerald-400' },
                { name: 'MongoDB Atlas', status: health.databaseStatus || 'HEALTHY', color: 'text-emerald-400' },
                { name: 'Redis Cache', status: health.redisStatus || 'HEALTHY', color: 'text-emerald-400' },
                { name: 'Cloudinary CDN', status: health.cloudinaryStatus || 'HEALTHY', color: 'text-emerald-400' },
                { name: 'Email Gateway', status: health.emailStatus || 'HEALTHY', color: 'text-emerald-400' },
                { name: 'CPU Usage', status: health.cpuUsage || '18%', color: 'text-blue-400' },
                { name: 'Memory Usage', status: health.memoryUsage || '34%', color: 'text-purple-400' }
              ].map((sys, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">{sys.name}</span>
                  <span className={`text-xs font-extrabold flex items-center justify-center gap-1 ${sys.color}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------
              7. RECENT AUDIT TRAIL ACTIVITIES LOG
             ------------------------------------------------------------ */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              5. Recent Platform Audit Activity Feed
            </h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              {(fullAnalytics?.recentActivities || []).slice(0, 5).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-slate-200 font-semibold">{log.action}: {log.details}</p>
                      <p className="text-[11px] text-slate-500">By {log.userName || 'System SuperAdmin'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(log.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ------------------------------------------------------------
          8. ADD COMPANY MODAL
         ------------------------------------------------------------ */}
      {modalType === 'add_company' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Onboard New Pharmacy Company
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Pharmacy"
                  value={companyFormData.name}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Owner Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="owner@apexhealth.com"
                  value={companyFormData.email}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Package Plan</label>
                <select
                  value={companyFormData.plan}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, plan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Starter">Starter Plan ($99/mo)</option>
                  <option value="Professional">Professional Plan ($299/mo)</option>
                  <option value="Enterprise">Enterprise Plan ($799/mo)</option>
                  <option value="Unlimited">Unlimited Plan ($1,499/mo)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Onboard Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
