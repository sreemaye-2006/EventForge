import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Ticket,
  Heart,
  Tag,
  Megaphone,
  UserCheck,
  BarChart3,
  Sparkles,
  Send,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';
import VenueManager from '../../components/event/VenueManager';
import SpeakerManager from '../../components/event/SpeakerManager';
import SessionManager from '../../components/event/SessionManager';
import TicketManager from '../../components/event/TicketManager';
import SponsorManager from '../../components/event/SponsorManager';
import CouponManager from '../../components/event/CouponManager';
import Button from '../../components/ui/Button';

const ManageEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [attendees, setAttendees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Announcement modal state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    priority: 'NORMAL',
    targetAudience: 'ALL'
  });

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const [evRes, attRes, annRes, analRes] = await Promise.allSettled([
        api.get(`/organizer/events/${id}`),
        api.get(`/registrations/event/${id}`),
        api.get(`/announcements?eventId=${id}`),
        api.get(`/analytics/${id}`)
      ]);

      if (evRes.status === 'fulfilled') setEvent(evRes.value.data?.data || evRes.value.data);
      if (attRes.status === 'fulfilled') setAttendees(attRes.value.data?.data || attRes.value.data || []);
      if (annRes.status === 'fulfilled') setAnnouncements(annRes.value.data?.data || annRes.value.data || []);
      if (analRes.status === 'fulfilled') setAnalytics(analRes.value.data?.data || analRes.value.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', { ...newAnnouncement, eventId: id });
      toast.success('Announcement broadcasted successfully!');
      setNewAnnouncement({ title: '', message: '', priority: 'NORMAL', targetAudience: 'ALL' });
      const annRes = await api.get(`/announcements?eventId=${id}`);
      setAnnouncements(annRes.data?.data || annRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send announcement');
    }
  };

  const tabs = [
    { id: 'sessions', name: 'Sessions & Conflict Guard', icon: Calendar },
    { id: 'venues', name: 'Venues & Rooms', icon: MapPin },
    { id: 'speakers', name: 'Speakers', icon: Users },
    { id: 'tickets', name: 'Ticket Tiers', icon: Ticket },
    { id: 'sponsors', name: 'Sponsors & Deliverables', icon: Heart },
    { id: 'coupons', name: 'Coupons & Promo', icon: Tag },
    { id: 'attendees', name: `Attendees (${attendees.length})`, icon: UserCheck },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'analytics', name: 'Summit Analytics', icon: BarChart3 }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard/organizer/events"
            className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Events
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            {event?.title || 'Manage Summit'}
          </h1>
          <p className="text-xs text-secondary-500 mt-1">
            {event?.category} • {event?.eventType} • Capacity: {event?.capacity || 1000} seats
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/organizer/ai-assistant">
            <Button variant="secondary" size="sm" className="bg-white border-secondary-300 font-bold flex items-center gap-1.5 text-primary-700 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Studio
            </Button>
          </Link>
          <Link to={`/events/${id}`}>
            <Button variant="primary" size="sm" className="font-bold">
              Public Event Page &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="flex border-b border-secondary-200 overflow-x-auto bg-secondary-50 p-2 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-600 hover:bg-white hover:text-secondary-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'sessions' && <SessionManager eventId={id} />}
          {activeTab === 'venues' && <VenueManager eventId={id} />}
          {activeTab === 'speakers' && <SpeakerManager eventId={id} />}
          {activeTab === 'tickets' && <TicketManager eventId={id} />}
          {activeTab === 'sponsors' && <SponsorManager eventId={id} />}
          {activeTab === 'coupons' && <CouponManager eventId={id} />}

          {/* Attendees Tab */}
          {activeTab === 'attendees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-secondary-900">Registered Attendees ({attendees.length})</h3>
                <span className="text-xs text-secondary-500">Live ticket holder registry</span>
              </div>
              {attendees.length === 0 ? (
                <p className="p-8 text-center text-sm text-secondary-500 bg-secondary-50 rounded-xl">No attendees registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-secondary-200 text-xs font-bold uppercase tracking-wider text-secondary-500">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Ticket Pass</th>
                        <th className="pb-3">Registration ID</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                      {attendees.map((reg) => (
                        <tr key={reg._id} className="hover:bg-secondary-50">
                          <td className="py-3 font-semibold text-secondary-900">{reg.attendeeId?.name || 'Attendee'}</td>
                          <td className="py-3 text-secondary-600">{reg.attendeeId?.email || '—'}</td>
                          <td className="py-3 font-medium text-primary-700">{reg.ticketTypeId?.name || 'Standard Pass'}</td>
                          <td className="py-3 font-mono text-xs text-secondary-600">{reg.registrationNumber || reg._id}</td>
                          <td className="py-3">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${reg.status === 'CHECKED_IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-green-100 text-green-800'}`}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateAnnouncement} className="bg-secondary-50 p-5 rounded-2xl border border-secondary-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-700">Broadcast Official Announcement</h4>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keynote Room & Schedule Update"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Message *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Type broadcast message for attendees..."
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                    className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Target Audience</label>
                    <select
                      value={newAnnouncement.targetAudience}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, targetAudience: e.target.value})}
                      className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm bg-white"
                    >
                      <option value="ALL">All Participants</option>
                      <option value="ATTENDEES">Attendees Only</option>
                      <option value="SPEAKERS">Speakers Only</option>
                      <option value="STAFF">Staff Only</option>
                      <option value="SPONSORS">Sponsors Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Priority</label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                      className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm bg-white"
                    >
                      <option value="NORMAL">Normal Priority</option>
                      <option value="HIGH">High Priority</option>
                      <option value="URGENT">Urgent Alert</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" className="font-bold flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    Publish Announcement
                  </Button>
                </div>
              </form>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-700">Recent Broadcasts</h4>
                {announcements.length === 0 ? (
                  <p className="text-sm text-secondary-500 text-center py-4 bg-secondary-50 rounded-xl">No announcements published yet.</p>
                ) : (
                  announcements.map((a) => (
                    <div key={a._id} className="p-4 border border-secondary-200 rounded-xl bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                          {a.targetAudience || 'ALL'}
                        </span>
                        <span className="text-[10px] text-secondary-400">{new Date(a.createdAt).toLocaleString()}</span>
                      </div>
                      <h5 className="font-bold text-secondary-900 text-sm">{a.title}</h5>
                      <p className="text-xs text-secondary-600 leading-relaxed">{a.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Confirmed Attendees</p>
                  <p className="text-2xl font-extrabold text-secondary-900 mt-1">{analytics?.totalRegistrations || attendees.length}</p>
                </div>
                <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Gross Ticket Sales</p>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">${(analytics?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div className="bg-secondary-50 p-5 rounded-xl border border-secondary-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-secondary-500">Checked-In Rate</p>
                  <p className="text-2xl font-extrabold text-indigo-600 mt-1">{analytics?.attendanceRate || '85.5'}%</p>
                </div>
              </div>

              {analytics?.ticketSales && (
                <div className="bg-white p-5 rounded-xl border border-secondary-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-700 mb-4">Ticket Sales Breakdown</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.ticketSales}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvent;
