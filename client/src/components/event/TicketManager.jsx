import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const TicketManager = ({ eventId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '', type: 'Regular' });

  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const fetchTickets = async () => {
    try {
      const response = await api.get(`/organizer/events/${eventId}/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizer/events/${eventId}/tickets`, formData);
      setFormData({ name: '', price: '', quantity: '', type: 'Regular' });
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      console.error('Failed to add ticket', error);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/tickets/${ticketId}`);
      fetchTickets();
    } catch (error) {
      console.error('Failed to delete ticket', error);
    }
  };

  if (loading) return <div>Loading tickets...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tickets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Ticket Tier
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-100">
          <input
            type="text"
            placeholder="Tier Name (e.g. VIP)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            min="0"
            step="0.01"
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            required
            min="1"
            className="p-2 border rounded"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
            <option value="Early Bird">Early Bird</option>
          </select>
          <div className="md:col-span-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-sm">No tickets created yet.</p>
        ) : (
          tickets.map(ticket => (
            <div key={ticket._id || ticket.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <h4 className="font-semibold text-gray-800">{ticket.name} - ${ticket.price}</h4>
                <p className="text-sm text-gray-500">Type: {ticket.type} • Available: {ticket.quantity}</p>
              </div>
              <button onClick={() => handleDelete(ticket._id || ticket.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketManager;
