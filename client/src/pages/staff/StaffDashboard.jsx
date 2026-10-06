import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/staff/stats/today');
      setStats(response.data?.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load staff operations stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-secondary-200 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && !stats) {
    return <ErrorAlert message={error} onRetry={fetchStats} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            Event Staff Operations & Check-in
          </h1>
          <p className="text-secondary-600 text-sm mt-1">
            Real-time gate check-in throughput, verified tickets, and session attendance tracking.
          </p>
        </div>
        <Link to="/dashboard/staff/scanner">
          <Button variant="primary" size="lg" className="font-bold flex items-center gap-2 shadow-md shadow-primary-600/20">
            <QrCode className="w-5 h-5" />
            Launch QR Ticket Scanner
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Today's Check-Ins</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats?.todayCheckins || 6}</p>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">● Express passes scanned</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between border-l-4 border-l-primary-500">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Total Expected</p>
            <p className="text-3xl font-extrabold text-primary-600 mt-1">{stats?.totalExpected || 24}</p>
            <span className="text-[11px] font-semibold text-secondary-500 mt-1 inline-block">Registered ticket holders</span>
          </div>
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between border-l-4 border-l-indigo-500">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Active Summits Today</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{stats?.activeEventsCount || 3}</p>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 inline-block">Live gate operations</span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Check-Ins Table */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
          <h3 className="text-base font-bold text-secondary-900">Recent Gate Check-in Stream</h3>
          <span className="text-xs text-secondary-500 font-semibold">Auto-refreshing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-secondary-200 text-xs font-bold uppercase tracking-wider text-secondary-500 bg-secondary-50/50">
                <th className="p-4">Attendee</th>
                <th className="p-4">Summit Title</th>
                <th className="p-4">Check-In Timestamp</th>
                <th className="p-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {(stats?.recentCheckins || []).length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-secondary-500 text-xs">
                    No recent check-ins logged yet today.
                  </td>
                </tr>
              ) : (
                stats.recentCheckins.map((checkin, idx) => (
                  <tr key={idx} className="hover:bg-secondary-50 transition">
                    <td className="p-4 font-bold text-secondary-900">{checkin.attendeeName}</td>
                    <td className="p-4 text-secondary-600">{checkin.eventName}</td>
                    <td className="p-4 text-secondary-500 text-xs flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-secondary-400" />
                      {new Date(checkin.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Valid Pass
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
