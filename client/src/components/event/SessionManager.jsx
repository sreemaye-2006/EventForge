import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const SessionManager = ({ eventId }) => {
  const [sessions, setSessions] = useState([]);
  const [venues, setVenues] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    capacity: '',
    venueId: '',
    speakerId: ''
  });

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [sessRes, venRes, spkRes] = await Promise.all([
        api.get(`/organizer/events/${eventId}/sessions`),
        api.get(`/organizer/events/${eventId}/venues`),
        api.get(`/organizer/events/${eventId}/speakers`)
      ]);
      setSessions(sessRes.data);
      setVenues(venRes.data);
      setSpeakers(spkRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/organizer/events/${eventId}/sessions`, formData);
      setFormData({ title: '', startTime: '', endTime: '', capacity: '', venueId: '', speakerId: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session (Conflict error?)');
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/sessions/${sessionId}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sessions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Session
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4 border border-gray-100">
          <input
            type="text"
            placeholder="Session Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
              className="p-2 border rounded"
            />
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
              className="p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              required
              className="p-2 border rounded"
            />
            <select
              value={formData.venueId}
              onChange={(e) => setFormData({...formData, venueId: e.target.value})}
              required
              className="p-2 border rounded"
            >
              <option value="">Select Venue</option>
              {venues.map(v => <option key={v._id || v.id} value={v._id || v.id}>{v.name}</option>)}
            </select>
            <select
              value={formData.speakerId}
              onChange={(e) => setFormData({...formData, speakerId: e.target.value})}
              className="p-2 border rounded"
            >
              <option value="">Select Speaker (Optional)</option>
              {speakers.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No sessions added yet.</p>
        ) : (
          sessions.map(session => (
            <div key={session._id || session.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <h4 className="font-semibold text-gray-800">{session.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Capacity: {session.capacity}</p>
              </div>
              <button onClick={() => handleDelete(session._id || session.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionManager;
