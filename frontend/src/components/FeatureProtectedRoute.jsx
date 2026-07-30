import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import API from '../api/axios';
import UpgradeModal from './UpgradeModal';

const FeatureProtectedRoute = ({ flagName, requiredPlan = 'Professional' }) => {
  const [featureFlags, setFeatureFlags] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('Professional');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionFlags();
  }, []);

  const fetchSubscriptionFlags = async () => {
    try {
      const res = await API.get('/subscriptions/my-subscription');
      if (res.data) {
        setFeatureFlags(res.data.featureFlags || {});
        setCurrentPlan(res.data.subscription?.planName || 'Professional');
      }
    } catch (err) {
      console.error('Failed to verify subscription feature route:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs font-semibold">
        Verifying Subscription Access...
      </div>
    );
  }

  // If feature flag is explicitly false, block route access & show Upgrade Modal / Redirect
  if (featureFlags && featureFlags[flagName] === false) {
    return (
      <UpgradeModal
        isOpen={true}
        onClose={() => window.location.href = '/settings/subscription'}
        requiredFeature={flagName}
        currentPlan={currentPlan}
        requiredPlan={requiredPlan}
      />
    );
  }

  return <Outlet />;
};

export default FeatureProtectedRoute;
