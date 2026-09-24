import React, { useState, useEffect } from 'react';

const SpeakerDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState({ bio: '', twitter: '', linkedin: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSessions([
        { id: 1, title: 'React Performance Tuning', time: '10:00 AM', room: 'Hall A', date: '2023-10-15' },
        { id: 2, title: 'The Future of Frontend', time: '02:00 PM', room: 'Main Stage', date: '2023-10-16' }
      ]);
      setProfile({ bio: 'Frontend enthusiast sharing tips on web development.', twitter: '@speakerdev', linkedin: 'linkedin.com/in/speakerdev' });
      setLoading(false);
    }, 1000);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  if (loading) return <div className="p-4 text-center">Loading Speaker Dashboard...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Speaker Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Upcoming Assigned Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-md">No upcoming sessions assigned yet.</p>
          ) : (
            <ul className="space-y-4">
              {sessions.map(session => (
                <li key={session.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-indigo-600 mb-2">{session.title}</h3>
                  <div className="text-sm text-gray-600 flex flex-col space-y-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {session.date}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {session.time}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {session.room}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Update Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Bio</label>
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                rows="4"
                placeholder="Tell attendees about yourself..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
              <input 
                type="text" 
                value={profile.twitter} 
                onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input 
                type="text" 
                value={profile.linkedin} 
                onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                placeholder="linkedin.com/in/username"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDashboard;
