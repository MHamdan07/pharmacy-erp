import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Building2, User, Mail, KeyRound, Phone, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { Input, Button, useToast } from '../components/ui';

const RegisterTenant = () => {
  const { registerTenant } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    pharmacyName: '',
    pharmacyCode: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerTenant(formData);
      toast.success('Pharmacy onboarded successfully! Redirecting...');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Tenant onboarding failed. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="mx-auto w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Onboard New Pharmacy
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Register your Pharmacy Organization, Head Office Branch & Admin Account
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="glass-card bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl rounded-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pharmacy Organization Name"
                required
                value={formData.pharmacyName}
                onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                placeholder="CareRx Pharmacy Chain"
                leftIcon={Building2}
              />

              <Input
                label="Pharmacy Code (Unique Tenant ID)"
                required
                value={formData.pharmacyCode}
                onChange={(e) =>
                  setFormData({ ...formData, pharmacyCode: e.target.value.toUpperCase() })
                }
                placeholder="CARERX"
                className="font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Owner Full Name"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Dr. Emily Watson"
                leftIcon={User}
              />

              <Input
                label="Owner Email Address"
                type="email"
                required
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="owner@carerx.com"
                leftIcon={Mail}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                value={formData.ownerPassword}
                onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                placeholder="••••••••"
                leftIcon={KeyRound}
              />

              <Input
                label="Contact Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 800 555 0199"
                leftIcon={Phone}
              />
            </div>

            <Input
              label="Headquarter Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Health Ave, Suite 100"
              leftIcon={MapPin}
            />

            <Button
              type="submit"
              variant="success"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Creating Tenant...' : 'Onboard Pharmacy & Start Free Trial'}
            </Button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTenant;
