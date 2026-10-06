import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Sparkles, Save, ArrowLeft, Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    eventType: 'Conference',
    category: 'Technology',
    capacity: 1000,
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    description: '',
    shortDescription: '',
    status: 'PUBLISHED'
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/organizer/events/${id}`);
      const event = res.data?.data || res.data;
      if (event) {
        setFormData({
          title: event.title || '',
          startDate: event.startDate ? new Date(event.startDate).toISOString().substring(0, 16) : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().substring(0, 16) : '',
          eventType: event.eventType || 'Conference',
          category: event.category || 'Technology',
          capacity: event.capacity || 1000,
          bannerImage: event.bannerImage || '',
          description: event.description || '',
          shortDescription: event.shortDescription || '',
          status: event.status || 'PUBLISHED'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
      toast.error('Please enter an event title first.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post('/ai/description', {
        title: formData.title,
        type: formData.eventType,
        category: formData.category
      });
      const generated = res.data?.data || res.data?.description || '';
      if (generated) {
        setFormData(prev => ({ ...prev, description: generated }));
        toast.success('AI description generated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/organizer/events/${id}`, formData);
        toast.success('Event updated successfully!');
      } else {
        await api.post('/organizer/events', formData);
        toast.success('Event created successfully!');
      }
      navigate('/dashboard/organizer/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-secondary-200">
      <div className="flex items-center justify-between border-b border-secondary-100 pb-4 mb-6">
        <Link
          to="/dashboard/organizer/events"
          className="flex items-center text-xs font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Events List
        </Link>
        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
          {isEdit ? 'Editing Summit' : 'New Summit Setup'}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 mb-6">
        {isEdit ? 'Edit Event Details' : 'Create New Conference or Summit'}
      </h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-medium"
            placeholder="e.g. Global AI & Cloud Summit 2026"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              Event Type
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 bg-white"
            >
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Seminar">Seminar</option>
              <option value="Corporate Meeting">Corporate Meeting</option>
              <option value="Hackathon">Hackathon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2.5 text-sm text-secondary-900 bg-white"
            >
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
              Capacity Limit
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm text-secondary-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1.5">
            Banner Image URL
          </label>
          <input
            type="url"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm text-secondary-900"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700">
              Event Description *
            </label>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {aiLoading ? 'AI Crafting...' : 'AI Assist Write'}
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
            className="w-full rounded-xl border border-secondary-300 p-4 text-sm text-secondary-900 leading-relaxed focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="Detailed overview of themes, workshops, speaker tracks..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-secondary-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/organizer/events')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="font-bold flex items-center gap-2 shadow-md shadow-primary-600/20"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Publish & Configure Summit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
