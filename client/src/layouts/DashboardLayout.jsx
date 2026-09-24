import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-secondary-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-center border-b border-secondary-200">
          <Link to="/dashboard" className="text-2xl font-bold text-primary-600">EventForge</Link>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/dashboard" className="block px-4 py-2 text-secondary-700 bg-primary-50 rounded-md font-medium text-sm hover:bg-primary-100">
            Overview
          </Link>
          <Link to="/dashboard/events" className="block px-4 py-2 text-secondary-600 rounded-md font-medium text-sm hover:bg-secondary-100 hover:text-secondary-900">
            My Events
          </Link>
          <Link to="/dashboard/settings" className="block px-4 py-2 text-secondary-600 rounded-md font-medium text-sm hover:bg-secondary-100 hover:text-secondary-900">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-secondary-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button 
            className="lg:hidden p-2 text-secondary-600 hover:text-secondary-900 focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1" /> {/* Spacer */}

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-secondary-700">
              {user?.name || 'User'}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
