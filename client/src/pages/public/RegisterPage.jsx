import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ATTENDEE');
  const [interests, setInterests] = useState('AI, Cloud Computing, Web Development');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const interestArray = interests.split(',').map(s => s.trim()).filter(Boolean);

    const result = await register({
      name,
      email,
      password,
      role: role.toUpperCase(),
      interests: interestArray
    });

    if (result.success) {
      toast.success('Registration successful! Welcome to EventForge.');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary-50">
      <Card className="w-full max-w-md p-8 shadow-lg border border-secondary-200 rounded-2xl bg-white">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-600 text-white font-extrabold rounded-2xl flex items-center justify-center mx-auto text-xl shadow-md mb-3">
            E
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-secondary-900">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-secondary-600">
            Join EventForge to attend, speak, sponsor, or organize
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />

          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
          />

          <Input
            label="Password (min. 6 characters)"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
            >
              <option value="ATTENDEE">Attendee (Discover & Attend Conferences)</option>
              <option value="ORGANIZER">Event Organizer (Create & Host Summits)</option>
              <option value="SPEAKER">Speaker (Deliver Sessions & Keynotes)</option>
              <option value="SPONSOR">Sponsor (Brand Partnerships & Exhibits)</option>
            </select>
          </div>

          <Input
            label="Interests (comma separated)"
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="AI, Cloud Computing, Cybersecurity"
          />

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-secondary-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
