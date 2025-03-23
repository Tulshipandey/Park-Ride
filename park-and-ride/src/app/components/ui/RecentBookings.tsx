'use client';

import { FaCalendarCheck, FaMapMarkerAlt, FaArrowRight, FaClock, FaCar, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';
import { useBookings } from '../../lib/bookingService';

const RecentBookings = () => {
  const { user } = useAuth();
  const { bookings } = useBookings(user?.uid);
  
  // Sort bookings by date for display
  const sortedBookings = [...(bookings || [])].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 3); // Show at most 3 recent bookings
  
  // Check if user has active or upcoming bookings
  const hasActiveBookings = bookings?.some(booking => booking.status === 'active') || false;
  const hasUpcomingBookings = bookings?.some(booking => booking.status === 'confirmed' || booking.status === 'pending') || false;
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Recent Activity</h2>
            <p className="text-gray-600">
              {sortedBookings.length > 0 
                ? "Here's a summary of your recent parking activity." 
                : "You haven't made any bookings yet."}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link 
              href="/booking"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Book New Parking <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        
        {sortedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {sortedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className={`px-4 py-2 ${
                  booking.status === 'active' ? 'bg-green-600' 
                  : booking.status === 'confirmed' ? 'bg-blue-600'
                  : booking.status === 'pending' ? 'bg-yellow-600'
                  : booking.status === 'canceled' ? 'bg-red-600'
                  : 'bg-gray-600'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    <span className="text-xs opacity-75">ID: {booking.id.slice(-6)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start mb-3">
                    <FaMapMarkerAlt className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{booking.location}</p>
                      <p className="text-sm text-gray-500">Slot {booking.slot}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <FaCalendarCheck className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{booking.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaClock className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{booking.startTime} - {booking.endTime}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between">
                    {booking.status === 'active' && (
                      <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        <FaCar className="mr-1" /> Get QR Code
                      </Link>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                      <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        View Details
                      </Link>
                    )}
                    {booking.status === 'canceled' && (
                      <span className="text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" /> Canceled
                      </span>
                    )}
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">More Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaCar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h3>
            <p className="text-gray-600 mb-6">
              Book your first parking spot now and enjoy hassle-free parking.
            </p>
            <Link 
              href="/booking"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Book Now <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}
        
        {/* Quick status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${hasActiveBookings ? 'border-green-500' : 'border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasActiveBookings ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FaCar className={`h-5 w-5 ${hasActiveBookings ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Active Parking</p>
                <p className={`text-lg font-semibold ${hasActiveBookings ? 'text-green-600' : 'text-gray-400'}`}>
                  {hasActiveBookings ? 'Available' : 'None'}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${hasUpcomingBookings ? 'border-blue-500' : 'border-gray-300'}`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasUpcomingBookings ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <FaCalendarCheck className={`h-5 w-5 ${hasUpcomingBookings ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Upcoming Bookings</p>
                <p className={`text-lg font-semibold ${hasUpcomingBookings ? 'text-blue-600' : 'text-gray-400'}`}>
                  {hasUpcomingBookings ? 'Scheduled' : 'None'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Locations</p>
                <p className="text-lg font-semibold text-gray-800">12 Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FaClock className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Next Shuttle</p>
                <p className="text-lg font-semibold text-gray-800">15 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentBookings; 