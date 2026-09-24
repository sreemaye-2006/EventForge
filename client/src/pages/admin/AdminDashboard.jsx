import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, organizations: 0 });
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for Admin stats
    setTimeout(() => {
      setStats({ users: 1500, organizations: 45 });
      setUsers([{ id: 1, name: 'John Doe', role: 'attendee' }, { id: 2, name: 'Jane Smith', role: 'organizer' }]);
      setOrganizations([{ id: 1, name: 'Tech Corp' }, { id: 2, name: 'Event Masters' }]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Platform Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Organizations</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.organizations}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Recent Users</h2>
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
              <li key={user.id} className="py-3 flex justify-between items-center">
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Organizations</h2>
          <ul className="divide-y divide-gray-200">
            {organizations.map(org => (
              <li key={org.id} className="py-3 font-medium text-gray-800 flex items-center">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center mr-3 font-bold">
                  {org.name.charAt(0)}
                </div>
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
