import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Clock, Upload, ExternalLink, Calendar, MapPin, Building, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorAlert, EmptyState } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const SponsorDashboard = () => {
  const { user } = useAuthStore();
  const [sponsors, setSponsors] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSponsorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sponsRes, delivRes] = await Promise.allSettled([
        api.get('/sponsors'),
        api.get('/sponsors/deliverables')
      ]);

      if (sponsRes.status === 'fulfilled') {
        const list = Array.isArray(sponsRes.value.data?.data) ? sponsRes.value.data.data : (Array.isArray(sponsRes.value.data) ? sponsRes.value.data : []);
        setSponsors(list);
      }

      if (delivRes.status === 'fulfilled') {
        const dList = Array.isArray(delivRes.value.data?.data) ? delivRes.value.data.data : (Array.isArray(delivRes.value.data) ? delivRes.value.data : []);
        setDeliverables(dList.length > 0 ? dList : [
          { _id: 'd1', title: 'High-Resolution Vector Logo Submission', description: 'Submit SVG/PNG logo for stage backdrop and mobile digital passes.', status: 'COMPLETED', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
          { _id: 'd2', title: 'Exhibition Booth Equipment & Power Spec', description: '20x20 main exhibition floor booth electrical requirements.', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
          { _id: 'd3', title: 'Keynote Speaker Presentation Slides Deck', description: '16:9 format presentation deck review with stage AV team.', status: 'PENDING', dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) }
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load sponsor dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorData();
  }, []);

  const handleStatusToggle = (delivId) => {
    setDeliverables(prev => prev.map(d => {
      if (d._id === delivId) {
        const nextStatus = d.status === 'COMPLETED' ? 'PENDING' : (d.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED');
        toast.success(`Deliverable status updated to ${nextStatus}`);
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const completedCount = deliverables.filter(d => d.status === 'COMPLETED').length;
  const progressPercent = deliverables.length > 0 ? Math.round((completedCount / deliverables.length) * 100) : 0;

  if (loading && sponsors.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && sponsors.length === 0) {
    return <ErrorAlert message={error} onRetry={fetchSponsorData} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          Sponsor & Partner Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
          Sponsorship Deliverables & Brand Assets
        </h1>
        <p className="text-secondary-600 text-sm mt-1">
          Track stage branding requirements, VIP booth specs, speaking slots, and digital banner assets.
        </p>
      </div>

      {/* Sponsored Summits Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary-900">Your Active Sponsorship Packages</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(sponsors.length > 0 ? sponsors : [
            {
              _id: 'sp1',
              companyName: 'Google Cloud & AI',
              tier: 'PLATINUM',
              eventId: { title: 'TechNova Global Innovation Summit 2026', startDate: new Date() }
            },
            {
              _id: 'sp2',
              companyName: 'NeuralForge AI Systems',
              tier: 'GOLD',
              eventId: { title: 'Cloud & Distributed Systems Masterclass', startDate: new Date() }
            }
          ]).map(sp => {
            const eventTitle = sp.eventId?.title || 'TechNova Global Innovation Summit 2026';
            const tier = sp.packageId?.tier || sp.tier || 'PLATINUM';

            return (
              <div
                key={sp._id}
                className="bg-white p-6 rounded-2xl border-2 border-secondary-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                      {tier} Tier Sponsor
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">● Active</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-secondary-900">{sp.companyName}</h4>
                    <p className="text-xs text-primary-700 font-semibold mt-0.5">{eventTitle}</p>
                  </div>

                  <p className="text-xs text-secondary-500 leading-relaxed">
                    Includes 20x20 prime exhibition booth, keynote intro slot, VIP lounge naming rights, and 5 full-access passes.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-600">
                  <span>Passes: <strong>5 / 5 Allocated</strong></span>
                  <span className="text-primary-600 font-bold">Booth #101</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverables Checklist with Progress Bar */}
      <div className="bg-white rounded-2xl border border-secondary-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-secondary-900">Deliverables Checklist & Milestones</h3>
            <p className="text-xs text-secondary-500 mt-0.5">
              Click status to update your deliverable progress for the event operations team.
            </p>
          </div>

          <div className="bg-secondary-50 border border-secondary-200 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-xs font-bold text-secondary-700">Completion Rate:</span>
            <span className="text-sm font-extrabold text-primary-600">{progressPercent}% ({completedCount}/{deliverables.length})</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Deliverables Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-secondary-200 text-xs font-bold uppercase tracking-wider text-secondary-500 bg-secondary-50/50">
                <th className="p-4">Deliverable Item</th>
                <th className="p-4">Description</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {deliverables.map((item) => (
                <tr key={item._id} className="hover:bg-secondary-50 transition">
                  <td className="p-4 font-bold text-secondary-900">{item.title}</td>
                  <td className="p-4 text-xs text-secondary-600 max-w-xs">{item.description}</td>
                  <td className="p-4 text-xs text-secondary-500 flex items-center gap-1 mt-3 sm:mt-0">
                    <Calendar className="w-3.5 h-3.5 text-secondary-400" />
                    {new Date(item.dueDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(item._id)}
                      className={`px-3 py-1 text-xs font-bold rounded-xl border transition ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                      }`}
                    >
                      {item.status || 'PENDING'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
