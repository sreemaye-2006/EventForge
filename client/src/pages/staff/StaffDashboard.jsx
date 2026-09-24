import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/staff/stats/today');
                setStats(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading staff dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold">Staff Dashboard</h1>
                <Link to="/staff/scanner" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
                    Open QR Scanner
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Today's Check-ins</h3>
                    <p className="text-4xl font-bold mt-2">{stats?.todayCheckins || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Expected</h3>
                    <p className="text-4xl font-bold mt-2">{stats?.totalExpected || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Active Events Today</h3>
                    <p className="text-4xl font-bold mt-2">{stats?.activeEventsCount || 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-semibold">Recent Check-ins</h2>
                </div>
                <div className="p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b text-gray-600 text-sm bg-gray-50">
                                <th className="p-4">Attendee</th>
                                <th className="p-4">Event</th>
                                <th className="p-4">Time</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats?.recentCheckins || []).map((checkin, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium">{checkin.attendeeName}</td>
                                    <td className="p-4">{checkin.eventName}</td>
                                    <td className="p-4">{new Date(checkin.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-4">
                                        <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold">
                                            Success
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recentCheckins || stats.recentCheckins.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">No recent check-ins</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
