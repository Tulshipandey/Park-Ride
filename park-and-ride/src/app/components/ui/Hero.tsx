'use client';

import { FaParking, FaMapMarkedAlt, FaRegClock, FaCalendarAlt, FaCar, FaQrcode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';
import { useBookings } from '../../lib/bookingService';

const Hero = () => {
  const { user } = useAuth();
  const { bookings } = useBookings(user?.uid);
  
  // Get active and upcoming bookings for logged-in users
  const activeBookings = bookings?.filter(booking => booking.status === 'active') || [];
  const upcomingBookings = bookings?.filter(booking => 
    booking.status === 'pending' || booking.status === 'confirmed'
  ) || [];

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-20 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {user ? (
          // LOGGED IN USER EXPERIENCE
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Welcome back, <span className="text-yellow-300">{user.email?.split('@')[0] || 'User'}</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  {activeBookings.length > 0 
                    ? "You have active parking. View your QR code for check-out below."
                    : upcomingBookings.length > 0
                      ? "You have upcoming bookings. Get ready for your trip!"
                      : "Ready to book your next parking spot?"}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-start gap-4">
                  <Link href="/booking" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-blue-700 hover:text-white transition duration-300 text-center">
                    Book Now
                  </Link>
                  <Link href="/dashboard" className="inline-block bg-transparent text-white border-2 border-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 text-center">
                    My Dashboard
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Parking Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`rounded-lg p-4 ${activeBookings.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <div className="flex items-center mb-2">
                        <FaCar className={`h-5 w-5 ${activeBookings.length > 0 ? 'text-green-600' : 'text-gray-500'}`} />
                        <span className="ml-2 font-medium">{activeBookings.length} Active Parking</span>
                      </div>
                      {activeBookings.length > 0 && (
                        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">View QR Code →</Link>
                      )}
                    </div>
                    
                    <div className={`rounded-lg p-4 ${upcomingBookings.length > 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <div className="flex items-center mb-2">
                        <FaCalendarAlt className={`h-5 w-5 ${upcomingBookings.length > 0 ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="ml-2 font-medium">{upcomingBookings.length} Upcoming Bookings</span>
                      </div>
                      {upcomingBookings.length > 0 && (
                        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">View Details →</Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Quick Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/booking" className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100">
                        <FaParking className="mr-2" /> Book Parking
                      </Link>
                      <Link href="/tracking" className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100">
                        <FaMapMarkedAlt className="mr-2" /> Track Shuttle
                      </Link>
                      <Link href="/dashboard" className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100">
                        <FaQrcode className="mr-2" /> View QR Codes
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          // GUEST EXPERIENCE - Original Content
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Park. Ride. <span className="text-yellow-300">Arrive Relaxed.</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  Seamless parking and transportation solution for your daily commute or travel needs.
                  Book, pay, and track in one place.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
                  <Link href="/booking" className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-blue-700 hover:text-white transition duration-300 text-center">
                    Book Now
                  </Link>
                  <Link href="/auth/register" className="inline-block bg-transparent text-white border-2 border-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 text-center">
                    Sign Up Free
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full lg:w-1/2 lg:pl-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Why Choose Park&Ride?</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                        <FaParking className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Guaranteed Parking</h4>
                        <p className="text-gray-600">Reserve your spot in advance and never worry about finding parking again.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                        <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Real-Time Tracking</h4>
                        <p className="text-gray-600">Know exactly when your shuttle arrives with our live tracking system.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                        <FaRegClock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-800">Time-Saving</h4>
                        <p className="text-gray-600">Skip the hassle of city parking and reduce your commute time.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero; 