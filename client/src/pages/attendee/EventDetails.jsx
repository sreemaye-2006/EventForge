import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import RegistrationFlow from './RegistrationFlow';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                setError(err.message || 'Event not found');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading event...</div>;
    if (error || !event) return <div className="p-8 text-center text-red-500">{error || 'Event not found'}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
                {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-6" />}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                        <p className="text-lg text-gray-600 mb-4">{new Date(event.date).toLocaleString()} | {event.location}</p>
                    </div>
                    <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md"
                    >
                        Register Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-3">About this Event</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-3">Schedule</h2>
                        <div className="space-y-4">
                            {(event.schedule || []).map((session, idx) => (
                                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                                    <div className="font-semibold text-lg">{session.time} - {session.title}</div>
                                    <div className="text-gray-600">{session.description}</div>
                                </div>
                            ))}
                            {(!event.schedule || event.schedule.length === 0) && <p className="text-gray-500">No schedule provided yet.</p>}
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Speakers</h2>
                        <div className="space-y-4">
                            {(event.speakers || []).map((speaker, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} /> : <span className="text-gray-500 text-sm">Img</span>}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{speaker.name}</p>
                                        <p className="text-sm text-gray-500">{speaker.role}</p>
                                    </div>
                                </div>
                            ))}
                            {(!event.speakers || event.speakers.length === 0) && <p className="text-gray-500">TBA</p>}
                        </div>
                    </section>
                    
                    <section className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Tickets</h2>
                        <div className="space-y-4">
                            {(event.ticketTypes || []).map((ticket, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold">{ticket.name}</p>
                                        <p className="text-sm text-gray-500">{ticket.description}</p>
                                    </div>
                                    <div className="font-bold">${ticket.price}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {isRegisterOpen && (
                <RegistrationFlow 
                    event={event} 
                    onClose={() => setIsRegisterOpen(false)} 
                    onSuccess={(ticketId) => {
                        setIsRegisterOpen(false);
                        navigate(`/attendee/ticket/${ticketId}`);
                    }}
                />
            )}
        </div>
    );
};

export default EventDetails;
