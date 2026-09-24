import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const SpeakerManager = ({ eventId }) => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', imageUrl: '' });

  useEffect(() => {
    fetchSpeakers();
  }, [eventId]);

  const fetchSpeakers = async () => {
    try {
      const response = await api.get(`/organizer/events/${eventId}/speakers`);
      setSpeakers(response.data);
    } catch (error) {
      console.error('Failed to fetch speakers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizer/events/${eventId}/speakers`, formData);
      setFormData({ name: '', bio: '', imageUrl: '' });
      setShowForm(false);
      fetchSpeakers();
    } catch (error) {
      console.error('Failed to add speaker', error);
    }
  };

  const handleDelete = async (speakerId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/speakers/${speakerId}`);
      fetchSpeakers();
    } catch (error) {
      console.error('Failed to delete speaker', error);
    }
  };

  if (loading) return <div>Loading speakers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Speakers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Speaker
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4 border border-gray-100">
          <input
            type="text"
            placeholder="Speaker Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <input
            type="url"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {speakers.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-2">No speakers added yet.</p>
        ) : (
          speakers.map(speaker => (
            <div key={speaker._id || speaker.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0">
                {speaker.imageUrl ? <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover"/> : null}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{speaker.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{speaker.bio}</p>
              </div>
              <button onClick={() => handleDelete(speaker._id || speaker.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpeakerManager;
