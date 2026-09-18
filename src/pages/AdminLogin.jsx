import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Shield, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { loginAdmin, isAdminAuthenticated } from '../services/authService';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect straight to admin
  React.useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (success) {
        if (onLoginSuccess) onLoginSuccess();
        navigate(from, { replace: true });
      } else {
        setError('Invalid administrator credentials. Please check your username and password.');
        setIsLoading(false);
      }
    }, 300);
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
              Sign in to verify payments and approve memberships
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
              placeholder="Enter admin username"
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
              placeholder="Enter password"
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
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Authorized library personnel only. Configurable via environment variables.
        </p>
      </div>
    </div>
  );
}
