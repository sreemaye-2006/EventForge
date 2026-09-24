import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

const VenueManager = ({ eventId }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', capacity: '' });

  useEffect(() => {
    fetchVenues();
  }, [eventId]);

  const fetchVenues = async () => {
    try {
      const response = await api.get(`/organizer/events/${eventId}/venues`);
      setVenues(response.data);
    } catch (error) {
      console.error('Failed to fetch venues', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizer/events/${eventId}/venues`, formData);
      setFormData({ name: '', address: '', capacity: '' });
      setShowForm(false);
      fetchVenues();
    } catch (error) {
      console.error('Failed to add venue', error);
    }
  };

  const handleDelete = async (venueId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/venues/${venueId}`);
      fetchVenues();
    } catch (error) {
      console.error('Failed to delete venue', error);
    }
  };

  if (loading) return <div>Loading venues...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Venues</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Venue
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100">
          <input
            type="text"
            placeholder="Venue Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {venues.length === 0 ? (
          <p className="text-gray-500 text-sm">No venues added yet.</p>
        ) : (
          venues.map(venue => (
            <div key={venue._id || venue.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <h4 className="font-semibold text-gray-800">{venue.name}</h4>
                <p className="text-sm text-gray-500">{venue.address} • Capacity: {venue.capacity}</p>
              </div>
              <button onClick={() => handleDelete(venue._id || venue.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VenueManager;
