import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Sparkles, UserCheck, Mic, Award, Users } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DEMO_ACCOUNTS = [
  { role: 'Platform Admin', email: 'admin@example.com', icon: Shield, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { role: 'Event Organizer', email: 'organizer@example.com', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
  { role: 'Event Staff', email: 'staff@example.com', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  { role: 'Speaker', email: 'speaker@example.com', icon: Mic, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { role: 'Sponsor', email: 'sponsor@example.com', icon: Award, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200' },
  { role: 'Attendee', email: 'attendee@example.com', icon: Users, color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-200' }
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    const result = await login(demoEmail, 'password123');
    if (result.success) {
      toast.success(`Logged in as ${demoEmail}`);
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Demo login failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary-50">
      <div className="w-full max-w-md space-y-6">
        <Card className="p-8 shadow-lg border border-secondary-200 rounded-2xl bg-white">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-600 text-white font-extrabold rounded-2xl flex items-center justify-center mx-auto text-xl shadow-md mb-3">
              E
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-secondary-900">
              Welcome to EventForge
            </h2>
            <p className="mt-1.5 text-sm text-secondary-600">
              Sign in to manage and experience world-class conferences
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-secondary-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </div>
        </Card>

        {/* 1-Click Role Testing Switcher */}
        <div className="bg-white border border-secondary-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-500">
              1-Click Demo Logins (password123)
            </span>
            <span className="text-[10px] bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.email)}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${acc.color}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{acc.role}</p>
                    <p className="text-[10px] opacity-75 truncate leading-none mt-0.5">{acc.email.split('@')[0]}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
