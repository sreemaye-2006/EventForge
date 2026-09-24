import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const EventDiscovery = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [search, category]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            
            const response = await api.get(`/events?${params.toString()}`);
            setEvents(response.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to search events');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="border rounded px-4 py-2 flex-grow"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="border rounded px-4 py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="tech">Tech</option>
                    <option value="music">Music</option>
                    <option value="business">Business</option>
                    <option value="art">Art</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading events...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : events.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No events found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col">
                            {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />}
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                                <p className="text-gray-700 line-clamp-3 mb-4 flex-grow">{event.description}</p>
                                <Link to={`/events/${event.id}`} className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventDiscovery;
