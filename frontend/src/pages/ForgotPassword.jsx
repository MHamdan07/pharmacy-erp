import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Mail, KeyRound, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Input, Button, useToast } from '../components/ui';

const ForgotPassword = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
      toast.success('Password reset token generated successfully.');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to request reset token.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your registered email address to receive a password reset token
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

          {msg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col gap-1 text-emerald-400 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{msg}</span>
              </div>
              {resetToken && (
                <div className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-400">
                  Reset Token: {resetToken}
                </div>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@pharmacy.com"
              leftIcon={Mail}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Generate Reset Token'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {resetToken && (
            <div className="text-center pt-2">
              <Link
                to={`/reset-password?token=${resetToken}`}
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                Proceed to Reset Password ➔
              </Link>
            </div>
          )}

          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Remembered your password?{' '}
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

export default ForgotPassword;
