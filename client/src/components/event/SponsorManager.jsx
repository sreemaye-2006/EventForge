import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const SponsorManager = ({ eventId }) => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', tier: 'Gold', logoUrl: '', websiteUrl: '' });

  useEffect(() => {
    fetchSponsors();
  }, [eventId]);

  const fetchSponsors = async () => {
    try {
      const response = await api.get(`/organizer/events/${eventId}/sponsors`);
      setSponsors(response.data);
    } catch (error) {
      console.error('Failed to fetch sponsors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizer/events/${eventId}/sponsors`, formData);
      setFormData({ name: '', tier: 'Gold', logoUrl: '', websiteUrl: '' });
      setShowForm(false);
      fetchSponsors();
    } catch (error) {
      console.error('Failed to add sponsor', error);
    }
  };

  const handleDelete = async (sponsorId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/sponsors/${sponsorId}`);
      fetchSponsors();
    } catch (error) {
      console.error('Failed to delete sponsor', error);
    }
  };

  if (loading) return <div>Loading sponsors...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sponsors</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Sponsor
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
          <input
            type="text"
            placeholder="Sponsor Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <select
            value={formData.tier}
            onChange={(e) => setFormData({...formData, tier: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
          <input
            type="url"
            placeholder="Logo URL"
            value={formData.logoUrl}
            onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Website URL"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
            className="p-2 border rounded"
          />
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-full">No sponsors added yet.</p>
        ) : (
          sponsors.map(sponsor => (
            <div key={sponsor._id || sponsor.id} className="flex flex-col items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 text-center relative">
              <button 
                onClick={() => handleDelete(sponsor._id || sponsor.id)} 
                className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-20 h-20 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain p-2"/> : <span className="text-xs text-gray-400">Logo</span>}
              </div>
              <h4 className="font-semibold text-gray-800">{sponsor.name}</h4>
              <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full mt-1">{sponsor.tier}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SponsorManager;
