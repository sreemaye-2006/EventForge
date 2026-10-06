import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  QrCode,
  Users,
  Building2,
  Sparkles,
  Ticket,
  Compass,
  Megaphone,
  Briefcase,
  Mic,
  Award,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import NotificationDropdown from '../components/ui/NotificationDropdown';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userRole = (user?.role || 'attendee').toLowerCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const linkClass = (path) => `
    flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150
    ${isActive(path)
      ? 'bg-primary-600 text-white shadow-sm font-semibold'
      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
    }
  `;

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-secondary-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-secondary-200">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              E
            </div>
            <span className="text-xl font-extrabold tracking-tight text-secondary-900">
              Event<span className="text-primary-600">Forge</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-secondary-500 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge in Sidebar */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-secondary-900 truncate">{user?.name || 'User'}</p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                {user?.role || 'Attendee'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {userRole === 'admin' && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Platform Admin</div>
              <Link to="/dashboard/admin" className={linkClass('/dashboard/admin')} onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Overview & Stats
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Discover Events
              </Link>
            </>
          )}

          {userRole === 'organizer' && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Organizer Hub</div>
              <Link to="/dashboard/organizer" className={linkClass('/dashboard/organizer')} onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Overview
              </Link>
              <Link to="/dashboard/organizer/events" className={linkClass('/dashboard/organizer/events')} onClick={() => setIsSidebarOpen(false)}>
                <Calendar className="w-4 h-4" /> My Events
              </Link>
              <Link to="/dashboard/organizer/events/new" className={linkClass('/dashboard/organizer/events/new')} onClick={() => setIsSidebarOpen(false)}>
                <PlusCircle className="w-4 h-4" /> Create Event
              </Link>
              <Link to="/dashboard/organizer/ai-assistant" className={linkClass('/dashboard/organizer/ai-assistant')} onClick={() => setIsSidebarOpen(false)}>
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Event Assistant
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Public Discovery
              </Link>
            </>
          )}

          {userRole === 'staff' && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Staff Check-in</div>
              <Link to="/dashboard/staff" className={linkClass('/dashboard/staff')} onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> Staff Overview
              </Link>
              <Link to="/dashboard/staff/scanner" className={linkClass('/dashboard/staff/scanner')} onClick={() => setIsSidebarOpen(false)}>
                <QrCode className="w-4 h-4" /> QR Ticket Scanner
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Events Directory
              </Link>
            </>
          )}

          {userRole === 'speaker' && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Speaker Portal</div>
              <Link to="/dashboard/speaker" className={linkClass('/dashboard/speaker')} onClick={() => setIsSidebarOpen(false)}>
                <Mic className="w-4 h-4" /> Speaker Dashboard
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Discover Events
              </Link>
            </>
          )}

          {userRole === 'sponsor' && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Sponsor Portal</div>
              <Link to="/dashboard/sponsor" className={linkClass('/dashboard/sponsor')} onClick={() => setIsSidebarOpen(false)}>
                <Award className="w-4 h-4" /> Sponsor Dashboard
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Discover Events
              </Link>
            </>
          )}

          {(!userRole || userRole === 'attendee') && (
            <>
              <div className="text-[11px] font-bold uppercase tracking-wider text-secondary-400 px-3 py-1">Attendee Dashboard</div>
              <Link to="/dashboard/attendee" className={linkClass('/dashboard/attendee')} onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard className="w-4 h-4" /> My Dashboard
              </Link>
              <Link to="/dashboard/attendee/tickets" className={linkClass('/dashboard/attendee/tickets')} onClick={() => setIsSidebarOpen(false)}>
                <Ticket className="w-4 h-4" /> My Tickets & Pass
              </Link>
              <Link to="/events" className={linkClass('/events')} onClick={() => setIsSidebarOpen(false)}>
                <Compass className="w-4 h-4" /> Discover Events
              </Link>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-secondary-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-secondary-200 text-secondary-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-secondary-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-secondary-600 hover:text-secondary-900 focus:outline-none rounded-lg hover:bg-secondary-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-bold text-secondary-500 uppercase tracking-wider hidden sm:inline-block">
              {user?.role || 'Attendee'} Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <div className="h-6 w-px bg-secondary-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-secondary-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] text-secondary-500 leading-none mt-1">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-secondary-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
