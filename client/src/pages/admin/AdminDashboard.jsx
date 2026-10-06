import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const COLORS = ['#7c3aed', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, usersRes, orgsRes] = await Promise.allSettled([
        api.get('/analytics/platform'),
        api.get('/users'),
        api.get('/organizations')
      ]);

      if (analyticsRes.status === 'fulfilled') {
        setStats(analyticsRes.value.data?.data || analyticsRes.value.data);
      }
      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data?.data || usersRes.value.data || []);
      }
      if (orgsRes.status === 'fulfilled') {
        setOrganizations(orgsRes.value.data?.data || orgsRes.value.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      const res = await api.patch(`/users/${userId}/toggle-status`);
      toast.success(res.data?.message || 'User status updated');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || (u.role || '').toUpperCase() === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-secondary-200 p-6 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error && !stats) {
    return <ErrorAlert message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            Platform Administration
          </h1>
          <p className="text-secondary-600 text-sm mt-1">
            Global metrics, enterprise organizations, user role governance, and platform policies.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-white border border-secondary-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'text-secondary-600 hover:text-secondary-900'}`}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-secondary-600 hover:text-secondary-900'}`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('orgs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'orgs' ? 'bg-primary-600 text-white' : 'text-secondary-600 hover:text-secondary-900'}`}
          >
            Organizations ({organizations.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Total Users</p>
            <p className="text-3xl font-extrabold text-secondary-900 mt-1">{stats?.totalUsers || users.length}</p>
          </div>
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Organizations</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{stats?.totalOrganizations || organizations.length}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Active Summits</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats?.activeEvents || 3}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Total Revenue</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">${(stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab 1: Analytics & Charts */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Revenue Trend */}
            <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm">
              <h3 className="text-base font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-600" />
                Registrations by Month
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.registrationsByMonth || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Registrations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Roles Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm">
              <h3 className="text-base font-bold text-secondary-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Platform User Roles Breakdown
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.userRoleStats || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(stats?.userRoleStats || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Platform Registrations */}
          <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-secondary-900 mb-4">Latest Platform Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 text-xs font-bold uppercase tracking-wider text-secondary-500">
                    <th className="pb-3">Attendee</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {(stats?.recentRegistrations || []).map((r, i) => (
                    <tr key={i} className="hover:bg-secondary-50">
                      <td className="py-3 font-semibold text-secondary-900">{r.attendeeName}</td>
                      <td className="py-3 text-secondary-600">{r.eventTitle}</td>
                      <td className="py-3 font-bold text-emerald-600">${r.price}</td>
                      <td className="py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-secondary-500 text-xs">{new Date(r.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Governance Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-secondary-300 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">All User Roles</option>
              <option value="ADMIN">Platform Admin</option>
              <option value="ORGANIZER">Event Organizer</option>
              <option value="STAFF">Event Staff</option>
              <option value="SPEAKER">Speaker</option>
              <option value="SPONSOR">Sponsor</option>
              <option value="ATTENDEE">Attendee</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-secondary-200 text-xs font-bold uppercase tracking-wider text-secondary-500">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-secondary-50">
                    <td className="py-3 font-semibold text-secondary-900">{u.name}</td>
                    <td className="py-3 text-secondary-600">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs font-bold rounded-lg border border-secondary-200 px-2 py-1 bg-white"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="SPEAKER">SPEAKER</option>
                        <option value="SPONSOR">SPONSOR</option>
                        <option value="ATTENDEE">ATTENDEE</option>
                      </select>
                    </td>
                    <td className="py-3 text-secondary-600 text-xs">{u.organizationId?.name || '—'}</td>
                    <td className="py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleUser(u._id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${u.isActive ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Organizations */}
      {activeTab === 'orgs' && (
        <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizations.map(org => (
              <div key={org._id} className="border border-secondary-200 rounded-xl p-5 hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-100 text-primary-700">
                    {org.subscriptionPlan || 'PRO'}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">● Active</span>
                </div>
                <h4 className="text-base font-bold text-secondary-900">{org.name}</h4>
                <p className="text-xs text-secondary-500 mt-1 line-clamp-2">{org.description || 'Enterprise conference organization'}</p>
                <div className="mt-4 pt-3 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-600">
                  <span>Max Events: {org.settings?.maxEvents || 10}</span>
                  <span>Limit: {org.settings?.maxAttendeesPerEvent || 500} seats</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
