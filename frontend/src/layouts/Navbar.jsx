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

          <div className="bg-accent p-2 rounded-xl text-white font-bold flex items-center justify-center shadow-md shadow-accent/20 lg:hidden">
            <Building2 className="w-5 h-5" />
          </div>
          {/* Title moved to Sidebar */}
        </div>

        {/* Center: Global Search Bar with Focus Ring Animation */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Global search medicines, Rx #, patients..."
              className="w-full bg-slate-800/60 dark:bg-slate-800/60 light:bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:bg-slate-900 transition-all duration-200 shadow-inner"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block font-mono-code text-[9px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600/50">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right Tools: Branch Switcher, Theme & Accent, Notifications, Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">

          {/* Active Branch Display / Switcher with Live Online Indicator */}
          {branches.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-800/90 dark:bg-slate-800/90 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs max-w-[150px] sm:max-w-none shadow-sm">
              <div className="relative flex items-center justify-center shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-slate-900" title="Branch Live Online" />
              </div>
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
              <div className="text-xs font-semibold text-slate-90 dark:text-slate-200 light:text-slate-800">{user?.name}</div>
              <div className="text-[10px] text-accent font-medium flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.role}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 light:text-slate-800 hover:text-red-400 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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
