import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Sparkles,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  Megaphone,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const AttendeeDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await Promise.allSettled([
        api.get('/attendee/tickets'),
        api.get('/events?upcoming=true'),
        api.get('/recommendations'),
        api.get('/announcements')
      ]);

      const [ticketsRes, eventsRes, recsRes, annRes] = results;

      if (ticketsRes.status === 'fulfilled') {
        const tData = Array.isArray(ticketsRes.value.data?.data)
          ? ticketsRes.value.data.data
          : (Array.isArray(ticketsRes.value.data) ? ticketsRes.value.data : []);
        setTickets(tData);
      }

      if (eventsRes.status === 'fulfilled') {
        const eData = Array.isArray(eventsRes.value.data?.data)
          ? eventsRes.value.data.data
          : (Array.isArray(eventsRes.value.data) ? eventsRes.value.data : []);
        setUpcomingEvents(eData);
      }

      if (recsRes.status === 'fulfilled') {
        const rData = Array.isArray(recsRes.value.data?.data)
          ? recsRes.value.data.data
          : (Array.isArray(recsRes.value.data) ? recsRes.value.data : []);
        setRecommendations(rData);
      }

      if (annRes.status === 'fulfilled') {
        const aData = Array.isArray(annRes.value.data?.data)
          ? annRes.value.data.data
          : (Array.isArray(annRes.value.data) ? annRes.value.data : []);
        setAnnouncements(aData);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && tickets.length === 0 && upcomingEvents.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-secondary-200 animate-pulse" />
          ))}
        </div>
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && tickets.length === 0 && upcomingEvents.length === 0) {
    return <ErrorAlert message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            Attendee Hub & Passes
          </h1>
          <p className="text-secondary-600 text-sm mt-1">
            Access your verified digital QR passes, recommended tracks, and conference schedule.
          </p>
        </div>
        <Link to="/events">
          <Button variant="primary" className="font-bold flex items-center gap-2 shadow-sm">
            <Compass className="w-4 h-4" />
            Discover Events
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Active Passes</p>
            <p className="text-3xl font-extrabold text-primary-600 mt-1">{tickets.length}</p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              ● QR tickets ready
            </span>
          </div>
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Available Summits</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{upcomingEvents.length}</p>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 inline-block">
              Open registration
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Recommended Tracks</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{recommendations.length}</p>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 inline-block">
              Personalized AI match
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Section 1: My Tickets & Passes */}
      <section className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-secondary-900">My Confirmed Event Passes</h2>
          </div>
          {tickets.length > 0 && (
            <Link to="/dashboard/attendee/tickets" className="text-xs font-bold text-primary-600 hover:underline">
              Open Official QR Pass &rarr;
            </Link>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-8 text-center space-y-3">
            <p className="text-sm text-secondary-600">You don't have any active event passes yet.</p>
            <Link to="/events">
              <Button variant="primary" size="sm" className="font-bold">
                Browse & Register for Summits
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id || ticket._id}
                className="border border-secondary-200 rounded-2xl p-5 bg-gradient-to-br from-white to-secondary-50 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {ticket.ticketType?.name || 'Standard Pass'}
                    </span>
                    <span className="text-[10px] font-mono text-secondary-500 font-bold">
                      {ticket.registrationNumber || 'REG-ACTIVE'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-1 leading-snug">
                    {ticket.event?.title || 'Event'}
                  </h3>
                  <p className="text-xs text-secondary-500 mb-4">
                    📅 {new Date(ticket.event?.date || ticket.registeredAt || Date.now()).toLocaleDateString()} • 📍 {ticket.event?.location || 'San Francisco, CA'}
                  </p>
                </div>

                <Link
                  to="/dashboard/attendee/tickets"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 py-2 rounded-xl text-xs font-bold transition"
                >
                  <QrCode className="w-4 h-4" />
                  View QR Ticket Pass &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: AI Recommended Sessions */}
      <section className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold text-secondary-900">Recommended For You</h2>
              <p className="text-xs text-secondary-500">AI-matched sessions based on your profile interests & event tracks</p>
            </div>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-xs text-secondary-500 py-4">No recommendations available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(session => (
              <div
                key={session.id || session._id}
                className="border border-secondary-200 rounded-2xl p-5 bg-white border-l-4 border-l-primary-600 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 uppercase">
                      {session.track || session.category || 'AI Track'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⭐ {session.matchScore || 95}% Match
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-secondary-900 mb-1.5 leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-secondary-500 mb-2">
                    Summit: <span className="font-semibold text-secondary-800">{session.event?.title || 'Tech Summit'}</span>
                  </p>

                  <div className="text-xs text-secondary-600 space-y-1 mb-3">
                    <p>⏰ Time: {session.time || '10:00 AM'}</p>
                    <p>📍 Room: {session.room || 'Grand Ballroom A'}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-primary-50/60 border border-primary-100 text-[11px] text-primary-900 leading-tight">
                  <span className="font-bold">Why recommended:</span> {session.recommendationReason || 'Matches your interest in Artificial Intelligence and Cloud Systems.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Announcements Feed */}
      {announcements.length > 0 && (
        <section className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-secondary-900">Official Summit Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(a => (
              <div key={a._id} className="p-4 rounded-xl border border-secondary-200 bg-secondary-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    {a.targetAudience || 'ALL'}
                  </span>
                  <span className="text-[10px] text-secondary-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-secondary-900 text-sm">{a.title}</h4>
                <p className="text-xs text-secondary-600 leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AttendeeDashboard;
