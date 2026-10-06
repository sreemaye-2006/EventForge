import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, Mic, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../ui/Button';

const SessionManager = ({ eventId }) => {
  const [sessions, setSessions] = useState([]);
  const [venues, setVenues] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI',
    track: 'Main Track',
    room: 'Grand Ballroom A',
    startTime: '',
    endTime: '',
    capacity: 250,
    venueId: '',
    speakerIds: []
  });

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessRes, venRes, spkRes] = await Promise.all([
        api.get(`/organizer/events/${eventId}/sessions`),
        api.get(`/organizer/events/${eventId}/venues`),
        api.get(`/organizer/events/${eventId}/speakers`)
      ]);
      setSessions(Array.isArray(sessRes.data?.data) ? sessRes.data.data : (Array.isArray(sessRes.data) ? sessRes.data : []));
      setVenues(Array.isArray(venRes.data?.data) ? venRes.data.data : (Array.isArray(venRes.data) ? venRes.data : []));
      setSpeakers(Array.isArray(spkRes.data?.data) ? spkRes.data.data : (Array.isArray(spkRes.data) ? spkRes.data : []));
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
      const payload = {
        ...formData,
        eventId,
        capacity: Number(formData.capacity) || 100,
        speakerIds: Array.isArray(formData.speakerIds) ? formData.speakerIds : (formData.speakerIds ? [formData.speakerIds] : [])
      };
      await api.post(`/organizer/events/${eventId}/sessions`, payload);
      toast.success('Session created with conflict verification passed!');
      setFormData({
        title: '',
        description: '',
        category: 'AI',
        track: 'Main Track',
        room: 'Grand Ballroom A',
        startTime: '',
        endTime: '',
        capacity: 250,
        venueId: '',
        speakerIds: []
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to create session';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      await api.delete(`/organizer/events/${eventId}/sessions/${sessionId}`);
      toast.success('Session deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete session');
    }
  };

  if (loading && sessions.length === 0) return <div className="p-4 text-center text-xs text-secondary-500">Loading session schedule...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-secondary-900">Conference Sessions & Tracks</h3>
          <p className="text-xs text-secondary-500 mt-0.5">
            Automated conflict guard prevents room and speaker schedule collisions in real time.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          size="sm"
          className="flex items-center gap-1.5 font-bold"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Close Form' : 'Add Session'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Schedule Conflict Detected</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary-50 p-5 rounded-2xl border border-secondary-200 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-700">New Session Specifications</h4>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Session Title *</label>
            <input
              type="text"
              placeholder="e.g. Autonomous Agents in Enterprise Software"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm bg-white focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                required
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                required
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Room / Hall *</label>
              <input
                type="text"
                placeholder="Grand Ballroom A"
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                required
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Track</label>
              <input
                type="text"
                placeholder="AI Track"
                value={formData.track}
                onChange={(e) => setFormData({...formData, track: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              >
                <option value="AI">AI</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web Development">Web Development</option>
                <option value="Leadership">Leadership</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Capacity</label>
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                required
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Venue Assignment</label>
              <select
                value={formData.venueId}
                onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Select Venue Center</option>
                {venues.map(v => <option key={v._id || v.id} value={v._id || v.id}>{v.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">Assigned Speaker</label>
              <select
                value={formData.speakerIds[0] || ''}
                onChange={(e) => setFormData({...formData, speakerIds: e.target.value ? [e.target.value] : []})}
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Select Primary Speaker</option>
                {speakers.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name || s.userId?.name || 'Speaker'}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">Validate & Schedule Session</Button>
          </div>
        </form>
      )}

      {/* Sessions Schedule List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-secondary-500 text-sm text-center py-6 bg-secondary-50 rounded-xl">No sessions scheduled yet.</p>
        ) : (
          sessions.map(session => {
            const speakerName = session.speakerIds?.[0]?.userId?.name || session.speakerIds?.[0]?.name || 'TBA';
            return (
              <div key={session._id || session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-secondary-200 rounded-xl hover:bg-secondary-50 transition bg-white gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 uppercase">
                      {session.category || 'General'}
                    </span>
                    <span className="text-[10px] font-semibold text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded-full">
                      {session.track || 'Main Track'}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                      📍 {session.room || 'Main Hall'}
                    </span>
                  </div>
                  <h4 className="font-bold text-secondary-900 text-sm">{session.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-secondary-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary-400" />
                      {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-secondary-400" />
                      {speakerName}
                    </span>
                    <span>Max: {session.capacity || 100} seats</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(session._id || session.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition self-end sm:self-center"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionManager;
