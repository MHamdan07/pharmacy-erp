import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ReactivateSubscriptionModal from './ReactivateSubscriptionModal';
import {
  ShieldAlert, RefreshCw, Lock, Sparkles, AlertTriangle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const SubscriptionGatekeeper = () => {
  const { user } = useAuth();
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const navigate = useNavigate();

  if (user?.role === 'SuperAdmin') {
    return <Outlet />;
  }

  const fetchSubscriptionGate = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/subscriptions/my-subscription');
      setSubData(res.data);
    } catch (err) {
      console.error('Failed to load subscription gate status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionGate();
  }, [fetchSubscriptionGate]);

  const handleReactivateConfirm = async () => {
    try {
      await API.post('/subscriptions/reactivate-subscription');
      setShowReactivateModal(false);
      fetchSubscriptionGate();
      alert('Subscription reactivated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reactivate subscription.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3 font-sans">
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        <div className="text-xs font-semibold">Verifying SaaS Subscription Security Gate...</div>
      </div>
    );
  }

  const sub = subData?.subscription || {};
  const status = sub.status || 'active';
  const remainingDays = subData?.remainingDays ?? 30;
  const expirationDateFormatted = subData?.expirationDateFormatted || 'End of Billing Period';

  // 1. ACCOUNT SUSPENDED SCREEN
  if (status === 'suspended') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-8 text-slate-100 shadow-2xl space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/40">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Account Suspended</h1>
            <p className="text-xs text-slate-400">
              Your pharmacy company account has been suspended by the SaaS platform administrator. ERP modules are temporarily locked.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="font-extrabold text-rose-400 uppercase">Suspended</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Support Contact:</span>
              <span className="font-semibold text-slate-200">support@yourcompany.com</span>
            </div>
          </div>

          <a
            href="mailto:support@yourcompany.com"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl block text-xs cursor-pointer shadow-lg shadow-rose-500/20"
          >
            Contact Platform Support
          </a>
        </div>
      </div>
    );
  }

  // 2. SUBSCRIPTION EXPIRED DASHBOARD (FEATURE_08 EXPIRED SCREEN)
  if (status === 'expired' || (remainingDays <= 0 && status !== 'active')) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-8 text-slate-100 shadow-2xl space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/40">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Subscription Required Dashboard</span>
            <h1 className="text-2xl font-extrabold text-white">Subscription Expired</h1>
            <p className="text-xs text-slate-400">
              Your billing period has ended. Access to POS, Inventory, and ERP modules is temporarily locked until renewal.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs text-left space-y-3">
            <div className="flex justify-between text-slate-400">
              <span>Current Plan:</span>
              <span className="font-bold text-white">{sub.planName || 'Professional'} Plan</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Expiration Date:</span>
              <span className="font-mono text-slate-300">{expirationDateFormatted}</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
              <span>Data Retention Status:</span>
              <span className="font-extrabold text-emerald-400">90 Days Remaining (100% Preserved)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => navigate('/settings/subscription')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl cursor-pointer shadow-lg shadow-purple-500/20"
            >
              Renew Subscription
            </button>
            <button
              onClick={() => navigate('/settings/subscription')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl cursor-pointer"
            >
              Choose New Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 3. CANCELLED PENDING BANNER (Access allowed until expirationDate) */}
      {(status === 'cancelled' || sub.cancelAtPeriodEnd) && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 text-xs px-4 py-2 flex items-center justify-between shadow-md font-sans">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Subscription Cancellation Pending:</strong> Your plan remains active until{' '}
              <strong className="text-white">{expirationDateFormatted}</strong> ({remainingDays} Days Left).
            </span>
          </div>
          <button
            onClick={() => setShowReactivateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-lg text-[11px] cursor-pointer shadow-sm"
          >
            Reactivate Subscription
          </button>
        </div>
      )}

      {/* 4. FREE TRIAL BANNER */}
      {status === 'trial' && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white text-xs px-4 py-2 flex items-center justify-between shadow-md border-b border-purple-500/30 font-sans">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="font-bold">Free Trial Active</span>
            <span className="text-slate-300">• {remainingDays} Days Remaining</span>
          </div>
          <button
            onClick={() => navigate('/settings/subscription')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-[11px] cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <Outlet />

      <ReactivateSubscriptionModal
        isOpen={showReactivateModal}
        onClose={() => setShowReactivateModal(false)}
        onConfirm={handleReactivateConfirm}
      />
    </>
  );
};

export default SubscriptionGatekeeper;
