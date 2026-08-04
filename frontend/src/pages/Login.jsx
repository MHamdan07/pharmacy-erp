import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Building2, KeyRound, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input, Button, useToast } from '../components/ui';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, requires2FA ? twoFactorCode : undefined);
      if (res?.status === '2fa_required') {
        setRequires2FA(true);
        toast.info('Two-Factor Authentication required. Check console or authenticator app.');
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (err) {
      const errMsg = !err.response
        ? 'Cannot connect to backend server. Please verify backend server is running.'
        : err.response?.data?.message || 'Failed to login. Please check credentials.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Pharmacy ERP Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enterprise Multi-Tenant & Multi-Branch SaaS Solution
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-card bg-slate-900/80 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {requires2FA && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-400 text-xs font-medium animate-in fade-in slide-in-from-top-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Two-Factor Authentication required. Enter your 6-digit code below!</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Owner / Subscriber Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@pharmacy.com"
              leftIcon={Mail}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">
                  Password <span className="text-red-500">*</span>
                </span>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={KeyRound}
              />
            </div>

            {/* Smooth 2FA Field Transition Container */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                requires2FA
                  ? 'max-h-32 opacity-100 transform translate-y-0'
                  : 'max-h-0 opacity-0 transform -translate-y-2 pointer-events-none'
              }`}
            >
              <Input
                label="2FA Verification Code (6-digits)"
                type="text"
                required={requires2FA}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                className="font-mono text-center tracking-widest text-lg border-amber-500/80 focus:border-amber-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Authenticating...' : requires2FA ? 'Verify 2FA & Sign In' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Need to onboard a new pharmacy company?{' '}
              <Link to="/register-tenant" className="text-blue-400 hover:underline font-semibold">
                Onboard Pharmacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;