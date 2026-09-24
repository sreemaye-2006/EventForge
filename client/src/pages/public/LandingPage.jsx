import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-6xl">
              Forge Unforgettable Events
            </h1>
            <p className="mt-6 text-lg leading-8 text-secondary-600">
              The premier platform for planning, managing, and executing corporate and personal events with seamless precision.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register">
                <Button variant="primary" size="lg">Get Started</Button>
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-secondary-900 hover:text-primary-600">
                Sign in to your account <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-secondary-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Event Mastery</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-6 text-lg leading-8 text-secondary-600">
              Manage attendees, schedules, and ticketing all in one seamless dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
