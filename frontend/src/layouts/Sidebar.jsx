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
  ShoppingBag,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen = false, onCloseMobileMenu }) => {
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

  const visibleNavItems = allNavItems.filter((item) => {
    if (item.superAdminOnly && user?.role !== 'SuperAdmin') return false;
    if (item.ownerOnly) {
      return user?.role === 'Owner';
    }
    if (!item.flag) return true;
    if (!featureFlags) return true;
    return featureFlags[item.flag] !== false;
  });

  const handleNavClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop Blur */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content (Sticky Desktop, Off-Canvas Slide Drawer Mobile) */}
      <aside
        className={`w-64 bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out z-50 fixed inset-y-0 left-0 lg:static lg:z-auto lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Drawer Header */}
          <div className="p-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 flex items-center justify-between lg:hidden shrink-0">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900">
                Pharmacy Navigation
              </span>
            </div>
            <button
              onClick={onCloseMobileMenu}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-1 flex-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Pharmacy Operations
            </div>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-md shadow-accent/20 font-semibold'
                        : item.highlight
                        ? 'text-accent hover:bg-accent-soft'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-100 hover:text-white'
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

          <div className="p-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 shrink-0">
            <NavLink
              to="/settings/subscription"
              onClick={handleNavClick}
              className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-800 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 rounded-xl p-3 text-xs text-slate-400 block transition-all"
            >
              <div>
                <div className="font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5 mb-0.5">
                  <CreditCard className="w-4 h-4 text-accent" />
                  {currentPlan} Plan
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Subscription
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
