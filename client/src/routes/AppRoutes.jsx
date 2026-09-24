import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Assuming standard layout import if available, else standard routes
import AdminDashboard from '../pages/admin/AdminDashboard';
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import SpeakerDashboard from '../pages/speaker/SpeakerDashboard';
import SponsorDashboard from '../pages/sponsor/SponsorDashboard';

// Mock components for pages that might not be created yet in this prompt
const AttendeeDashboard = () => <div className="p-8 text-center text-2xl font-bold">Attendee Dashboard</div>;
const StaffDashboard = () => <div className="p-8 text-center text-2xl font-bold">Staff Dashboard</div>;
const Login = () => <div className="p-8 text-center text-2xl font-bold">Login Page</div>;
const Unauthorized = () => <div className="p-8 text-center text-2xl font-bold text-red-600">Unauthorized Access</div>;
const Home = () => <div className="p-8 text-center text-2xl font-bold">EventForge Home</div>;

// Role-based Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure user object exists and has the appropriate role
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Organizer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
        <Route path="/organizer" element={<OrganizerDashboard />} />
      </Route>

      {/* Speaker Routes */}
      <Route element={<ProtectedRoute allowedRoles={['speaker']} />}>
        <Route path="/speaker" element={<SpeakerDashboard />} />
      </Route>

      {/* Sponsor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['sponsor']} />}>
        <Route path="/sponsor" element={<SponsorDashboard />} />
      </Route>

      {/* Attendee Routes */}
      <Route element={<ProtectedRoute allowedRoles={['attendee']} />}>
        <Route path="/attendee" element={<AttendeeDashboard />} />
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
