import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Building2, Store, LogOut, ShieldCheck, Sun, Moon, Palette } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, branches, activeBranchId, switchBranch, logout } = useAuth();
  const { themeMode, toggleTheme, accentColor, changeAccent } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentPharmacyName = user?.pharmacy?.name || 'Pharmacy ERP';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Pharmacy Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {currentPharmacyName}
              <span className="text-xs bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                Multi-Tenant
              </span>
            </h1>
            <p className="text-xs text-slate-400">Enterprise Pharmacy System</p>
          </div>
        </div>

        {/* Center/Right: Branch Switcher, Theme & Color Customizer, Notification Center & User Profile */}
        <div className="flex items-center space-x-3">

          {/* Active Branch Switcher */}
          {branches.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <Store className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium hidden md:inline">Branch:</span>
              <select
                value={activeBranchId}
                onChange={(e) => switchBranch(e.target.value)}
                className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id} className="bg-slate-900 text-white">
                    {b.name} ({b.code}){b.isHeadquarter ? ' ★ HQ' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Theme Mode Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition-all"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Accent Color Customizer Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition-all"
              title="Change Accent Color Palette"
            >
              <Palette className="w-4 h-4 text-purple-400" />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accent Color Palette</div>
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => { changeAccent('blue'); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-blue-600 ring-2 ring-white/20 hover:scale-110 cursor-pointer" title="Ocean Blue" />
                  <button onClick={() => { changeAccent('emerald'); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white/20 hover:scale-110 cursor-pointer" title="Emerald Green" />
                  <button onClick={() => { changeAccent('purple'); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-purple-600 ring-2 ring-white/20 hover:scale-110 cursor-pointer" title="Royal Purple" />
                  <button onClick={() => { changeAccent('rose'); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-rose-500 ring-2 ring-white/20 hover:scale-110 cursor-pointer" title="Crimson Rose" />
                  <button onClick={() => { changeAccent('amber'); setShowColorPicker(false); }} className="w-6 h-6 rounded-full bg-amber-500 ring-2 ring-white/20 hover:scale-110 cursor-pointer" title="Amber Gold" />
                </div>
              </div>
            )}
          </div>

          {/* Live Notification Center Dropdown */}
          <NotificationBell />

          {/* User Profile Info */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user?.name}</div>
              <div className="text-[10px] text-blue-400 font-medium flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user?.role}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
