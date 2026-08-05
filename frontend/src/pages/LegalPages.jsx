import { useState } from 'react';
import { ShieldCheck, FileText, RefreshCw, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { Link } from 'react-router-dom';

const LegalPages = () => {
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' | 'terms' | 'refund' | 'contact'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Top */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Badge variant="secondary" size="sm">Legal & Compliance v1.0</Badge>
        </div>

        <Card variant="glass" className="p-6 border-slate-800 space-y-6 shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-blue-400" /> Legal & Operational Policies
            </h1>
            <p className="text-xs text-slate-400">
              HIPAA-compliant multi-tenant SaaS terms, privacy protection, subscription refund policy, and contact support.
            </p>
          </div>

          {/* Legal Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'privacy' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'terms' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'refund' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Refund Policy
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'contact' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Contact Support
            </button>
          </div>

          {/* Content Body */}
          <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-normal">
            {activeTab === 'privacy' && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Privacy & Data Protection</h2>
                <p>
                  Pharmacy ERP SaaS is committed to safeguarding patient Protected Health Information (PHI) and tenant operational data in full compliance with international medical privacy standards.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>Data Isolation:</strong> All tenant database records are strictly partitioned using multi-tenant discriminator keys.</li>
                  <li><strong>Encryption:</strong> Data in transit is encrypted via TLS 1.3 (HTTPS) and data at rest is encrypted using AES-256.</li>
                  <li><strong>Audit Trails:</strong> Every database mutation logs user ID, IP address, timestamp, and action history.</li>
                </ul>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. SaaS Terms of Service</h2>
                <p>
                  By accessing Pharmacy ERP SaaS, pharmacy owners and authorized staff agree to operate under licensed medical practice standards.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>Accountability:</strong> Pharmacists are responsible for verifying AI OCR extracted prescription items prior to final billing sign-off.</li>
                  <li><strong>Uptime SLA:</strong> 99.9% uptime guarantee across core POS billing, inventory matching, and prescription processing modules.</li>
                  <li><strong>Role-Based Access:</strong> Tenants must enforce strict RBAC permissions to prevent unauthorized access.</li>
                </ul>
              </div>
            )}

            {activeTab === 'refund' && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Subscription & Refund Policy</h2>
                <p>
                  We offer transparent subscription pricing across Starter, Professional, and Enterprise plans with flexible billing terms.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>14-Day Guarantee:</strong> New pharmacy tenants receive a 100% money-back guarantee within the first 14 days of subscription.</li>
                  <li><strong>Prorated Adjustments:</strong> Plan downgrades take effect at the start of the next billing cycle.</li>
                  <li><strong>Cancellation:</strong> Tenants can cancel their plan at any time from the Subscription Settings console.</li>
                </ul>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Contact & Support Center</h2>
                <p>
                  Need assistance with installation, multi-branch setup, or hardware integration (thermal printers, barcode scanners)?
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <p className="text-blue-400 font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Support Email: support@pharmacyerpsaas.com
                  </p>
                  <p className="text-slate-400">⚡ 24/7 Priority Emergency Support for Enterprise Pharmacies</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LegalPages;
