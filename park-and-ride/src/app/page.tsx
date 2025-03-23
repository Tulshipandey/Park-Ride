'use client';

import { useAuth } from './lib/AuthContext';
import Hero from './components/ui/Hero';
import Features from './components/ui/Features';
import Testimonials from './components/ui/Testimonials';
import CTA from './components/ui/CTA';
import QuickSearch from './components/ui/QuickSearch';
import HowItWorks from './components/ui/HowItWorks';
import RecentBookings from './components/ui/RecentBookings';

export default function Home() {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a minimal loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      
      {user ? (
        // Logged-in user experience
        <>
          <RecentBookings />
          <Features />
          <CTA customText="Upgrade Your Parking Experience" buttonText="Book Premium Spot" />
        </>
      ) : (
        // Guest experience
        <>
          <QuickSearch />
          <HowItWorks />
          <Features />
          <Testimonials />
          <CTA />
        </>
      )}
    </div>
  );
}
