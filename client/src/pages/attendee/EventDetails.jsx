import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Clock,
  Mic,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import RegistrationFlow from './RegistrationFlow';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [evRes, sessRes, spkRes, sponsRes, tixRes] = await Promise.allSettled([
          api.get(`/events/${id}`),
          api.get(`/sessions?eventId=${id}`),
          api.get(`/speakers?eventId=${id}`),
          api.get(`/sponsors?eventId=${id}`),
          api.get(`/tickets?eventId=${id}`)
        ]);

        if (evRes.status === 'fulfilled') {
          setEvent(evRes.value.data?.data || evRes.value.data);
        } else {
          setError('Event not found or failed to load');
        }

        if (sessRes.status === 'fulfilled') {
          const sList = Array.isArray(sessRes.value.data?.data) ? sessRes.value.data.data : (Array.isArray(sessRes.value.data) ? sessRes.value.data : []);
          setSessions(sList);
        }

        if (spkRes.status === 'fulfilled') {
          const spkList = Array.isArray(spkRes.value.data?.data) ? spkRes.value.data.data : (Array.isArray(spkRes.value.data) ? spkRes.value.data : []);
          setSpeakers(spkList);
        }

        if (sponsRes.status === 'fulfilled') {
          const sponsList = Array.isArray(sponsRes.value.data?.data) ? sponsRes.value.data.data : (Array.isArray(sponsRes.value.data) ? sponsRes.value.data : []);
          setSponsors(sponsList);
        }

        if (tixRes.status === 'fulfilled') {
          const tixList = Array.isArray(tixRes.value.data?.data) ? tixRes.value.data.data : (Array.isArray(tixRes.value.data) ? tixRes.value.data : []);
          setTicketTypes(tixList);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  if (loading && !event) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-64 bg-secondary-200 rounded-2xl animate-pulse" />
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <ErrorAlert message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const banner = event?.bannerImage || event?.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Back to Events */}
      <Link
        to="/events"
        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Discover Events
      </Link>

      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-secondary-200 overflow-hidden shadow-sm">
        <div className="h-72 sm:h-96 relative overflow-hidden bg-secondary-900">
          <img src={banner} alt={event?.title} className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-600 text-white uppercase tracking-wider">
                {event?.category || 'Technology'}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                {event?.eventType || 'Conference'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {event?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-secondary-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-400" />
                {new Date(event?.startDate || Date.now()).toLocaleDateString()} - {new Date(event?.endDate || Date.now()).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-400" />
                {event?.venueId?.name || event?.location || 'Metropolitan Tech Center'} ({event?.venueId?.city || 'San Francisco, CA'})
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary-400" />
                Capacity: {event?.capacity || 1000} Attendees
              </span>
            </div>
          </div>
        </div>

        {/* Action Header Bar */}
        <div className="p-6 bg-secondary-50 border-t border-secondary-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Official Pass Registration</p>
            <p className="text-sm font-semibold text-secondary-800">Choose your ticket tier & apply coupons below</p>
          </div>
          <Button
            onClick={() => setIsRegisterOpen(true)}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3 font-bold shadow-md shadow-primary-600/20 flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            Register Now
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Overview, Schedule, Speakers */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Section */}
          <section className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-secondary-900">About this Summit</h2>
            <p className="text-secondary-700 text-sm leading-relaxed whitespace-pre-wrap">
              {event?.description || 'Join global pioneers and enterprise engineering leaders for an immersive conference experience.'}
            </p>
          </section>

          {/* Conference Sessions Schedule */}
          <section className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-secondary-900 flex items-center justify-between">
              <span>Conference Schedule & Tracks</span>
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                {sessions.length} Sessions
              </span>
            </h2>

            {sessions.length === 0 ? (
              <p className="text-xs text-secondary-500 py-4">Detailed session agenda will be announced shortly.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s._id || s.id} className="p-4 rounded-xl border border-secondary-200 hover:border-primary-300 transition bg-secondary-50/50 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                        {s.track || s.category || 'Main Track'}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        📍 {s.room || 'Main Hall'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-secondary-900">{s.title}</h4>
                    <p className="text-xs text-secondary-600 leading-relaxed">{s.description}</p>
                    <div className="flex items-center gap-4 text-xs text-secondary-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-secondary-400" />
                        {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:00 AM'} - {s.endTime ? new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-secondary-400" />
                        Capacity: {s.capacity || 200}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Speakers Section */}
          <section className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-secondary-900">Featured Keynote Speakers</h2>
            {speakers.length === 0 ? (
              <p className="text-xs text-secondary-500 py-4">Speaker profiles are being finalized.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map(spk => {
                  const name = spk.name || spk.userId?.name || 'Speaker';
                  const designation = spk.designation || 'Keynote Speaker';
                  const company = spk.company || 'Enterprise Labs';
                  return (
                    <div key={spk._id || spk.id} className="p-4 rounded-xl border border-secondary-200 flex items-start gap-3 bg-secondary-50/50">
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-secondary-900 text-sm truncate">{name}</h4>
                        <p className="text-xs text-secondary-600 font-medium truncate">{designation}</p>
                        <p className="text-[11px] text-primary-700 font-semibold">{company}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right 4 Cols: Tickets & Sponsors */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ticket Categories Box */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary-600" />
              Ticket Passes
            </h3>

            <div className="space-y-3">
              {(ticketTypes.length > 0 ? ticketTypes : [
                { name: 'Early Bird Pass', price: 99, capacity: 300, description: 'Standard 3-day access pass' },
                { name: 'VIP Executive Pass', price: 299, capacity: 150, description: 'VIP lounge, catered lunch & front-row seats' }
              ]).map((t, i) => (
                <div key={i} className="p-4 rounded-xl border border-secondary-200 hover:border-primary-400 transition bg-secondary-50 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-secondary-900 text-sm">{t.name}</h5>
                    <p className="text-[11px] text-secondary-500 mt-0.5">{t.description || 'Full conference access'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-primary-600">${t.price}</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setIsRegisterOpen(true)}
              variant="primary"
              className="w-full font-bold py-2.5 shadow-md shadow-primary-600/20"
            >
              Get Your Ticket
            </Button>
          </div>

          {/* Sponsors Section */}
          <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Sponsors & Partners
            </h3>
            <div className="space-y-3">
              {(sponsors.length > 0 ? sponsors : [
                { companyName: 'Google Cloud & AI', tier: 'PLATINUM' },
                { companyName: 'NeuralForge AI Systems', tier: 'GOLD' }
              ]).map((sp, i) => (
                <div key={i} className="p-3 rounded-xl border border-secondary-200 bg-secondary-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary-800">{sp.companyName || sp.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                    {sp.tier || 'PLATINUM'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Flow Modal */}
      {isRegisterOpen && (
        <RegistrationFlow
          event={{ ...event, ticketTypes }}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={(ticketId) => {
            setIsRegisterOpen(false);
            toast.success('Registration confirmed! View your pass anytime.');
            navigate('/dashboard/attendee/tickets');
          }}
        />
      )}
    </div>
  );
};

export default EventDetails;
