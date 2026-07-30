import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Mail, KeyRound, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
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
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
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
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {msg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex flex-col gap-1 text-emerald-400 text-sm">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{msg}</span>
              </div>
              {resetToken && (
                <div className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-amber-400">
                  Reset Token: {resetToken}
                </div>
              )}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@pharmacy.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? 'Sending...' : 'Generate Reset Token'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {resetToken && (
            <div className="mt-4 text-center">
              <Link to={`/reset-password?token=${resetToken}`} className="text-sm text-emerald-400 font-bold hover:underline">
                Proceed to Reset Password ➔
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
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
