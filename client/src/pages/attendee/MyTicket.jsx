import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Calendar, MapPin, Printer, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState, ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const MyTicket = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const response = await api.get(`/attendee/tickets/${id}`);
          const ticketData = response.data?.data || response.data;
          setSelectedTicket(ticketData);
          setTickets([ticketData]);
        } else {
          const response = await api.get('/attendee/tickets');
          const ticketList = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
          setTickets(ticketList);
          if (ticketList.length > 0) setSelectedTicket(ticketList[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && tickets.length === 0) {
    return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;
  }

  if (!selectedTicket && tickets.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No active tickets found"
        description="You have not registered for any conferences yet. Explore upcoming summits to claim your verified pass."
        actionText="Browse Upcoming Events"
        actionLink="/events"
      />
    );
  }

  const ticket = selectedTicket || tickets[0];
  const ticketIdStr = ticket.registrationNumber || ticket.id || ticket._id || 'REG-PASS-2026';
  const qrValue = ticket.qrData || JSON.stringify({
    ticketId: ticketIdStr,
    eventId: ticket.event?.id || ticket.eventId?._id,
    attendee: ticket.attendeeName
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/dashboard/attendee"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          {tickets.length > 1 && (
            <div className="flex gap-1.5 bg-white border border-secondary-200 rounded-xl p-1 shadow-sm">
              {tickets.map((t, idx) => {
                const isCurrent = (selectedTicket?.id || selectedTicket?._id) === (t.id || t._id);
                return (
                  <button
                    key={t.id || t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      isCurrent
                        ? 'bg-primary-600 text-white'
                        : 'text-secondary-600 hover:bg-secondary-100'
                    }`}
                  >
                    Pass #{idx + 1}
                  </button>
                );
              })}
            </div>
          )}

          <Button
            onClick={handlePrint}
            variant="secondary"
            size="sm"
            className="font-bold bg-white border-secondary-300 flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Badge Pass
          </Button>
        </div>
      </div>

      {/* Official Digital Badge Pass Card */}
      <div className="bg-white border-2 border-secondary-200 rounded-3xl shadow-xl overflow-hidden print:border-black">
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full font-bold mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Verified Event Pass
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{ticket.event?.title || 'Tech Summit'}</h1>
          <p className="text-primary-100 mt-2 text-xs sm:text-sm font-medium">
            📅 {new Date(ticket.event?.date || ticket.registeredAt || Date.now()).toLocaleDateString()} • 📍 {ticket.event?.location || 'Metropolitan Tech Center, San Francisco'}
          </p>
        </div>

        {/* Pass Center Content */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 w-full md:w-1/2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Attendee Name</p>
              <p className="text-xl font-extrabold text-secondary-900">{ticket.attendeeName || 'Attendee'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Ticket Tier</p>
                <p className="text-sm font-bold text-primary-700">{ticket.ticketType?.name || 'VIP Executive Pass'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400">Status</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  ticket.status === 'checked_in' || ticket.status === 'CHECKED_IN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {(ticket.status || 'VALID').toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 mb-1">Registration Code</p>
              <p className="text-sm font-mono font-extrabold text-secondary-800 bg-secondary-100 px-3 py-1.5 rounded-xl inline-block border border-secondary-200">
                {ticketIdStr}
              </p>
            </div>

            <p className="text-xs text-secondary-500 italic">
              Present this digital pass at the entrance scanner for rapid express check-in and printed lanyard badge.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center p-6 bg-secondary-50 rounded-2xl border-2 border-dashed border-secondary-300 w-full md:w-auto shadow-inner">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={false} />
            </div>
            <p className="mt-3 text-[11px] text-secondary-500 text-center max-w-[200px] font-bold uppercase tracking-wider">
              Scan at Entrance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTicket;
