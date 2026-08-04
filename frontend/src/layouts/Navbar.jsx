import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Building2, Store, LogOut, ShieldCheck, Sun, Moon, Palette, Menu, X } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Navbar = ({ isMobileOpen, onToggleMobileMenu }) => {
  const { user, branches, activeBranchId, switchBranch, logout } = useAuth();
  const { themeMode, toggleTheme, changeAccent, availableAccents, accentColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentPharmacyName = user?.pharmacy?.name || 'Pharmacy ERP';

  return (
    <header className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 sticky top-0 z-40 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 overflow-x-auto sm:overflow-visible">

        {/* Left: Mobile Drawer Toggle & Pharmacy Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white lg:hidden cursor-pointer transition-colors"
            aria-label="Toggle Navigation Menu"
            title="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="bg-accent p-2 rounded-xl text-white font-bold flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white dark:text-white light:text-slate-900 flex items-center gap-1.5 truncate">
              <span className="truncate">{currentPharmacyName}</span>
              <span className="text-[10px] bg-accent-soft text-accent font-semibold px-2 py-0.5 rounded-full border border-accent-subtle hidden sm:inline-block">
                Multi-Tenant
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Enterprise Pharmacy System</p>
          </div>
        </div>

        {/* Right Tools: Branch Switcher, Theme & Accent, Notifications, Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">

          {/* Active Branch Display / Switcher */}
          {branches.length > 0 && (
            <div className="flex items-center space-x-1.5 bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 px-2 sm:px-3 py-1.5 rounded-xl text-xs max-w-[130px] sm:max-w-none">
              <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium hidden md:inline">Branch:</span>
              {['Owner', 'SuperAdmin'].includes(user?.role) && branches.length > 1 ? (
                <select
                  value={activeBranchId}
                  onChange={(e) => switchBranch(e.target.value)}
                  className="bg-transparent text-white dark:text-white light:text-slate-900 font-semibold outline-none cursor-pointer text-xs truncate"
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id} className="bg-slate-900 text-white">
                      {b.name} ({b.code}){b.isHeadquarter ? ' ★ HQ' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-white dark:text-white light:text-slate-900 font-semibold truncate text-[11px] sm:text-xs">
                  {branches.find(b => b._id === activeBranchId)?.name || branches[0]?.name || 'Branch'}
                </span>
              )}
            </div>
          )}

          {/* Theme Mode Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 hover:text-white cursor-pointer transition-all shrink-0"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Accent Color Customizer Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-xl bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 text-slate-300 hover:text-white cursor-pointer transition-all"
              title="Change Accent Color Palette"
            >
              <Palette className="w-4 h-4 text-accent" />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accent Palette</div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(availableAccents || {}).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => { changeAccent(key); setShowColorPicker(false); }}
                      className={`w-6 h-6 rounded-full ${item.bg} ring-2 ${accentColor === key ? 'ring-white scale-110' : 'ring-white/20'} hover:scale-110 cursor-pointer transition-transform`}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Live Notification Center Dropdown */}
          <NotificationBell />

          {/* User Profile Info */}
          <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-slate-800 dark:border-slate-800 light:border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">{user?.name}</div>
              <div className="text-[10px] text-accent font-medium flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.role}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
