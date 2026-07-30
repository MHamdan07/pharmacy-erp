import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../api/axios';
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
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const [featureFlags, setFeatureFlags] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('Professional');

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const res = await API.get('/subscriptions/my-subscription');
      if (res.data) {
        setFeatureFlags(res.data.featureFlags || {});
        setCurrentPlan(res.data.subscription?.planName || 'Professional');
      }
    } catch (err) {
      console.error('Failed to load feature flags:', err);
    }
  };

  const allNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'POS Billing', path: '/pos', icon: ShoppingCart, highlight: true, flag: 'pos' },
    { label: 'Inventory & Batches', path: '/inventory', icon: Pill, flag: 'inventory' },
    { label: 'Expiry & FEFO Control', path: '/expiry', icon: Clock, flag: 'expiry' },
    { label: 'Barcode & Shelf Labels', path: '/barcode-labels', icon: Barcode, flag: 'barcode' },
    { label: 'Risks & Safety Matrix', path: '/risk-matrix', icon: ShieldCheck, flag: 'riskMatrix' },
    { label: 'Stock Transfers', path: '/transfers', icon: ArrowLeftRight, flag: 'transfers' },
    { label: 'Purchases & Suppliers', path: '/purchases', icon: Truck, flag: 'purchases' },
    { label: 'Patients & Customers', path: '/customers', icon: Users, flag: 'customers' },
    { label: 'Backup & Restore', path: '/backups', icon: Database, flag: 'backups' },
    { label: 'Branch & Staff Admin', path: '/settings/branches', icon: Building2, flag: 'multiBranch' },
    { label: 'My Subscription', path: '/settings/subscription', icon: CreditCard, highlight: true },
    { label: 'Pharmacy Settings', path: '/settings/pharmacy', icon: Settings },
    { label: 'Reports & Audit', path: '/reports', icon: FileBarChart, flag: 'reports' }
  ];

  // Dynamically filter nav items: DONT SHOW modules in website if subscription does NOT have access
  const visibleNavItems = allNavItems.filter((item) => {
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
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-semibold'
                    : item.highlight
                    ? 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
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
