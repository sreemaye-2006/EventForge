import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const AttendeeDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [ticketsRes, eventsRes, recsRes] = await Promise.all([
                    api.get('/attendee/tickets'),
                    api.get('/events?upcoming=true'),
                    api.get('/recommendations')
                ]);
                setTickets(ticketsRes.data || []);
                setUpcomingEvents(eventsRes.data || []);
                setRecommendations(recsRes.data || []);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-4">Loading dashboard...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Attendee Dashboard</h1>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
                {tickets.length === 0 ? (
                    <p className="text-gray-500">No tickets found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <h3 className="text-xl font-medium">{ticket.event.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{new Date(ticket.event.date).toLocaleDateString()}</p>
                                <Link to={`/attendee/ticket/${ticket.id}`} className="text-blue-600 hover:underline">View Ticket</Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-500">No upcoming events.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                <h3 className="text-xl font-medium">{event.title}</h3>
                                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                                <Link to={`/events/${event.id}`} className="text-blue-600 hover:underline block mt-2">View Details</Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Recommended Sessions</h2>
                {recommendations.length === 0 ? (
                    <p className="text-gray-500">No recommendations available at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map(session => (
                            <div key={session.id} className="border rounded-lg p-4 shadow-sm bg-white border-l-4 border-blue-500">
                                <h3 className="text-xl font-medium">{session.title}</h3>
                                <p className="text-sm text-gray-600">Event: {session.event.title}</p>
                                <p className="text-sm text-gray-600">Time: {session.time}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AttendeeDashboard;
