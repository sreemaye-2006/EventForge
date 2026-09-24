import React, { useState, useEffect } from 'react';

const SponsorDashboard = () => {
  const [sponsoredEvents, setSponsoredEvents] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSponsoredEvents([
        { id: 1, name: 'Tech Conference 2023', level: 'Platinum', date: 'Oct 15-17, 2023' },
        { id: 2, name: 'React Summit', level: 'Gold', date: 'Nov 5, 2023' }
      ]);
      setDeliverables([
        { id: 1, event: 'Tech Conference 2023', item: 'Logo on main stage banner', status: 'Completed' },
        { id: 2, event: 'Tech Conference 2023', item: 'Provide booth setup materials', status: 'Pending' },
        { id: 3, event: 'React Summit', item: 'Swag bag items shipment', status: 'In Progress' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="p-4 text-center">Loading Sponsor Dashboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Sponsor Dashboard</h1>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">My Sponsored Events</h2>
        {sponsoredEvents.length === 0 ? (
           <p className="text-gray-500 bg-gray-50 p-4 rounded-md">You are not sponsoring any events currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsoredEvents.map(event => (
              <div key={event.id} className="bg-white border-t-4 border-blue-500 p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-4">{event.date}</p>
                </div>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {event.level} Sponsor
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Deliverables Status</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deliverable Item</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliverables.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No deliverables found.</td>
                  </tr>
                ) : (
                  deliverables.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.event}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.item}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
