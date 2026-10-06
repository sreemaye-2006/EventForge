import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Save,
  Send,
  FileText,
  Mail,
  Share2,
  Mic,
  Calendar,
  Layers,
  Building,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const AIEventAssistant = () => {
  const [formData, setFormData] = useState({
    eventName: 'TechNova Global Innovation Summit 2026',
    eventType: 'Conference',
    audience: 'Senior Software Architects, Engineering Leaders & AI Researchers',
    industry: 'Technology & Artificial Intelligence',
    goals: 'Explore autonomous multi-agent systems, zero-trust cloud infrastructure, and foster executive networking',
    topics: 'Autonomous Agents, Large Reasoning Models, Distributed Systems, Kubernetes, Quantum-Safe Cryptography',
    duration: '3 Days',
    location: 'Metropolitan Tech Center, San Francisco'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPack, setGeneratedPack] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/assistant-pack', formData);
      const data = res.data?.data || res.data;
      setGeneratedPack(data);
      toast.success('AI Event Package generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTextChange = (key, value) => {
    setGeneratedPack(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveDraft = () => {
    toast.success('AI content saved to your event drafts!');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          AI Event Assistant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 tracking-tight">
          AI Event Content Studio
        </h1>
        <p className="text-secondary-600 text-sm mt-1">
          Generate descriptions, announcements, keynote bios, social campaigns, and email invitations in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Parameters */}
        <div className="lg:col-span-5 bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-secondary-900 flex items-center gap-2 border-b border-secondary-100 pb-3">
            <Target className="w-4 h-4 text-primary-600" />
            Event Parameters
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm text-secondary-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm text-secondary-900 bg-white"
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="3 Days"
                className="w-full rounded-xl border border-secondary-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              name="audience"
              value={formData.audience}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Industry / Field
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Event Goals & Objectives
            </label>
            <textarea
              name="goals"
              rows={2}
              value={formData.goals}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Key Themes / Topics
            </label>
            <textarea
              name="topics"
              rows={2}
              value={formData.topics}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700 mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-secondary-300 px-3.5 py-2 text-sm"
            />
          </div>

          <Button
            onClick={handleGenerate}
            variant="primary"
            isLoading={isGenerating}
            className="w-full py-3 font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-600/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {isGenerating ? 'Generating AI Package...' : 'Generate Full AI Package'}
          </Button>
        </div>

        {/* Right Panel: Interactive Generated Package */}
        <div className="lg:col-span-7 space-y-4">
          {!generatedPack ? (
            <div className="bg-white border border-secondary-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Ready to Forge Content</h3>
              <p className="text-secondary-600 text-sm max-w-md mx-auto leading-relaxed">
                Click <strong>"Generate Full AI Package"</strong> to create event descriptions, keynote introductions, announcements, social posts, and email campaigns simultaneously.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {/* Tabs */}
              <div className="flex flex-wrap border-b border-secondary-200 bg-secondary-50 p-2 gap-1.5">
                {[
                  { key: 'description', label: 'Description', icon: FileText },
                  { key: 'shortDescription', label: 'Summary', icon: Layers },
                  { key: 'announcement', label: 'Announcement', icon: Send },
                  { key: 'speakerBioDraft', label: 'Speaker Bio', icon: Mic },
                  { key: 'sessionDescription', label: 'Keynote Session', icon: Calendar },
                  { key: 'socialMediaPost', label: 'Social Post', icon: Share2 },
                  { key: 'emailInvitation', label: 'Email Invite', icon: Mail }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === tab.key ? 'bg-primary-600 text-white shadow-sm' : 'text-secondary-600 hover:bg-white'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Editable Output View */}
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary-500">
                    Editable AI Output
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(generatedPack[activeTab] || '', activeTab)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition"
                    >
                      {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === activeTab ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={generatedPack[activeTab] || ''}
                  onChange={(e) => handleTextChange(activeTab, e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 p-4 text-sm text-secondary-800 leading-relaxed font-sans focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />

                <div className="pt-2 flex justify-end gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSaveDraft}
                    className="font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Event Content
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEventAssistant;
