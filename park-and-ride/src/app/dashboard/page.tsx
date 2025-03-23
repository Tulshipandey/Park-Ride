'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { FaCalendarAlt, FaTicketAlt, FaHistory, FaMapMarkedAlt, FaCar, FaCreditCard, FaSignOutAlt, FaQrcode } from 'react-icons/fa';
import ProfileManager from './components/ProfileManager';
import SupportCenter from './components/SupportCenter';
import BookingQR from './components/BookingQR';
import { useBookings } from '../lib/bookingService';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { bookings, loading: loadingBookings } = useBookings(user?.uid);
  const [activeParkings, setActiveParkings] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'support' | 'bookings'>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);
  
  // Calculate active and upcoming bookings
  useEffect(() => {
    if (bookings.length > 0) {
      const active = bookings.filter(booking => booking.status === 'active').length;
      const upcoming = bookings.filter(booking => 
        booking.status === 'pending' || booking.status === 'confirmed'
      ).length;
      
      setActiveParkings(active);
      setUpcomingBookings(upcoming);
    }
  }, [bookings]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  // Get user's recent bookings for the overview
  const recentBookings = bookings.slice(0, 3).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get upcoming bookings for the overview
  console.log("All bookings:", bookings.map(b => ({id: b.id, status: b.status})));
  
  const upcomingBookingsList = bookings
    .filter(booking => booking.status === 'pending' || booking.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);
  
  console.log("Upcoming bookings:", upcomingBookingsList.map(b => ({id: b.id, status: b.status})));
    
  // Get recent canceled bookings
  const canceledBookings = bookings
    .filter(booking => booking.status === 'canceled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManager />;
      case 'support':
        return <SupportCenter />;
      case 'bookings':
        return <BookingQR />;
      case 'overview':
      default:
        return (
          <>
            <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user.email?.split('@')[0]}</h2>
              <p className="text-gray-600">
                Manage your parking spots, bookings, and shuttle tracking from your personal dashboard.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${activeParkings > 0 ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Parkings</p>
                    <p className="text-2xl font-bold text-gray-800">{activeParkings}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${upcomingBookings > 0 ? 'border-blue-500' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">{upcomingBookings}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Shuttle Status</p>
                    <p className="text-lg font-bold text-gray-800">On Schedule</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="p-6">
                  {recentBookings.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <li key={booking.id} className="py-4 flex">
                          <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <FaTicketAlt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.status === 'active' ? 'Active Parking' : 
                               booking.status === 'completed' ? 'Parking Completed' : 'Parking Booked'}
                            </p>
                            <p className="text-sm text-gray-500">{booking.location} - Slot {booking.slot}</p>
                            <p className="text-xs text-gray-400">{booking.date} - {booking.startTime}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 py-4">No recent activity to display</p>
                  )}
                  {bookings.length > 3 && (
                    <div className="mt-4">
                      <a href="/dashboard/history" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all activity →
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">Upcoming Bookings</h3>
                </div>
                <div className="p-6">
                  {upcomingBookingsList.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {upcomingBookingsList.map((booking) => (
                        <li key={booking.id} className="py-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.location} - Slot {booking.slot}</p>
                              <p className="text-xs text-gray-500">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 py-4">No upcoming bookings</p>
                  )}
                  <div className="mt-4">
                    <a href="/booking" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Book new parking spot →
                    </a>
                  </div>
                </div>
              </div>
              
              {canceledBookings.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                  <div className="bg-red-600 px-6 py-4">
                    <h3 className="text-lg font-semibold text-white">Recently Cancelled Bookings</h3>
                  </div>
                  <div className="p-6">
                    <ul className="divide-y divide-gray-200">
                      {canceledBookings.map((booking) => (
                        <li key={booking.id} className="py-4">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{booking.location} - Slot {booking.slot}</p>
                              <p className="text-xs text-gray-500">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                            </div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <FaQrcode className="mr-1" />
                  <span>Bookings & QR</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'support'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Support
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
            >
              <FaSignOutAlt className="mr-1" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
        
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 