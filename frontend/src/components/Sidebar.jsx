import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Pill,
  Clock,
  Barcode,
  ArrowLeftRight,
  Truck,
  Users,
  Building2,
  FileBarChart,
  Database,
  ShieldCheck,
  Settings,
  CreditCard,
  FileText,
  ShoppingBag
} from 'lucide-react';

const Sidebar = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [featureFlags, setFeatureFlags] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('Professional');

  const fetchFlags = useCallback(async () => {
    try {
      const res = await API.get('/subscriptions/my-subscription');
      if (res.data) {
        setFeatureFlags(res.data.featureFlags || {});
        setCurrentPlan(res.data.subscription?.planName || 'Professional');
      }
    } catch (err) {
      console.error('Failed to load feature flags:', err);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const allNavItems = [
    { label: t('dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('posBilling', 'POS Billing'), path: '/pos', icon: ShoppingCart, highlight: true, flag: 'pos' },
    { label: t('prescriptions', 'Prescription & AI OCR'), path: '/prescriptions', icon: FileText, highlight: true },
    { label: t('storefront', 'Customer E-Storefront'), path: '/store', icon: ShoppingBag },
    { label: t('inventory', 'Inventory & Batches'), path: '/inventory', icon: Pill, flag: 'inventory' },
    { label: t('expiryManagement', 'Expiry & FEFO Control'), path: '/expiry', icon: Clock, flag: 'expiry' },
    { label: 'Barcode & Shelf Labels', path: '/barcode-labels', icon: Barcode, flag: 'barcode' },
    { label: 'Risks & Safety Matrix', path: '/risk-matrix', icon: ShieldCheck, flag: 'riskMatrix' },
    { label: t('stockTransfers', 'Stock Transfers'), path: '/transfers', icon: ArrowLeftRight, flag: 'transfers' },
    { label: t('suppliers', 'Purchases & Suppliers'), path: '/purchases', icon: Truck, flag: 'purchases' },
    { label: t('customers', 'Patients & Customers'), path: '/customers', icon: Users, flag: 'customers' },
    { label: t('backupRestore', 'Backup & Restore'), path: '/backups', icon: Database, flag: 'backups' },
    { label: t('branchManagement', 'Branch Management'), path: '/settings/branches', icon: Building2, ownerOnly: true, badge: 'Owner' },
    { label: t('employees', 'Employee Staff Roster'), path: '/employees', icon: Users },
    { label: t('settings', 'System Settings'), path: '/system-settings', icon: Settings },
    { label: t('subscriptions', 'My Subscription'), path: '/settings/subscription', icon: CreditCard, highlight: true, ownerOnly: true },
    { label: 'Pharmacy Settings', path: '/settings/pharmacy', icon: Settings, ownerOnly: true },
    { label: t('reports', 'Reports & Audit'), path: '/reports', icon: FileBarChart, flag: 'reports' }
  ];

  // Dynamically filter nav items: Owner-only items shown EXCLUSIVELY to Company Owner
  const visibleNavItems = allNavItems.filter((item) => {
    if (item.superAdminOnly && user?.role !== 'SuperAdmin') return false;
    if (item.ownerOnly) {
      return user?.role === 'Owner';
    }
    if (!item.flag) return true;
    if (!featureFlags) return true; // Show defaults while loading
    return featureFlags[item.flag] !== false;
  });

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Pharmacy Operations
        </div>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-semibold'
                    : item.highlight
                    ? 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ml-1">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/settings/subscription"
          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-400 flex items-center justify-between block"
        >
          <div>
            <div className="font-bold text-white flex items-center gap-1.5 mb-0.5">
              <CreditCard className="w-4 h-4 text-purple-400" />
              {currentPlan} Plan
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Subscription
            </div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
