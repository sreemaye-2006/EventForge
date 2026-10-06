import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Building2,
  Mic,
  Award
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/events?status=PUBLISHED');
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setFeaturedEvents(list.slice(0, 3));
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary-50/70 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 text-primary-800 text-xs font-bold uppercase tracking-wider mb-6 border border-primary-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            Enterprise Conference & Summit Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-secondary-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Where World-Class Conferences Are <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Forged</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            The complete end-to-end SaaS platform for corporate summits, multi-track agendas, speaker management, ticket tiers, QR check-ins, and AI-powered event content.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base shadow-lg shadow-primary-500/20 font-bold flex items-center justify-center gap-2">
                <Compass className="w-5 h-5" />
                Discover Live Events
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base bg-white border-secondary-300 hover:bg-secondary-50 font-bold">
                Sign In & Demo Roles &rarr;
              </Button>
            </Link>
          </div>

          {/* Quick Platform Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm">
              <p className="text-3xl font-black text-primary-600">1,500+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 mt-1">Capacity Summits</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm">
              <p className="text-3xl font-black text-indigo-600">100%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 mt-1">Real Conflict Guard</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm">
              <p className="text-3xl font-black text-emerald-600">Fast QR</p>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 mt-1">Express Check-Ins</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm">
              <p className="text-3xl font-black text-amber-600">AI Studio</p>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary-500 mt-1">Event Assistant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Event Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              Featured Global Summit
            </span>
            <h2 className="text-3xl font-extrabold text-secondary-900 mt-2">
              Featured Conferences & Summits
            </h2>
          </div>
          <Link to="/events" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-2 md:mt-0">
            View all published events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map(event => (
            <div key={event._id || event.id} className="bg-white border border-secondary-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 uppercase tracking-wide">
                    {event.category || 'Technology'}
                  </span>
                  <span className="text-xs font-semibold text-secondary-500">
                    {event.eventType || 'Conference'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2 leading-snug">
                  {event.title}
                </h3>
                <p className="text-secondary-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {event.description || event.shortDescription}
                </p>
                <div className="text-xs text-secondary-500 space-y-1">
                  <p>📍 {event.venueId?.name || 'Metropolitan Convention Center'}</p>
                  <p>📅 {new Date(event.startDate || Date.now()).toLocaleDateString()} - {new Date(event.endDate || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 border-t border-secondary-100 bg-secondary-50 flex items-center justify-between">
                <span className="text-xs font-bold text-secondary-700">Capacity: {event.capacity || 1000}</span>
                <Link to={`/events/${event._id || event.id}`}>
                  <Button variant="primary" size="sm" className="font-semibold">
                    View Details &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Architecture Pillars */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Built for Every Stakeholder
            </h2>
            <p className="text-secondary-400 mt-3 text-base">
              A unified platform with tailored workspaces for all conference participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary-800/70 border border-secondary-700 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">Event Organizers</h4>
              <p className="text-secondary-400 text-sm mt-2 leading-relaxed">
                Multi-track scheduling, venue conflict prevention, ticket tiers, coupon codes, and AI-assisted marketing generators.
              </p>
            </div>

            <div className="bg-secondary-800/70 border border-secondary-700 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">Event Staff & Operations</h4>
              <p className="text-secondary-400 text-sm mt-2 leading-relaxed">
                Instant QR ticket validation, check-in stats tracking, duplicate prevention, and session attendance tracking.
              </p>
            </div>

            <div className="bg-secondary-800/70 border border-secondary-700 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold">Attendees & VIPs</h4>
              <p className="text-secondary-400 text-sm mt-2 leading-relaxed">
                Personalized pass with QR codes, smart AI session recommendations matching personal interests, and live updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 py-8 text-center text-secondary-500 text-sm">
        <p>© 2026 EventForge — Corporate Event & Conference Management Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
