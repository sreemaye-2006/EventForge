import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Filter, Sparkles, Tag, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const EventDiscovery = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [eventType, setEventType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (eventType) params.append('eventType', eventType);

      const response = await api.get(`/events?${params.toString()}`);
      const list = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      setEvents(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to search events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category, eventType]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          Global Event Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
          Discover Upcoming Conferences & Summits
        </h1>
        <p className="text-secondary-600 text-sm mt-1">
          Explore world-class technical summits, executive keynotes, and immersive workshops.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-secondary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search summits by title, keywords, topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-300 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="rounded-xl border border-secondary-300 px-3.5 py-2.5 text-sm bg-white text-secondary-900 flex-1 md:flex-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            className="rounded-xl border border-secondary-300 px-3.5 py-2.5 text-sm bg-white text-secondary-900 flex-1 md:flex-none"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">All Formats</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Exhibition">Exhibition</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchEvents} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="We couldn't find any events matching your search criteria. Try adjusting your filters or search keywords."
          actionText="Clear All Filters"
          onAction={() => { setSearch(''); setCategory(''); setEventType(''); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => {
            const eventId = event._id || event.id;
            const banner = event.bannerImage || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

            return (
              <div
                key={eventId}
                className="border border-secondary-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-secondary-100 relative overflow-hidden">
                    <img src={banner} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/75 text-white backdrop-blur-sm uppercase">
                        {event.category || 'Technology'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-primary-700 font-bold mb-2">
                      <span>{event.eventType || 'Conference'}</span>
                      <span className="text-secondary-500 font-medium">Capacity: {event.capacity || 1000}</span>
                    </div>

                    <h3 className="text-xl font-bold text-secondary-900 mb-2 leading-snug line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-secondary-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {event.description || event.shortDescription}
                    </p>

                    <div className="space-y-1 text-xs text-secondary-500">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                        {new Date(event.startDate || event.date || Date.now()).toLocaleDateString()} - {new Date(event.endDate || Date.now()).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                        {event.venueId?.name || event.location || 'Metropolitan Convention Center'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 border-t border-secondary-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary-700">Registration Open</span>
                  <Link to={`/events/${eventId}`}>
                    <Button variant="primary" size="sm" className="font-bold flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventDiscovery;
