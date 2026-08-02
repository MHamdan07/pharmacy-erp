import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { Sliders, Save, Building2, Printer, Shield, DollarSign, CheckCircle2 } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Pharmacy ERP SaaS',
    taxRegistrationNumber: 'NTN-9021-X',
    currencySymbol: '$',
    defaultTaxRate: 5.0,
    receiptWidth: '80mm',
    receiptHeader: 'Welcome to Pharmacy ERP',
    receiptFooter: 'Thank you for visiting! Non-returnable without receipt.',
    enableQrVerification: true,
    autoQuarantineExpired: true,
    lowStockThreshold: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      await API.put('/settings', settings);
      setMessage('System settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-400" />
            22 System Settings & Thermal Receipt Parameters
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Configure tenant-wide operational parameters, receipt layout, tax rates, and security rules</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading system settings...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Company Identity */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Company Identity & Tax Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pharmacy Enterprise Name</label>
                <input
                  type="text"
                  value={settings.companyName || ''}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tax Registration Number (NTN / VAT)</label>
                <input
                  type="text"
                  value={settings.taxRegistrationNumber || ''}
                  onChange={(e) => setSettings({ ...settings, taxRegistrationNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Financials & Tax */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Currency & Default Tax Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Active Currency Symbol</label>
                <input
                  type="text"
                  value={settings.currencySymbol || ''}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Default VAT / Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.defaultTaxRate || 0}
                  onChange={(e) => setSettings({ ...settings, defaultTaxRate: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* POS Thermal Printing */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-purple-400" />
              ESC/POS Thermal Receipt Layout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Thermal Receipt Width</label>
                <select
                  value={settings.receiptWidth || '80mm'}
                  onChange={(e) => setSettings({ ...settings, receiptWidth: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="80mm">80mm Standard Thermal</option>
                  <option value="58mm">58mm Compact Thermal</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Receipt Header Note</label>
                <input
                  type="text"
                  value={settings.receiptHeader || ''}
                  onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Receipt Footer Note</label>
              <textarea
                rows="2"
                value={settings.receiptFooter || ''}
                onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SystemSettings;
