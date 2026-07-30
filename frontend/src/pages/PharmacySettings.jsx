import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  Settings, Building2, ShieldCheck, Save, Mail, MessageSquare,
  Globe, Sun, Moon, DollarSign, FileText, Database, Tag, Check, Sparkles
} from 'lucide-react';

const PharmacySettings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    taxId: '',
    phone: '',
    email: '',
    address: '',
    plan: 'enterprise',
    taxRate: 5,
    currency: 'USD',
    theme: 'dark',
    language: 'en',
    backupSchedule: 'daily',
    emailSmtpServer: 'smtp.gmail.com',
    smsGatewayKey: 'SMS-GATEWAY-KEY-8820'
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.pharmacy) {
      setForm({
        name: user.pharmacy.name || '',
        licenseNumber: user.pharmacy.licenseNumber || '',
        taxId: user.pharmacy.taxId || '',
        phone: user.pharmacy.phone || '',
        email: user.pharmacy.email || '',
        address: user.pharmacy.address || '',
        plan: user.pharmacy.plan || 'enterprise',
        taxRate: user.pharmacy.taxRate || 5,
        currency: user.pharmacy.currency || 'USD',
        theme: user.pharmacy.theme || 'dark',
        language: user.pharmacy.language || 'en',
        backupSchedule: user.pharmacy.backupSchedule || 'daily',
        emailSmtpServer: 'smtp.gmail.com',
        smsGatewayKey: 'SMS-GATEWAY-KEY-8820'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      await API.put('/tenants/pharmacy', form);
      setMsg('Pharmacy settings & configuration updated successfully.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Global Pharmacy Organization & System Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure company details, tax rates, currency, theme, language, and integration gateways</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
            Master Owner Authority
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Company Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-400" /> Company & License Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Pharmacy Organization Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Pharmacy Drug License # *</label>
              <input
                type="text"
                required
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">NTN / GST / Tax ID Registration</label>
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Subscription Plan</label>
              <input
                type="text"
                disabled
                value={form.plan.toUpperCase()}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* 2. Tax Rates, Currency, Theme & Language */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-emerald-400" /> Currency, Tax, Theme & Multi-Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Default Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Default Tax Rate (%)</label>
              <input
                type="number"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">System Theme</label>
              <select
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="dark">Dark Glassmorphism (Default)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              >
                <option value="en">English</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ar">Arabic (العربية)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Integration Gateways (Email, SMS, Backup Schedule) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-purple-400" /> Integration Gateways & Backup Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">SMTP Email Server</label>
              <input
                type="text"
                value={form.emailSmtpServer}
                onChange={(e) => setForm({ ...form, emailSmtpServer: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">SMS Gateway API Key</label>
              <input
                type="text"
                value={form.smsGatewayKey}
                onChange={(e) => setForm({ ...form, smsGatewayKey: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Automated Backup Schedule</label>
              <select
                value={form.backupSchedule}
                onChange={(e) => setForm({ ...form, backupSchedule: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
              >
                <option value="daily">Daily Cron (24h)</option>
                <option value="weekly">Weekly Cron (7d)</option>
                <option value="monthly">Monthly Cron (30d)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving System Settings...' : 'Save Global Pharmacy Settings'}
        </button>

      </form>
    </div>
  );
};

export default PharmacySettings;
