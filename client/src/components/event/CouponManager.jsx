import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const CouponManager = ({ eventId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', discountPercentage: '', validUntil: '', usageLimit: '' });

  useEffect(() => {
    fetchCoupons();
  }, [eventId]);

  const fetchCoupons = async () => {
    try {
      const response = await api.get(`/organizer/events/${eventId}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/organizer/events/${eventId}/coupons`, formData);
      setFormData({ code: '', discountPercentage: '', validUntil: '', usageLimit: '' });
      setShowForm(false);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to add coupon', error);
    }
  };

  const handleDelete = async (couponId) => {
    try {
      await api.delete(`/organizer/events/${eventId}/coupons/${couponId}`);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon', error);
    }
  };

  if (loading) return <div>Loading coupons...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Coupons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-100">
          <input
            type="text"
            placeholder="Code (e.g. SAVE20)"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
            required
            className="p-2 border rounded uppercase"
          />
          <input
            type="number"
            placeholder="Discount %"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
            required
            min="1"
            max="100"
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Usage Limit (Optional)"
            value={formData.usageLimit}
            onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
            min="1"
            className="p-2 border rounded"
          />
          <div className="md:col-span-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {coupons.length === 0 ? (
          <p className="text-gray-500 text-sm">No coupons created yet.</p>
        ) : (
          coupons.map(coupon => (
            <div key={coupon._id || coupon.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 border-l-4 border-l-green-500">
              <div>
                <h4 className="font-bold text-gray-800 font-mono">{coupon.code}</h4>
                <p className="text-sm text-gray-500">
                  {coupon.discountPercentage}% off • Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                  {coupon.usageLimit ? ` • Limit: ${coupon.usageLimit}` : ' • No limit'}
                </p>
              </div>
              <button onClick={() => handleDelete(coupon._id || coupon.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponManager;
