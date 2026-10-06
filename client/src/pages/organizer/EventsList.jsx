import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Edit2, Settings, Trash2, Eye, Compass, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/organizer/events');
      const list = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      setEvents(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      setEvents(prev => prev.filter(ev => (ev._id || ev.id) !== eventId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error && events.length === 0) {
    return <ErrorAlert message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
            My Organized Summits
          </h1>
          <p className="text-secondary-600 text-sm mt-1">
            Configure multi-track schedules, ticket tiers, venues, and view attendee registrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/organizer/ai-assistant">
            <Button variant="secondary" className="bg-white border-secondary-300 font-bold flex items-center gap-2 text-primary-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Assistant
            </Button>
          </Link>
          <Link to="/dashboard/organizer/events/new">
            <Button variant="primary" className="font-bold flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="You haven't created any events yet. Launch your first conference or summit today."
          actionText="Create Your First Event"
          actionLink="/dashboard/organizer/events/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventId = event._id || event.id;
            const banner = event.bannerImage || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

            return (
              <div key={eventId} className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="h-44 bg-secondary-100 relative overflow-hidden">
                    <img src={banner} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-sm uppercase">
                        {event.category || 'Technology'}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${event.status === 'PUBLISHED' ? 'bg-green-600/90 text-white' : 'bg-secondary-800/90 text-white'}`}>
                        {event.status || 'PUBLISHED'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-secondary-900 mb-1.5 line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-secondary-500 line-clamp-2 mb-4 leading-relaxed">{event.description || 'Enterprise summit agenda'}</p>

                    <div className="space-y-1.5 text-xs text-secondary-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                        <span>{new Date(event.startDate || Date.now()).toLocaleDateString()} - {new Date(event.endDate || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                        <span>{event.venueId?.name || 'Metropolitan Tech Center'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 border-t border-secondary-100 flex items-center gap-2">
                  <Link
                    to={`/dashboard/organizer/events/${eventId}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary-700 transition shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Manage
                  </Link>
                  <Link
                    to={`/dashboard/organizer/events/${eventId}/edit`}
                    className="p-2 border border-secondary-200 rounded-xl bg-white text-secondary-700 hover:bg-secondary-100 transition"
                    title="Edit Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/events/${eventId}`}
                    className="p-2 border border-secondary-200 rounded-xl bg-white text-secondary-700 hover:bg-secondary-100 transition"
                    title="Public View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={(e) => handleDeleteEvent(eventId, e)}
                    className="p-2 border border-red-200 rounded-xl bg-white text-red-600 hover:bg-red-50 transition"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsList;
