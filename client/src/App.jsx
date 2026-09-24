import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import EventForm from './pages/organizer/EventForm';
import EventsList from './pages/organizer/EventsList';
import ManageEvent from './pages/organizer/ManageEvent';
import SpeakerDashboard from './pages/speaker/SpeakerDashboard';
import SponsorDashboard from './pages/sponsor/SponsorDashboard';
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import EventDiscovery from './pages/attendee/EventDiscovery';
import EventDetails from './pages/attendee/EventDetails';
import MyTicket from './pages/attendee/MyTicket';
import RegistrationFlow from './pages/attendee/RegistrationFlow';
import StaffDashboard from './pages/staff/StaffDashboard';
import QRScanner from './pages/staff/QRScanner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user) {
    const userRole = String(user.role || '').toLowerCase();
    const allowed = allowedRoles.map((role) => String(role).toLowerCase());
    if (!allowed.includes(userRole)) return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventDiscovery />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/register" element={<RegistrationFlow />} />
        </Route>

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="organizer" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="organizer/events" element={<ProtectedRoute allowedRoles={['organizer']}><EventsList /></ProtectedRoute>} />
          <Route path="organizer/events/new" element={<ProtectedRoute allowedRoles={['organizer']}><EventForm /></ProtectedRoute>} />
          <Route path="organizer/events/:id" element={<ProtectedRoute allowedRoles={['organizer']}><ManageEvent /></ProtectedRoute>} />
          <Route path="speaker" element={<ProtectedRoute allowedRoles={['speaker']}><SpeakerDashboard /></ProtectedRoute>} />
          <Route path="sponsor" element={<ProtectedRoute allowedRoles={['sponsor']}><SponsorDashboard /></ProtectedRoute>} />
          <Route path="attendee" element={<ProtectedRoute allowedRoles={['attendee']}><AttendeeDashboard /></ProtectedRoute>} />
          <Route path="attendee/tickets" element={<ProtectedRoute allowedRoles={['attendee']}><MyTicket /></ProtectedRoute>} />
          <Route path="staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
          <Route path="staff/scanner" element={<ProtectedRoute allowedRoles={['staff']}><QRScanner /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
