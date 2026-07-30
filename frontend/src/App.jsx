import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import FeatureProtectedRoute from './components/FeatureProtectedRoute';
import SubscriptionGatekeeper from './components/SubscriptionGatekeeper';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegisterTenant from './pages/RegisterTenant';
import Dashboard from './pages/Dashboard';
import POSBilling from './pages/POSBilling';
import Inventory from './pages/Inventory';
import ExpiryManagement from './pages/ExpiryManagement';
import BarcodeLabels from './pages/BarcodeLabels';
import RiskProtectionMatrix from './pages/RiskProtectionMatrix';
import BackupRestore from './pages/BackupRestore';
import StockTransfers from './pages/StockTransfers';
import PurchasesSuppliers from './pages/PurchasesSuppliers';
import CustomersPatients from './pages/CustomersPatients';
import BranchUserManagement from './pages/BranchUserManagement';
import PharmacySettings from './pages/PharmacySettings';
import ReportsAnalytics from './pages/ReportsAnalytics';
import PharmacySubscription from './pages/PharmacySubscription';

function App() {
  return (
    <Routes>
      {/* Pharmacy ERP Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/app/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register-tenant" element={<RegisterTenant />} />

      {/* Protected Pharmacy ERP Operation Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Subscription Plan & Account Settings accessible regardless of subscription state */}
        <Route path="/settings/subscription" element={<PharmacySubscription />} />
        <Route path="/settings/pharmacy" element={<PharmacySettings />} />

        {/* Subscription Gatekeeper Security Gate */}
        <Route element={<SubscriptionGatekeeper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POSBilling />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expiry" element={<ExpiryManagement />} />
          <Route path="/barcode-labels" element={<BarcodeLabels />} />
          <Route path="/risk-matrix" element={<RiskProtectionMatrix />} />
          <Route path="/purchases" element={<PurchasesSuppliers />} />
          <Route path="/customers" element={<CustomersPatients />} />
          <Route path="/reports" element={<ReportsAnalytics />} />

          {/* Feature Subscription Gated Routes */}
          <Route element={<FeatureProtectedRoute flagName="transfers" requiredPlan="Professional" />}>
            <Route path="/transfers" element={<StockTransfers />} />
          </Route>
          <Route element={<FeatureProtectedRoute flagName="backups" requiredPlan="Professional" />}>
            <Route path="/backups" element={<BackupRestore />} />
          </Route>
          <Route element={<FeatureProtectedRoute flagName="multiBranch" requiredPlan="Professional" />}>
            <Route path="/settings/branches" element={<BranchUserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;