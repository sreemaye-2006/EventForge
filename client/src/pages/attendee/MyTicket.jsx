import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../services/api';

const MyTicket = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await api.get(`/attendee/tickets/${id}`);
                setTicket(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load ticket');
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading ticket...</div>;
    if (error || !ticket) return <div className="p-8 text-center text-red-500">{error || 'Ticket not found'}</div>;

    const qrValue = JSON.stringify({ ticketId: ticket.id, eventId: ticket.event.id });

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <Link to="/attendee/dashboard" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
            </div>
            
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-6 text-center">
                    <h1 className="text-3xl font-bold mb-2">{ticket.event.title}</h1>
                    <p className="text-blue-100">{new Date(ticket.event.date).toLocaleString()} | {ticket.event.location}</p>
                </div>
                
                <div className="p-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="space-y-4 mb-8 md:mb-0">
                        <div>
                            <p className="text-sm text-gray-500">Attendee Name</p>
                            <p className="text-lg font-semibold">{ticket.attendeeName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ticket Type</p>
                            <p className="text-lg font-semibold">{ticket.ticketType.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ticket ID</p>
                            <p className="text-lg font-semibold font-mono">{ticket.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ticket.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {ticket.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border">
                        <QRCodeSVG value={qrValue} size={200} />
                        <p className="mt-4 text-sm text-gray-500 text-center max-w-[200px]">
                            Present this QR code at the event entrance for scanning.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTicket;
