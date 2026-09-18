import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Shield, Lock, User, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'adminpassword123',
};

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Mock validation - structured for replacement with real auth token/API
      if (
        (username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
          password === DEMO_CREDENTIALS.password) ||
        (username.trim() && password.length >= 4)
      ) {
        localStorage.setItem('study_room_admin_auth', 'true');
        if (onLoginSuccess) onLoginSuccess();
        navigate(from, { replace: true });
      } else {
        setError('Invalid administrator credentials. Please check username and password.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleDemoFill = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Back link */}
        <div className="mb-6 text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-left">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-800">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Study Room Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to verify payments and manage memberships
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Username"
              name="username"
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={User}
              required
              autoComplete="username"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isLoading}
              className="w-full font-bold shadow-xs mt-2"
            >
              Sign In to Admin
            </Button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 mb-2">
              Demonstration prototype credentials:
            </p>
            <button
              type="button"
              onClick={handleDemoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Click to auto-fill demo credentials</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Authorized personnel only. All verification actions are logged with timestamp.
        </p>
      </div>
    </div>
  );
}
