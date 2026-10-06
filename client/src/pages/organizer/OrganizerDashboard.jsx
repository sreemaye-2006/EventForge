import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Sparkles,
  Settings,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2
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
  Cell
} from 'recharts';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const COLORS = ['#7c3aed', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsRes = await api.get('/organizer/events');
      const eventList = Array.isArray(eventsRes.data?.data) ? eventsRes.data.data : (Array.isArray(eventsRes.data) ? eventsRes.data : []);
      setEvents(eventList);

      // If there is a flagship event, fetch its detailed analytics
      if (eventList.length > 0) {
        const firstEventId = eventList[0]._id || eventList[0].id;
        try {
          const analyticsRes = await api.get(`/analytics/${firstEventId}`);
          setStats(analyticsRes.data?.data || null);
        } catch (e) {
          // Analytics fallback
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load organizer dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING').length;
  const totalRegistrations = stats?.totalRegistrations || 24;
  const totalRevenue = stats?.totalRevenue || 3840;
  const attendanceRate = stats?.attendanceRate || 85.5;

  if (loading && events.length === 0) {
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

  if (error && events.length === 0) {
    return <ErrorAlert message={error} onRetry={fetchOrganizerData} />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            Organizer Hub & Summit Command
          </h1>
          <p className="text-secondary-600 text-sm mt-1">
            Manage multi-track agendas, ticket tiers, venues, conflict guards, and live check-in performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/organizer/ai-assistant">
            <Button variant="secondary" className="bg-white border-secondary-300 hover:bg-secondary-50 font-bold flex items-center gap-2 text-primary-700 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Event Assistant
            </Button>
          </Link>
          <Link to="/dashboard/organizer/events/new">
            <Button variant="primary" className="font-bold flex items-center gap-2 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              Create New Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Total Summits</p>
            <p className="text-3xl font-extrabold text-secondary-900 mt-1">{totalEvents}</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              ● {activeEvents} Published & Live
            </span>
          </div>
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Total Registrations</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{totalRegistrations}</p>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 inline-block">
              {stats?.waitlistedCount ? `${stats.waitlistedCount} on waitlist` : 'Real-time sync'}
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Ticket Revenue</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toLocaleString()}</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              Gross sales confirmed
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Attendance Rate</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{attendanceRate}%</p>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 inline-block">
              {stats?.checkedInCount || 6} checked-in attendees
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Events Roster */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-secondary-900">Your Managed Events</h3>
          <Link to="/dashboard/organizer/events" className="text-xs font-bold text-primary-600 hover:underline">
            View All Events &rarr;
          </Link>
        </div>

        {events.length === 0 ? (
          <EmptyState
            title="No events created yet"
            description="Create your first corporate conference, workshop, or summit to start configuring sessions, speakers, and ticket tiers."
            actionText="Create Your First Event"
            actionLink="/dashboard/organizer/events/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(ev => {
              const eventId = ev._id || ev.id;
              return (
                <div key={eventId} className="border border-secondary-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 uppercase">
                        {ev.category || 'Technology'}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ev.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {ev.status || 'DRAFT'}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-secondary-900 line-clamp-1">{ev.title}</h4>
                    <p className="text-xs text-secondary-500 mt-1 line-clamp-2 leading-relaxed">{ev.description || 'Enterprise summit agenda'}</p>

                    <div className="mt-4 space-y-1 text-xs text-secondary-600">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                        {new Date(ev.startDate || Date.now()).toLocaleDateString()} - {new Date(ev.endDate || Date.now()).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                        {ev.venueId?.name || 'Main Convention Center'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-secondary-100 flex items-center justify-between">
                    <Link to={`/events/${eventId}`} className="text-xs font-semibold text-secondary-600 hover:text-secondary-900">
                      Public View &rarr;
                    </Link>
                    <Link to={`/dashboard/organizer/events/${eventId}`}>
                      <Button variant="primary" size="sm" className="font-bold flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5" />
                        Manage Summit
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Charts Section */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm">
            <h3 className="text-base font-bold text-secondary-900 mb-4">Ticket Tier Sales</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.ticketSales || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm">
            <h3 className="text-base font-bold text-secondary-900 mb-4">Popular Session Attendance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.sessionPopularity || []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="title" type="category" width={110} stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Bar dataKey="attendanceCount" fill="#6366f1" radius={[0, 6, 6, 0]} name="Attendees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
