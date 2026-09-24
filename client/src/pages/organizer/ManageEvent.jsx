import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar, Ticket, Heart, Tag } from 'lucide-react';
import VenueManager from '../../components/event/VenueManager';
import SpeakerManager from '../../components/event/SpeakerManager';
import SessionManager from '../../components/event/SessionManager';
import TicketManager from '../../components/event/TicketManager';
import SponsorManager from '../../components/event/SponsorManager';
import CouponManager from '../../components/event/CouponManager';

const ManageEvent = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('venues');

  const tabs = [
    { id: 'venues', name: 'Venues', icon: MapPin },
    { id: 'speakers', name: 'Speakers', icon: Users },
    { id: 'sessions', name: 'Sessions', icon: Calendar },
    { id: 'tickets', name: 'Tickets', icon: Ticket },
    { id: 'sponsors', name: 'Sponsors', icon: Heart },
    { id: 'coupons', name: 'Coupons', icon: Tag },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Link to="/organizer/events" className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} className="mr-2" /> Back to Events
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Event</h1>
        <p className="text-gray-500 mt-2">Configure event details and settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'venues' && <VenueManager eventId={id} />}
          {activeTab === 'speakers' && <SpeakerManager eventId={id} />}
          {activeTab === 'sessions' && <SessionManager eventId={id} />}
          {activeTab === 'tickets' && <TicketManager eventId={id} />}
          {activeTab === 'sponsors' && <SponsorManager eventId={id} />}
          {activeTab === 'coupons' && <CouponManager eventId={id} />}
        </div>
      </div>
    </div>
  );
};

export default ManageEvent;
