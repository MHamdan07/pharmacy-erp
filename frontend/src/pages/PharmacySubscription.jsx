import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';
import ReactivateSubscriptionModal from '../components/ReactivateSubscriptionModal';
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  Check,
  Lock,
  Building2,
  Users,
  Pill,
  HardDrive,
  Clock,
  RefreshCw,
  Layers,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  ToggleSwitch,
  Skeleton,
  useToast
} from '../components/ui';

const PharmacySubscription = () => {
  const toast = useToast();
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const fetchMySubscription = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/subscriptions/my-subscription');
      setSubData(res.data);
    } catch (err) {
      console.error('Failed to fetch subscription details:', err);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMySubscription();
  }, [fetchMySubscription]);

  const handleRequestUpgrade = async (planName) => {
    try {
      await API.post('/subscriptions/change-plan', {
        planName,
        billingCycle: isYearly ? 'yearly' : 'monthly'
      });
      toast.success(
        `Subscription upgrade request to ${planName} Plan submitted successfully!`
      );
      fetchMySubscription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit upgrade request.');
    }
  };

  const handleCancelConfirm = async () => {
    try {
      await API.post('/subscriptions/cancel-subscription');
      setShowCancelModal(false);
      toast.warning(
        'Subscription cancelled. Access remains active until the end of billing period.'
      );
      fetchMySubscription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel subscription.');
    }
  };

  const handleReactivateConfirm = async () => {
    try {
      await API.post('/subscriptions/reactivate-subscription');
      setShowReactivateModal(false);
      toast.success('Subscription reactivated successfully!');
      fetchMySubscription();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reactivate subscription.');
    }
  };

  const sub = subData?.subscription || {};
  const limits = subData?.usageLimits || {};
  const stats = subData?.usageStats || {};
  const remainingDays = subData?.remainingDays ?? 30;
  const expirationDateFormatted = subData?.expirationDateFormatted || 'End of Billing Period';
  const isCancelled =
    sub.status === 'cancelled' || sub.status === 'canceled' || sub.cancelAtPeriodEnd;

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Pharmacy ERP SaaS Subscription Management
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            My Pharmacy Subscription & Feature Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor active plan, usage limits, unlocked modules, and upgrade options
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMySubscription}
          className="self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* CANCELLATION PENDING WARNING BANNER */}
      {isCancelled && (
        <div className="bg-amber-950/80 border border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Subscription Cancellation Pending</div>
              <div className="text-slate-300">
                Your subscription ends on{' '}
                <strong className="text-amber-300">{expirationDateFormatted}</strong> (
                {remainingDays} Days Remaining). ERP modules remain accessible until expiration.
              </div>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => setShowReactivateModal(true)}
            className="shrink-0"
          >
            Reactivate Subscription
          </Button>
        </div>
      )}

      {/* CURRENT SUBSCRIPTION CARD & USAGE METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Status Card */}
        <Card variant="glass" className="flex flex-col justify-between space-y-4">
          <CardHeader>
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current Plan
                </span>
                <CardTitle className="text-2xl font-extrabold">
                  {sub.planName || 'Professional'} Plan
                </CardTitle>
              </div>
              <Badge variant={isCancelled ? 'warning' : 'success'} size="md">
                {isCancelled ? 'Cancelled' : sub.status || 'Active'}
              </Badge>
            </div>
          </CardHeader>

          <CardBody className="space-y-4">
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Billing Cycle:</span>
                <span className="font-semibold text-slate-200 capitalize">
                  {sub.billingCycle || 'monthly'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Price:</span>
                <span className="font-bold text-emerald-400">${sub.price || 299} / Mo</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isCancelled ? 'Expiration Date:' : 'Renewal Date:'}</span>
                <span className="font-mono text-slate-300">{expirationDateFormatted}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    {remainingDays} Days Remaining
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isCancelled ? 'Auto-Renewal Disabled' : 'Auto-Renewal Active'}
                  </div>
                </div>
              </div>
              <span
                className={`w-3 h-3 rounded-full ${
                  isCancelled ? 'bg-amber-500' : 'bg-emerald-500 animate-ping'
                }`}
              ></span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              {isCancelled ? (
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => setShowReactivateModal(true)}
                >
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowCancelModal(true)}
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Cancel Subscription
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Usage Limits Progress Bars */}
        <Card variant="glass" className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle icon={Layers}>Resource Usage & Plan Quota Limits</CardTitle>
            <CardDescription>
              Real-time monitoring of tenant resource allocations against plan limits
            </CardDescription>
          </CardHeader>

          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Branches Usage */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" /> Branch Stores
                </span>
                <span className="text-blue-400">
                  {stats.branchesUsed || 1} / {limits.maxBranches || 5}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((stats.branchesUsed || 1) / (limits.maxBranches || 5)) * 100
                    )}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Users Usage */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-400" /> Staff Members
                </span>
                <span className="text-purple-400">
                  {stats.usersUsed || 1} / {limits.maxUsers || 15}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      ((stats.usersUsed || 1) / (limits.maxUsers || 15)) * 100
                    )}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Medicines Count */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" /> Products & Medicines
                </span>
                <span className="text-emerald-400">
                  {stats.medicinesUsed || 50} / {limits.maxMedicines || 'Unlimited'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: '15%' }}
                ></div>
              </div>
            </div>

            {/* Storage Usage */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-amber-400" /> Cloud Storage
                </span>
                <span className="text-amber-400">
                  {stats.storageUsedGB || 0.4} GB / {limits.maxStorageGB || 20} GB
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: '5%' }}
                ></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* PRICING COMPARISON MATRIX */}
      <Card variant="glass" className="space-y-6">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle icon={Sparkles}>SaaS Subscription Upgrade Plans</CardTitle>
            <CardDescription>
              Select a plan to unlock premium AI features and higher branch/staff limits
            </CardDescription>
          </div>

          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <ToggleSwitch
              label="Billing Interval"
              description={isYearly ? 'Yearly (Save 17%)' : 'Monthly Billing'}
              checked={isYearly}
              onChange={(val) => setIsYearly(val)}
              size="sm"
            />
          </div>
        </CardHeader>

        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Starter Plan Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-blue-500/50 transition-all">
            <div className="space-y-3">
              <div className="font-extrabold text-white text-lg">Starter Plan</div>
              <p className="text-slate-400 text-[11px]">For single store pharmacies getting started</p>
              <div className="text-3xl font-extrabold text-white">
                ${isYearly ? '990' : '99'}{' '}
                <span className="text-xs font-normal text-slate-400">
                  / {isYearly ? 'yr' : 'mo'}
                </span>
              </div>

              <ul className="space-y-2 pt-3 border-t border-slate-800 text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Max 1 Branch Store
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Max 3 Staff Members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> POS & Inventory Management
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Barcode & QR Label Printing
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4 shrink-0" /> No AI Demand Forecasting
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4 shrink-0" /> No Clinical Warnings
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={() => handleRequestUpgrade('Starter')}
              className="mt-4"
            >
              Downgrade to Starter
            </Button>
          </div>

          {/* Professional Plan Card */}
          <div className="bg-slate-950 border-2 border-purple-500/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl shadow-purple-500/10 relative">
            <div className="absolute -top-3 right-6 bg-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md">
              Most Popular
            </div>

            <div className="space-y-3">
              <div className="font-extrabold text-white text-lg">Professional Plan</div>
              <p className="text-slate-400 text-[11px]">For growing multi-branch pharmacy chains</p>
              <div className="text-3xl font-extrabold text-purple-400">
                ${isYearly ? '2,990' : '299'}{' '}
                <span className="text-xs font-normal text-slate-400">
                  / {isYearly ? 'yr' : 'mo'}
                </span>
              </div>

              <ul className="space-y-2 pt-3 border-t border-slate-800 text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Max 5 Branch Stores
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Max 15 Staff Members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-Branch Stock Transfers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Clinical Warnings Matrix
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Barcode & QR Label Printing
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-4 h-4 shrink-0" /> No AI Demand Forecasting
                </li>
              </ul>
            </div>

            <Button
              variant={
                sub.planName === 'Professional' && !isCancelled ? 'outline' : 'primary'
              }
              fullWidth
              disabled={sub.planName === 'Professional' && !isCancelled}
              onClick={() => handleRequestUpgrade('Professional')}
              className="mt-4"
            >
              {sub.planName === 'Professional' && !isCancelled
                ? 'Active Current Plan'
                : 'Select Professional'}
            </Button>
          </div>

          {/* Enterprise Plan Card */}
          <div className="bg-slate-950 border border-blue-500/50 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-blue-500 transition-all">
            <div className="space-y-3">
              <div className="font-extrabold text-white text-lg">Enterprise Plan</div>
              <p className="text-slate-400 text-[11px]">For large chains needing AI Forecasting</p>
              <div className="text-3xl font-extrabold text-blue-400">
                ${isYearly ? '7,990' : '799'}{' '}
                <span className="text-xs font-normal text-slate-400">
                  / {isYearly ? 'yr' : 'mo'}
                </span>
              </div>

              <ul className="space-y-2 pt-3 border-t border-slate-800 text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Branch Stores
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Staff Members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> AI Demand Forecasting Engine
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Voice Search & Voice Billing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> REST API & Webhook API
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Priority SLA Support
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => handleRequestUpgrade('Enterprise')}
              className="mt-4"
            >
              Upgrade to Enterprise
            </Button>
          </div>
        </CardBody>
      </Card>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        expirationDate={expirationDateFormatted}
      />

      <ReactivateSubscriptionModal
        isOpen={showReactivateModal}
        onClose={() => setShowReactivateModal(false)}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  );
};

export default PharmacySubscription;
