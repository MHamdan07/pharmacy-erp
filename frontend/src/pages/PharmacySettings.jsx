import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  Settings,
  Building2,
  Printer,
  DollarSign,
  Mail,
  Globe,
  Save,
  ShieldCheck
} from 'lucide-react';
import {
  Input,
  Select,
  Textarea,
  ToggleSwitch,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Button,
  Badge,
  Skeleton,
  useToast
} from '../components/ui';

const PharmacySettings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    taxId: '',
    phone: '',
    email: '',
    address: '',
    plan: 'enterprise',
    lowStockThreshold: 10,

    // Receipt Parameters
    receiptWidth: '80mm',
    receiptHeader: 'Welcome to Pharmacy ERP',
    receiptFooter: 'Thank you for visiting! Non-returnable without receipt.',
    enableQrVerification: true,

    // Tax & Currency
    currency: 'USD',
    currencySymbol: '$',
    taxRate: 5,
    autoQuarantineExpired: true,

    // Gateways & Notifications
    emailSmtpServer: 'smtp.gmail.com',
    smsGatewayKey: 'SMS-GATEWAY-KEY-8820',
    enableEmailAlerts: true,
    enableSmsAlerts: false,

    // Localization & Theme
    theme: 'dark',
    language: 'en',
    backupSchedule: 'daily'
  });

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [pharmacyRes, settingsRes] = await Promise.allSettled([
        API.get('/tenants/pharmacy'),
        API.get('/settings')
      ]);

      let merged = { ...form };

      if (user?.pharmacy) {
        merged.name = user.pharmacy.name || '';
        merged.licenseNumber = user.pharmacy.licenseNumber || '';
        merged.taxId = user.pharmacy.taxId || '';
        merged.phone = user.pharmacy.phone || '';
        merged.email = user.pharmacy.email || '';
        merged.address = user.pharmacy.address || '';
        merged.plan = user.pharmacy.plan || 'enterprise';
        merged.taxRate = user.pharmacy.taxRate ?? 5;
        merged.currency = user.pharmacy.currency || 'USD';
        merged.theme = user.pharmacy.theme || 'dark';
        merged.language = user.pharmacy.language || 'en';
        merged.backupSchedule = user.pharmacy.backupSchedule || 'daily';
      }

      if (pharmacyRes.status === 'fulfilled' && pharmacyRes.value?.data) {
        const p = pharmacyRes.value.data;
        merged = {
          ...merged,
          name: p.name || merged.name,
          licenseNumber: p.licenseNumber || merged.licenseNumber,
          taxId: p.taxId || merged.taxId,
          phone: p.phone || merged.phone,
          email: p.email || merged.email,
          address: p.address || merged.address,
          plan: p.plan || merged.plan,
          taxRate: p.taxRate ?? merged.taxRate,
          currency: p.currency || merged.currency,
          theme: p.theme || merged.theme,
          language: p.language || merged.language,
          backupSchedule: p.backupSchedule || merged.backupSchedule
        };
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data) {
        const s = settingsRes.value.data;
        merged = {
          ...merged,
          receiptWidth: s.receiptWidth || merged.receiptWidth,
          receiptHeader: s.receiptHeader || merged.receiptHeader,
          receiptFooter: s.receiptFooter || merged.receiptFooter,
          enableQrVerification: s.enableQrVerification ?? merged.enableQrVerification,
          currencySymbol: s.currencySymbol || merged.currencySymbol,
          autoQuarantineExpired: s.autoQuarantineExpired ?? merged.autoQuarantineExpired,
          lowStockThreshold: s.lowStockThreshold ?? merged.lowStockThreshold
        };
      }

      setForm(merged);
    } catch (err) {
      console.error('Failed loading settings:', err);
      toast.error('Failed to load system configuration settings.');
    } finally {
      setLoading(false);
    }
  }, [user, toast, form]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await Promise.allSettled([
        API.put('/tenants/pharmacy', form),
        API.put('/settings', {
          companyName: form.name,
          taxRegistrationNumber: form.taxId,
          currencySymbol: form.currencySymbol,
          defaultTaxRate: form.taxRate,
          receiptWidth: form.receiptWidth,
          receiptHeader: form.receiptHeader,
          receiptFooter: form.receiptFooter,
          enableQrVerification: form.enableQrVerification,
          autoQuarantineExpired: form.autoQuarantineExpired,
          lowStockThreshold: form.lowStockThreshold
        })
      ]);

      toast.success('Pharmacy & System configuration saved successfully!');
    } catch (err) {
      console.error('Failed saving settings:', err);
      toast.error(err.response?.data?.message || 'Failed to save system settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Company', icon: Building2 },
    { id: 'receipt', label: 'Receipt & Thermal', icon: Printer },
    { id: 'tax', label: 'Tax & Currency', icon: DollarSign },
    { id: 'notifications', label: 'Notifications & SMTP', icon: Mail },
    { id: 'theme', label: 'Theme & Localization', icon: Globe }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            Global Pharmacy Organization & System Settings
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
            Unified management of company profile, thermal printing layout, tax rates, notification gateways, and theme options
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md" icon={ShieldCheck}>
            Owner Authority
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={saving || loading}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Settings Tab Bar */}
      <div className="flex overflow-x-auto gap-2 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-2 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Body */}
      {loading ? (
        <Card className="p-6">
          <Skeleton.Form fields={6} />
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* TAB 1: GENERAL & COMPANY */}
          {activeTab === 'general' && (
            <Card variant="glass" className="space-y-6">
              <CardHeader>
                <CardTitle icon={Building2}>Company & License Identity</CardTitle>
                <CardDescription>
                  Core administrative credentials and tenant profile attributes
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Pharmacy Organization Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  <Input
                    label="Pharmacy Drug License #"
                    required
                    value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  />

                  <Input
                    label="NTN / GST / Tax ID Registration"
                    value={form.taxId}
                    onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                  />

                  <Input
                    label="Active Subscription Plan"
                    disabled
                    value={form.plan.toUpperCase()}
                    helperText="Managed via Subscription Portal"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
                  <Input
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <Input
                    label="Low Stock Alert Threshold"
                    type="number"
                    min="1"
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      setForm({ ...form, lowStockThreshold: Number(e.target.value) })
                    }
                    helperText="Minimum quantity before low stock alert"
                  />
                </div>

                <Textarea
                  label="Headquarter Physical Address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </CardBody>
            </Card>
          )}

          {/* TAB 2: RECEIPT & THERMAL */}
          {activeTab === 'receipt' && (
            <Card variant="glass" className="space-y-6">
              <CardHeader>
                <CardTitle icon={Printer}>ESC/POS Thermal Receipt Layout</CardTitle>
                <CardDescription>
                  Configure thermal printing paper format, header banner, and footer notes
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Thermal Receipt Width"
                    value={form.receiptWidth}
                    onChange={(e) => setForm({ ...form, receiptWidth: e.target.value })}
                    options={[
                      { value: '80mm', label: '80mm Standard Thermal Paper' },
                      { value: '58mm', label: '58mm Compact Thermal Paper' }
                    ]}
                  />

                  <Input
                    label="Receipt Header Welcome Note"
                    value={form.receiptHeader}
                    onChange={(e) => setForm({ ...form, receiptHeader: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Receipt Footer Disclaimer Note"
                  rows={3}
                  value={form.receiptFooter}
                  onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
                  helperText="Printed at bottom of customer receipt"
                />

                <div className="pt-3 border-t border-slate-800/80">
                  <ToggleSwitch
                    label="Enable QR Code Verification on Receipt"
                    description="Generates digital validation QR code at invoice bottom for customer scanning"
                    checked={form.enableQrVerification}
                    onChange={(checked) =>
                      setForm({ ...form, enableQrVerification: checked })
                    }
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* TAB 3: TAX & CURRENCY */}
          {activeTab === 'tax' && (
            <Card variant="glass" className="space-y-6">
              <CardHeader>
                <CardTitle icon={DollarSign}>Currency, Tax & FEFO Rules</CardTitle>
                <CardDescription>
                  Default regional currency, sales tax percentage, and automatic batch quarantine
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Default Base Currency"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    options={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'PKR', label: 'PKR (Rs)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                      { value: 'AED', label: 'AED (د.إ)' }
                    ]}
                  />

                  <Input
                    label="Currency Display Symbol"
                    value={form.currencySymbol}
                    onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                  />

                  <Input
                    label="Default Sales Tax / VAT (%)"
                    type="number"
                    step="0.1"
                    value={form.taxRate}
                    onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                  />
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <ToggleSwitch
                    label="Auto Quarantine Expired Batches"
                    description="Automatically lock and isolate expired medicine batches from POS selection"
                    checked={form.autoQuarantineExpired}
                    onChange={(checked) =>
                      setForm({ ...form, autoQuarantineExpired: checked })
                    }
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* TAB 4: NOTIFICATIONS & SMTP */}
          {activeTab === 'notifications' && (
            <Card variant="glass" className="space-y-6">
              <CardHeader>
                <CardTitle icon={Mail}>Integration Gateways & Alerts</CardTitle>
                <CardDescription>
                  SMTP mailer settings, SMS gateway keys, and automated triggers
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="SMTP Email Server"
                    value={form.emailSmtpServer}
                    onChange={(e) => setForm({ ...form, emailSmtpServer: e.target.value })}
                  />

                  <Input
                    label="SMS Gateway API Key"
                    value={form.smsGatewayKey}
                    onChange={(e) => setForm({ ...form, smsGatewayKey: e.target.value })}
                  />
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <ToggleSwitch
                    label="Enable Email Transaction Notifications"
                    description="Send email receipts and low stock alerts to store management"
                    checked={form.enableEmailAlerts}
                    onChange={(checked) =>
                      setForm({ ...form, enableEmailAlerts: checked })
                    }
                  />

                  <ToggleSwitch
                    label="Enable SMS Transaction Notifications"
                    description="Send SMS notifications to customers for orders and refills"
                    checked={form.enableSmsAlerts}
                    onChange={(checked) =>
                      setForm({ ...form, enableSmsAlerts: checked })
                    }
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* TAB 5: THEME & LOCALIZATION */}
          {activeTab === 'theme' && (
            <Card variant="glass" className="space-y-6">
              <CardHeader>
                <CardTitle icon={Globe}>Theme, Language & Backups</CardTitle>
                <CardDescription>
                  Visual theme preferences, multi-language support, and automated backup schedules
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="System Visual Theme"
                    value={form.theme}
                    onChange={(e) => setForm({ ...form, theme: e.target.value })}
                    options={[
                      { value: 'dark', label: 'Dark Glassmorphism (Default)' },
                      { value: 'light', label: 'Light Theme' }
                    ]}
                  />

                  <Select
                    label="Primary Language"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'ur', label: 'Urdu (اردو)' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'ar', label: 'Arabic (العربية)' }
                    ]}
                  />

                  <Select
                    label="Automated Database Backup Schedule"
                    value={form.backupSchedule}
                    onChange={(e) => setForm({ ...form, backupSchedule: e.target.value })}
                    options={[
                      { value: 'daily', label: 'Daily Cron (Every 24h)' },
                      { value: 'weekly', label: 'Weekly Cron (Every 7d)' },
                      { value: 'monthly', label: 'Monthly Cron (Every 30d)' }
                    ]}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={saving || loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving Configuration...' : 'Save Global Pharmacy Settings'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PharmacySettings;
