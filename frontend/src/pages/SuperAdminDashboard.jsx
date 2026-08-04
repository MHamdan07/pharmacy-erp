import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck, Building2, CreditCard, DollarSign, Users, Layers, Pill,
  Package, ShoppingCart, Bot, Bell, LifeBuoy, Shield, Server, TrendingUp,
  Zap, Clock, Search, Moon, Sun, LogOut, CheckCircle2, AlertTriangle,
  Plus, FileText, Database, Tag, BarChart3, PieChart,
  RefreshCw, Activity, X, Check, Lock, ShieldAlert,
  FileSpreadsheet, Download, Sliders, ChevronRight, Edit3, Trash2, Eye,
  Filter, Mail, Globe, Receipt, HelpCircle, UserCheck, Percent
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [fullAnalytics, setFullAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [themeMode, setThemeMode] = useState('dark');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Quick Action & CRUD Modals
  const [modalType, setModalType] = useState(null); // 'add_company' | 'company_detail' | 'edit_plan' | 'add_coupon' | 'ticket_detail' | 'assign_role' | 'add_category' | 'add_branch'
  const [selectedItem, setSelectedItem] = useState(null);
  const [companyFormData, setCompanyFormData] = useState({ name: '', code: '', email: '', plan: 'Enterprise' });
  const [couponFormData, setCouponFormData] = useState({ code: '', discountPercent: 15, maxUses: 100, expiryDays: 30 });
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [branchFormData, setBranchFormData] = useState({ name: '', code: '', managerName: '', type: 'Branch' });
  const [planFormData, setPlanFormData] = useState({ name: '', price: 299, maxBranches: 5, maxUsers: 20 });
  const [notificationMsg, setNotificationMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Mock State Lists for Super Admin Modules
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'PROMO2026', discountPercent: 20, expiryDate: '2026-12-31', maxUses: 500, usedCount: 42, status: 'active' },
    { id: '2', code: 'LAUNCH50', discountPercent: 50, expiryDate: '2026-09-30', maxUses: 100, usedCount: 88, status: 'active' },
    { id: '3', code: 'WELCOME10', discountPercent: 10, expiryDate: '2026-06-30', maxUses: 1000, usedCount: 1000, status: 'expired' }
  ]);

  const [categories, setCategories] = useState([
    { id: '1', name: 'Tablets & Capsules', description: 'Oral solid dosage medications', count: 240 },
    { id: '2', name: 'Syrups & Suspensions', description: 'Liquid pediatric and adult formulations', count: 110 },
    { id: '3', name: 'Injections & Vaccines', description: 'Sterile injectable pharmaceuticals', count: 85 },
    { id: '4', name: 'Eye & Ear Drops', description: 'Ophthalmic and otic drops', count: 45 },
    { id: '5', name: 'Surgical & Bandages', description: 'Dressings, gloves, and surgical tools', count: 160 }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', company: 'HealthCare Plus Pharmacy', plan: 'Enterprise', amount: 799, status: 'paid', date: '2026-08-01', method: 'Credit Card' },
    { id: 'INV-2026-002', company: 'MedixCare Store', plan: 'Professional', amount: 299, status: 'paid', date: '2026-07-28', method: 'Bank Transfer' },
    { id: 'INV-2026-003', company: 'Apex Pharma Outlet', plan: 'Starter', amount: 99, status: 'pending', date: '2026-08-03', method: 'Offline Request' },
    { id: 'INV-2026-004', company: 'CareMed Hospital Chain', plan: 'Unlimited', amount: 1499, status: 'overdue', date: '2026-07-15', method: 'Credit Card' }
  ]);

  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-801', company: 'HealthCare Plus', subject: 'Custom Invoice Template Query', priority: 'High', status: 'Open', createdAt: '2026-08-03 10:30' },
    { id: 'TKT-802', company: 'MedixCare Store', subject: 'Barcode Printer Driver Setup', priority: 'Medium', status: 'In Progress', createdAt: '2026-08-02 14:15' },
    { id: 'TKT-803', company: 'Apex Pharma', subject: 'AI Prescription OCR Calibration', priority: 'Low', status: 'Resolved', createdAt: '2026-08-01 09:00' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-901', action: 'Company Onboarded', details: 'Registered Apex Health Pharmacy (Enterprise Plan)', user: 'SuperAdmin', ip: '192.168.1.1', timestamp: '2026-08-03 18:20' },
    { id: 'LOG-902', action: 'Subscription Renewed', details: 'Extended MedixCare Store (+30 Days)', user: 'SuperAdmin', ip: '192.168.1.1', timestamp: '2026-08-03 16:45' },
    { id: 'LOG-903', action: 'Plan Modified', details: 'Updated Professional Plan price to $299/mo', user: 'SuperAdmin', ip: '192.168.1.1', timestamp: '2026-08-02 11:10' },
    { id: 'LOG-904', action: 'Coupon Created', details: 'Created promo code PROMO2026 (20% Off)', user: 'SuperAdmin', ip: '192.168.1.1', timestamp: '2026-08-01 15:30' }
  ]);

  const [platformSettings, setPlatformSettings] = useState({
    appName: 'Pharmacy ERP SaaS',
    supportEmail: 'support@pharmacyerp.com',
    contactPhone: '+1 800 555 0199',
    currency: 'USD ($)',
    pkExchangeRate: '278.50',
    eurExchangeRate: '0.92',
    defaultLanguage: 'English (US)',
    timezone: 'UTC+05:00 (Asia/Karachi)',
    taxRate: 5,
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587
  });

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
      setCompanyFormData({ name: '', code: '', email: '', plan: 'Enterprise' });
      fetchSuperAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create company');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: String(Date.now()),
      code: couponFormData.code.toUpperCase(),
      discountPercent: Number(couponFormData.discountPercent),
      maxUses: Number(couponFormData.maxUses),
      usedCount: 0,
      expiryDate: new Date(Date.now() + couponFormData.expiryDays * 86400000).toISOString().split('T')[0],
      status: 'active'
    };
    setCoupons([newCoupon, ...coupons]);
    showToast(`Promotional Coupon "${newCoupon.code}" created successfully!`);
    setModalType(null);
    setCouponFormData({ code: '', discountPercent: 15, maxUses: 100, expiryDays: 30 });
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const newCat = {
      id: String(Date.now()),
      name: categoryFormData.name,
      description: categoryFormData.description,
      count: 0
    };
    setCategories([...categories, newCat]);
    showToast(`Medicine Category "${newCat.name}" added to global catalog!`);
    setModalType(null);
    setCategoryFormData({ name: '', description: '' });
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    showToast(`Broadcast notification sent to all pharmacy tenant owners!`);
    setModalType(null);
    setNotificationMsg('');
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

  const handleApproveInvoice = (invId) => {
    setInvoices(invoices.map(i => i.id === invId ? { ...i, status: 'paid' } : i));
    showToast(`Approved offline payment for Invoice #${invId}`);
  };

  const handleResolveTicket = (tktId) => {
    setSupportTickets(supportTickets.map(t => t.id === tktId ? { ...t, status: 'Resolved' } : t));
    showToast(`Ticket #${tktId} marked as Resolved`);
    setModalType(null);
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

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
    showToast(`Switched workspace theme mode to ${nextTheme.toUpperCase()}`);
  };

  // 12 Super Admin Sidebar Link Definitions
  const navTabs = [
    { id: 'dashboard', label: t('dashboardOverview', 'Dashboard Overview'), icon: BarChart3 },
    { id: 'companies', label: t('companyStatistics', 'Companies'), icon: Building2, badge: data?.companies?.length || 2 },
    { id: 'subscriptions', label: t('subscriptionPlans', 'Subscription Plans'), icon: CreditCard },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'branches', label: t('branchAnalytics', 'Branches'), icon: Layers },
    { id: 'users', label: t('userAnalytics', 'Users & Roles (RBAC)'), icon: Users },
    { id: 'catalog', label: 'Global Catalog & Categories', icon: Pill },
    { id: 'coupons', label: 'Coupons & Promos', icon: Percent },
    { id: 'reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
    { id: 'support', label: t('supportTickets', 'Support Tickets'), icon: LifeBuoy, badge: supportTickets.filter(t => t.status === 'Open').length },
    { id: 'settings', label: t('settings', 'Platform Settings'), icon: Sliders },
    { id: 'audit', label: t('securityAudits', 'Audit Logs'), icon: ShieldCheck }
  ];

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-sans antialiased`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------
          1. DEDICATED SUPER ADMIN TOP NAVIGATION BAR & BREADCRUMB
         ------------------------------------------------------------ */}
      <header className={`h-16 ${themeMode === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border-b backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className={`text-base font-extrabold ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight flex items-center gap-2`}>
                {t('saasConsoleTitle', 'Pharmacy ERP')} <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full">SuperAdmin</span>
              </span>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 -mt-0.5">
                <span>Home</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span>SuperAdmin</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-purple-400 font-semibold uppercase">{activeTab}</span>
              </div>
            </div>
          </div>

          <div className={`hidden md:flex items-center gap-2 ${themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'} border rounded-xl px-3 py-1.5 ml-6 w-72`}>
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={t('globalSearchPlaceholder', 'Global Search (Companies, Metrics, Audit)...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs focus:outline-none w-full placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('audit')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            {t('systemHealth100', 'System Health: 100% Operational')}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition relative cursor-pointer"
              title={t('notifications', 'Notifications')}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-purple-400" /> Notifications Stream
                  </h4>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-800/60 rounded-xl space-y-1">
                    <p className="font-semibold text-slate-200">Apex Health Pharmacy Onboarded</p>
                    <p className="text-[10px] text-slate-400">Enterprise Plan • 2 minutes ago</p>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl space-y-1">
                    <p className="font-semibold text-emerald-400">MongoDB Atlas Backup Succeeded</p>
                    <p className="text-[10px] text-slate-400">Automated Snapshot • 1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            title="Toggle Dark / Light Mode"
          >
            {themeMode === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md">
              SA
            </div>
            <div className="hidden lg:block text-left">
              <p className={`text-xs font-bold ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('superAdminRole', 'System Super Admin')}</p>
              <p className="text-[10px] text-purple-400 font-semibold">superadmin@pharmacy.com</p>
            </div>
            <button
              onClick={logout}
              title="Logout Super Admin"
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition ml-1 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------
          2. MAIN SUPER ADMIN DASHBOARD CONTAINER (FIXED SIDEBAR + CONTENT)
         ------------------------------------------------------------ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Super Admin Dedicated Fixed Sidebar */}
        <aside className={`w-64 ${themeMode === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col justify-between shrink-0 hidden md:flex`}>
          <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">{t('platformControl', 'Platform Control')}</p>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setModalType('add_company')}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t('addNewCompany', '+ Add New Company')}
            </button>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className={`flex-1 overflow-y-auto p-6 space-y-8 ${themeMode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {/* Quick Action Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              {t('platformQuickActions', 'Platform Quick Actions:')}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setModalType('add_company')}
                className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {t('addCompanyBtn', '+ Add Company')}
              </button>
              <button
                onClick={() => setModalType('add_coupon')}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Percent className="w-3.5 h-3.5" /> + New Coupon
              </button>
              <button
                onClick={() => setModalType('send_notification')}
                className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" /> Broadcast Notice
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF Report
              </button>
            </div>
          </div>

          {/* MODULE 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  {t('saasExecutiveOverview', 'SaaS Executive Dashboard Overview')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: t('totalCompanies', 'Total Companies'), value: overview.totalCompanies || data?.companies?.length || 2, color: 'text-white', bg: 'bg-blue-500/10' },
                    { label: t('activeCompanies', 'Active Companies'), value: overview.activeCompanies || 2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: t('suspendedCompanies', 'Suspended Companies'), value: overview.suspendedCompanies || 0, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: t('expiredCompanies', 'Expired Companies'), value: overview.expiredCompanies || 0, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: t('trialCompanies', 'Trial Companies'), value: overview.trialCompanies || 1, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: t('totalOutlets', 'Total Outlets'), value: overview.totalBranches || 3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
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
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('monthlyRevenueMRR', 'Monthly Revenue (MRR)')}</p>
                      <h3 className="text-2xl font-black text-purple-400 mt-1">${overview.mrr || 1098}/mo</h3>
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +14.2% Growth vs Last Month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold">MRR</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('annualProjectedRevenue', 'Annual Projected Revenue')}</p>
                      <h3 className="text-2xl font-black text-blue-400 mt-1">${overview.annualRevenue || 13176}/yr</h3>
                      <p className="text-xs text-slate-400 mt-1">ARR Run Rate</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-bold">ARR</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('totalPlatformStaff', 'Total Platform Staff')}</p>
                      <h3 className="text-2xl font-black text-indigo-400 mt-1">{overview.totalUsers || 18}</h3>
                      <p className="text-xs text-slate-400 mt-1">Owners, Pharmacists, Cashiers</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold">USERS</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* MODULE 2: COMPANIES (TENANT CRUD) */}
          {activeTab === 'companies' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  {t('companyStatistics', 'Pharmacy Company Tenants Management')} ({filteredCompanies.length})
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
                    <option value="expired">Expired Tenants</option>
                  </select>

                  <button
                    onClick={() => setModalType('add_company')}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Onboard Company
                  </button>
                </div>
              </div>

              {/* Full Company Tenants Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-3.5">{t('pharmacyCompanyHeader', 'Pharmacy Company')}</th>
                        <th className="px-6 py-3.5">{t('ownerProfileHeader', 'Owner Profile')}</th>
                        <th className="px-6 py-3.5">{t('planTierHeader', 'Plan Tier')}</th>
                        <th className="px-6 py-3.5">{t('outletsAndStaffHeader', 'Outlets & Staff')}</th>
                        <th className="px-6 py-3.5">{t('subscriptionStatusHeader', 'Subscription Status')}</th>
                        <th className="px-6 py-3.5 text-right">{t('superAdminControlsHeader', 'SuperAdmin Controls')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredCompanies.map((item) => (
                        <tr key={item.pharmacy._id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4 font-semibold text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-bold text-xs shrink-0">
                                {item.pharmacy.code?.slice(0, 3) || 'ERP'}
                              </div>
                              <div>
                                <p className="text-white font-bold">{item.pharmacy.name}</p>
                                <p className="text-[11px] text-slate-400">Code: {item.pharmacy.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-200 font-bold">{item.owner?.name}</p>
                            <p className="text-slate-400 text-[11px]">{item.owner?.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {item.pharmacy.plan || 'Professional'} (${item.subscription?.price || 299}/mo)
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-300">
                            <span className="text-blue-400">{item.branchCount} Branches</span> / <span className="text-slate-400">{item.userCount} Users</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              item.pharmacy.subscriptionStatus === 'suspended' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              item.pharmacy.subscriptionStatus === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}>
                              {item.pharmacy.subscriptionStatus?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => { setSelectedItem(item); setModalType('company_detail'); }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5 inline" /> View
                            </button>
                            {item.pharmacy.subscriptionStatus === 'suspended' ? (
                              <button
                                onClick={() => handleRenewCompany(item.pharmacy._id, item.pharmacy.name)}
                                className="px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspendCompany(item.pharmacy._id, item.pharmacy.name)}
                                className="px-3 py-1 bg-amber-600/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => handleRenewCompany(item.pharmacy._id, item.pharmacy.name)}
                              className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              +30 Days
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* MODULE 3: SUBSCRIPTION PLANS */}
          {activeTab === 'subscriptions' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  {t('subscriptionPlans', 'Subscription Plans & SaaS Pricing Tiers')}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Starter Plan', price: 99, color: 'text-white', border: 'border-slate-800', branches: '1 Outlet', users: 'Up to 5 Users', count: plans.starterPlans || 1 },
                  { name: 'Professional Plan', price: 299, color: 'text-emerald-400', border: 'border-emerald-500/30', branches: 'Up to 5 Outlets', users: 'Up to 25 Users', count: plans.proPlans || 1 },
                  { name: 'Enterprise Plan', price: 799, color: 'text-blue-400', border: 'border-blue-500/30', branches: 'Unlimited Outlets', users: 'Unlimited Users + AI', count: plans.enterprisePlans || 0 },
                  { name: 'Unlimited Plan', price: 1499, color: 'text-purple-400', border: 'border-purple-500/30', branches: 'Dedicated Cluster', users: '24/7 SLA Manager', count: plans.unlimitedPlans || 0 }
                ].map((p, idx) => (
                  <div key={idx} className={`bg-slate-900 border ${p.border} p-5 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold ${p.color}`}>{p.name}</span>
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-slate-800 text-slate-300 rounded-full">${p.price}/mo</span>
                      </div>
                      <h3 className={`text-2xl font-black ${p.color}`}>{p.count} Active Tenants</h3>
                      <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                        <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {p.branches}</p>
                        <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> {p.users}</p>
                        <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Full POS & FEFO Batches</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setPlanFormData({ name: p.name, price: p.price, maxBranches: 5, maxUsers: 20 }); setModalType('edit_plan'); }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Configure Plan Limits
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MODULE 4: BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  Subscription Invoices & Payment Requests ({invoices.length})
                </h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-3.5">Invoice #</th>
                        <th className="px-6 py-3.5">Pharmacy Company</th>
                        <th className="px-6 py-3.5">Plan Tier</th>
                        <th className="px-6 py-3.5">Amount ($)</th>
                        <th className="px-6 py-3.5">Method</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4 font-bold text-white">{inv.id}</td>
                          <td className="px-6 py-4 font-semibold text-slate-200">{inv.company}</td>
                          <td className="px-6 py-4">{inv.plan}</td>
                          <td className="px-6 py-4 font-black text-emerald-400">${inv.amount}</td>
                          <td className="px-6 py-4 text-slate-400">{inv.method}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              inv.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}>
                              {inv.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {inv.status === 'pending' && (
                              <button
                                onClick={() => handleApproveInvoice(inv.id)}
                                className="px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Approve Payment
                              </button>
                            )}
                            <button
                              onClick={() => showToast(`Downloaded invoice ${inv.id} PDF`)}
                              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 inline" /> Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* MODULE 5: BRANCHES */}
          {activeTab === 'branches' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Multi-Tenant Branch Outlets Directory
                </h2>
                <button
                  onClick={() => setModalType('add_branch')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add Outlet Branch
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'HealthCare Plus HQ Main Branch', code: 'HC-01', manager: 'David Ross (HQ Manager)', type: 'Headquarter', status: 'Active' },
                  { name: 'HealthCare Plus Downtown Outlet', code: 'HC-02', manager: 'Elena Rostova', type: 'Retail Branch', status: 'Active' },
                  { name: 'MedixCare Central Branch', code: 'MX-01', manager: 'Sarah Jenkins', type: 'Headquarter', status: 'Active' }
                ].map((b, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white text-sm">{b.name}</h3>
                        <p className="text-xs text-slate-400">Code: {b.code} • {b.type}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {b.status}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 text-xs text-slate-300 space-y-1">
                      <p><strong>Manager:</strong> {b.manager}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MODULE 6: USERS & ROLES (RBAC) */}
          {activeTab === 'users' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Cross-Tenant User Roster & RBAC Matrix
                </h2>
                <button
                  onClick={() => showToast('Opened RBAC Permission Matrix Editor')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 inline mr-1" /> Configure RBAC Permissions
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">{t('companyOwnerRole', 'Company Owners')}</span>
                  <span className="text-2xl font-black text-purple-400 mt-1 block">2</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">{t('branchManagerRole', 'Branch Managers')}</span>
                  <span className="text-2xl font-black text-blue-400 mt-1 block">4</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">{t('pharmacistRole', 'Pharmacists')}</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">6</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400 font-bold block">{t('cashierRole', 'Cashiers')}</span>
                  <span className="text-2xl font-black text-amber-400 mt-1 block">8</span>
                </div>
              </div>
            </section>
          )}

          {/* MODULE 7: GLOBAL CATALOG & CATEGORIES */}
          {activeTab === 'catalog' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-400" />
                  Master Medicine Categories & Drug Catalog ({categories.length})
                </h2>
                <button
                  onClick={() => setModalType('add_category')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add Master Category
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold">{cat.count} Items</span>
                    </div>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MODULE 8: COUPONS */}
          {activeTab === 'coupons' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-emerald-400" />
                  SaaS Promotional Discount Coupons ({coupons.length})
                </h2>
                <button
                  onClick={() => setModalType('add_coupon')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Create Promotional Coupon
                </button>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Coupon Code</th>
                      <th className="px-6 py-3.5">Discount (%)</th>
                      <th className="px-6 py-3.5">Max Uses</th>
                      <th className="px-6 py-3.5">Used Count</th>
                      <th className="px-6 py-3.5">Expiry Date</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-black text-emerald-400">{c.code}</td>
                        <td className="px-6 py-4 font-bold text-white">{c.discountPercent}% OFF</td>
                        <td className="px-6 py-4">{c.maxUses}</td>
                        <td className="px-6 py-4">{c.usedCount}</td>
                        <td className="px-6 py-4 text-slate-400">{c.expiryDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* MODULE 9: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  SaaS Executive Reports & Export Engine
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => window.print()} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                    <Download className="w-3.5 h-3.5 inline mr-1" /> Export PDF
                  </button>
                  <button onClick={() => showToast('Exported CSV Spreadsheet Report')} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                    <FileSpreadsheet className="w-3.5 h-3.5 inline mr-1" /> Export Excel
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h3 className="font-bold text-white text-sm">Financial Revenue & P&L Statement</h3>
                  <p className="text-xs text-slate-400">Comprehensive breakdown of MRR, ARR, churn rate, and payment methods.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h3 className="font-bold text-white text-sm">Tenant Growth & Registration Analytics</h3>
                  <p className="text-xs text-slate-400">Monthly new onboarding metrics and regional distribution.</p>
                </div>
              </div>
            </section>
          )}

          {/* MODULE 10: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-blue-400" />
                  Tenant Support Tickets & SLA Helpdesk ({supportTickets.length})
                </h2>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Ticket #</th>
                      <th className="px-6 py-3.5">Pharmacy Company</th>
                      <th className="px-6 py-3.5">Subject</th>
                      <th className="px-6 py-3.5">Priority</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {supportTickets.map((tkt) => (
                      <tr key={tkt.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-bold text-white">{tkt.id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-200">{tkt.company}</td>
                        <td className="px-6 py-4">{tkt.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tkt.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {tkt.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400">{tkt.status}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleResolveTicket(tkt.id)}
                            className="px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* MODULE 11: PLATFORM SETTINGS */}
          {activeTab === 'settings' && (
            <section className="space-y-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                SaaS Platform Configuration & Localization Settings
              </h2>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Platform Name</label>
                    <input
                      type="text"
                      value={platformSettings.appName}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, appName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Support Email</label>
                    <input
                      type="email"
                      value={platformSettings.supportEmail}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Primary Currency</label>
                    <input
                      type="text"
                      value={platformSettings.currency}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Default Tax GST (%)</label>
                    <input
                      type="number"
                      value={platformSettings.taxRate}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, taxRate: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => showToast('Platform Configuration settings updated successfully!')}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </section>
          )}

          {/* MODULE 12: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <section className="space-y-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Platform Security & Admin Actions Audit Trail ({auditLogs.length})
              </h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Log #</th>
                      <th className="px-6 py-3.5">Action Event</th>
                      <th className="px-6 py-3.5">Details</th>
                      <th className="px-6 py-3.5">Admin User</th>
                      <th className="px-6 py-3.5">IP Address</th>
                      <th className="px-6 py-3.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-bold text-white">{log.id}</td>
                        <td className="px-6 py-4 font-semibold text-purple-400">{log.action}</td>
                        <td className="px-6 py-4 text-slate-200">{log.details}</td>
                        <td className="px-6 py-4 font-bold text-white">{log.user}</td>
                        <td className="px-6 py-4 text-slate-400">{log.ip}</td>
                        <td className="px-6 py-4 text-right text-slate-500">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------
          3. MODAL DIALOGS FOR CRUD ACTIONS
         ------------------------------------------------------------ */}
      {modalType === 'add_company' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Onboard New Pharmacy Company
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
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
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Onboard Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {modalType === 'add_coupon' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-400" />
                Create Promotional Coupon
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER2026"
                  value={couponFormData.code}
                  onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={couponFormData.discountPercent}
                    onChange={(e) => setCouponFormData({ ...couponFormData, discountPercent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Max Uses</label>
                  <input
                    type="number"
                    required
                    value={couponFormData.maxUses}
                    onChange={(e) => setCouponFormData({ ...couponFormData, maxUses: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {modalType === 'add_category' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-400" />
                Add Master Category
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pediatric Care"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Category scope and drug classifications..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer">Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
