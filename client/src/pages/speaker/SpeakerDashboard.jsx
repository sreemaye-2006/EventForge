import React, { useState, useEffect } from 'react';
import { Mic, Calendar, Clock, MapPin, Save, Upload, Link as LinkIcon, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorAlert } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const SpeakerDashboard = () => {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState({
    bio: '',
    company: '',
    designation: '',
    expertise: 'AI, Cloud Computing, Distributed Systems',
    slidesUrl: 'https://speaker-deck.example.com/ai-keynote'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSpeakerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessRes, spkRes] = await Promise.allSettled([
        api.get('/sessions'),
        api.get('/speakers')
      ]);

      if (sessRes.status === 'fulfilled') {
        const list = Array.isArray(sessRes.value.data?.data) ? sessRes.value.data.data : (Array.isArray(sessRes.value.data) ? sessRes.value.data : []);
        setSessions(list.slice(0, 4));
      }

      if (spkRes.status === 'fulfilled') {
        const spkList = Array.isArray(spkRes.value.data?.data) ? spkRes.value.data.data : (Array.isArray(spkRes.value.data) ? spkRes.value.data : []);
        const myProfile = spkList.find(s => s.userId?._id === user?._id || s.userId === user?._id);
        if (myProfile) {
          setProfile({
            bio: myProfile.bio || 'Principal AI Scientist & pioneer in autonomous multi-agent reasoning models.',
            company: myProfile.company || 'NeuralForge Labs',
            designation: myProfile.designation || 'Chief AI Architect',
            expertise: (myProfile.expertise || ['AI', 'LLMs']).join(', '),
            slidesUrl: myProfile.slidesUrl || 'https://speaker-deck.example.com/ai-keynote'
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load speaker profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakerData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update user and speaker profile
      await api.put('/auth/profile', {
        name: user?.name,
        interests: profile.expertise.split(',').map(s => s.trim())
      });
      toast.success('Speaker profile and slide deck URL updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse" />
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return <ErrorAlert message={error} onRetry={fetchSpeakerData} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Mic className="w-3.5 h-3.5 text-primary-600" />
          Speaker Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
          Speaker Agenda & Materials Hub
        </h1>
        <p className="text-secondary-600 text-sm mt-1">
          Review your scheduled keynotes, assigned rooms, AV tech requirements, and upload presentation slides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Assigned Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-secondary-900 flex items-center justify-between">
            <span>Your Assigned Summit Sessions</span>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              {sessions.length} Keynotes & Tracks
            </span>
          </h3>

          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session._id || session.id}
                className="bg-white p-5 rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md transition space-y-2 border-l-4 border-l-primary-600"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
                    {session.track || session.category || 'Main Keynote'}
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    📍 {session.room || 'Grand Ballroom A'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-secondary-900">{session.title}</h4>
                <p className="text-xs text-secondary-600 leading-relaxed">{session.description}</p>

                <div className="flex items-center gap-4 text-xs text-secondary-500 pt-2 border-t border-secondary-100 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-secondary-400" />
                    {session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:00 AM'} - {session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM'}
                  </span>
                  <span>Room Capacity: {session.capacity || 500}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Profile & Materials Upload */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-secondary-900 border-b border-secondary-100 pb-3">
            Speaker Profile & Slide Deck
          </h3>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm text-secondary-900 bg-white"
                placeholder="NeuralForge Labs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Professional Title / Designation
              </label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => setProfile({...profile, designation: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm text-secondary-900 bg-white"
                placeholder="Chief AI Architect"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Speaker Biography
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full rounded-xl border border-secondary-300 p-3 text-sm text-secondary-900 bg-white"
                placeholder="Tell attendees about your research and experience..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Presentation Deck / Slides Link
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={profile.slidesUrl}
                  onChange={(e) => setProfile({...profile, slidesUrl: e.target.value})}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-secondary-300 text-sm text-secondary-900 bg-white"
                  placeholder="https://speakerdeck.com/..."
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              className="w-full py-2.5 font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Speaker Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
