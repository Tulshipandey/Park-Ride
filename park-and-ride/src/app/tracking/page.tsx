'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkedAlt, FaLocationArrow, FaShuttleVan, FaRegClock, FaCalendarAlt, FaArrowRight, FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import { useBookings } from '../lib/bookingService';

// Shuttle data type
interface Shuttle {
  id: number;
  name: string;
  location: string;
  heading: string;
  nextStop: string;
  capacity: string;
}

// Booking data type
interface ShuttleBookingData {
  type: string;
  shuttleId: number;
  shuttleName: string;
  route: string;
  date: string;
  time: string;
  passengers: number;
  specialRequests: string;
}

// Props for the booking form
interface ShuttleBookingFormProps {
  shuttle: Shuttle;
  onClose: () => void;
  onBook: (bookingData: ShuttleBookingData) => void;
}

const shuttleData: Shuttle[] = [
  { id: 1, name: 'Shuttle A', location: 'Downtown Station', heading: 'North Terminal', nextStop: '5 min', capacity: '70%' },
  { id: 2, name: 'Shuttle B', location: 'Airport Terminal', heading: 'South Plaza', nextStop: '3 min', capacity: '85%' },
  { id: 3, name: 'Shuttle C', location: 'North Station', heading: 'Downtown', nextStop: '10 min', capacity: '45%' },
  { id: 4, name: 'Shuttle D', location: 'West Hub', heading: 'East Plaza', nextStop: '7 min', capacity: '60%' },
];

// Generate times for the next 24 hours in 30 minute increments
const generateTimes = () => {
  const times: string[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Round to the nearest 30 minutes
  const startMinute = currentMinute < 30 ? 30 : 0;
  const startHour = currentMinute < 30 ? currentHour : currentHour + 1;
  
  // Generate 48 time slots (24 hours)
  for (let i = 0; i < 48; i++) {
    const hour = (startHour + Math.floor(i / 2)) % 24;
    const minute = (startMinute + (i % 2) * 30) % 60;
    
    // Format the time
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedTime = `${formattedHour}:${minute === 0 ? '00' : minute} ${period}`;
    
    times.push(formattedTime);
  }
  
  return times;
};

const ShuttleBookingForm = ({ shuttle, onClose, onBook }: ShuttleBookingFormProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [specialRequests, setSpecialRequests] = useState(false);
  const [requestDetails, setRequestDetails] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const times = generateTimes();
  
  // Get tomorrow's date as default
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setTime(times[0]);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a booking object
    const bookingData: ShuttleBookingData = {
      type: 'shuttle',
      shuttleId: shuttle.id,
      shuttleName: shuttle.name,
      route: `${shuttle.location} to ${shuttle.heading}`,
      date,
      time,
      passengers,
      specialRequests: specialRequests ? requestDetails : '',
    };
    
    // Book the shuttle
    onBook(bookingData);
    setBookingSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
    }, 3000);
  };
  
  if (bookingSuccess) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-4 text-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Shuttle Booked Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your {shuttle.name} shuttle has been booked for {date} at {time}.
          </p>
          <p className="text-sm text-gray-500">You can view your booking details in your dashboard.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Book {shuttle.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {times.map((t, index) => (
                <option key={index} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
          <input
            type="number"
            min="1"
            max="20"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="specialRequests"
              checked={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
              I have special requirements (wheelchair access, extra luggage, etc.)
            </label>
          </div>
          
          {specialRequests && (
            <textarea
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              placeholder="Please describe your special requirements..."
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required={specialRequests}
            />
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                You&apos;re booking a shuttle from <strong>{shuttle.location}</strong> to <strong>{shuttle.heading}</strong>.
                Current capacity is <strong>{shuttle.capacity}</strong>.
              </p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Book Shuttle <FaArrowRight className="ml-2" />
        </button>
      </form>
    </div>
  );
};

const TrackingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedShuttle, setSelectedShuttle] = useState<number | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { createBooking } = useBookings(user?.uid);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Enforce authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);
  
  // Return loading state if authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Prevent rendering if user is not authenticated
  if (!user) {
    return null;
  }
  
  const handleShuttleSelect = (shuttleId: number) => {
    setSelectedShuttle(shuttleId);
    setShowBookingForm(false); // Reset booking form state when changing shuttle
    setBookingConfirmed(false);
  };
  
  const handleBookShuttle = () => {
    setShowBookingForm(true);
  };
  
  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };
  
  const handleBookingSubmit = (bookingData: ShuttleBookingData) => {
    // Format the booking data to match the Booking interface
    const newBooking = {
      location: bookingData.route,
      slot: `Passengers: ${bookingData.passengers}`,
      date: new Date(bookingData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      startTime: bookingData.time,
      endTime: 'Arrival Time', // This would be calculated in a real app
      status: 'confirmed' as const,
      userId: user.uid,
      // Add shuttle-specific data
      shuttleId: bookingData.shuttleId,
      shuttleName: bookingData.shuttleName,
      specialRequests: bookingData.specialRequests,
    };
    
    // Create the booking using the booking service
    createBooking(newBooking);
    
    // Update state to show confirmation
    setBookingConfirmed(true);
    setShowBookingForm(false);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 py-12 text-black">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Track & Book Shuttles</h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Monitor shuttle locations in real-time and book your shuttle rides for seamless transportation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shuttle List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <FaShuttleVan className="mr-2" /> Active Shuttles
              </h2>
            </div>
            
            <div className="p-4 text-black">
              <div className="space-y-4 text-black">
                {shuttleData.map(shuttle => (
                  <div 
                    key={shuttle.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShuttle === shuttle.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                    onClick={() => handleShuttleSelect(shuttle.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">{shuttle.name}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Capacity: {shuttle.capacity}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaLocationArrow className="text-blue-500 mr-2" />
                        <span>Current: {shuttle.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkedAlt className="text-blue-500 mr-2" />
                        <span>Heading to: {shuttle.heading}</span>
                      </div>
                      <div className="flex items-center">
                        <FaRegClock className="text-blue-500 mr-2" />
                        <span>Next stop in: {shuttle.nextStop}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Map and Booking Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <FaMapMarkedAlt className="mr-2" /> Live Tracking Map
              </h2>
            </div>
            
            <div className="p-6 min-h-[400px] flex flex-col">
              {selectedShuttle ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                      <FaShuttleVan className="text-white text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-black">
                      {shuttleData.find(s => s.id === selectedShuttle)?.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Live tracking is available in the mobile app for a better experience.
                    </p>
                    
                    {bookingConfirmed ? (
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FaCheck className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Booking Confirmed</h3>
                            <p className="text-sm text-green-700 mt-1">
                              Your shuttle booking has been confirmed! View it in your dashboard.
                            </p>
                            <div className="mt-4">
                              <button
                                onClick={() => router.push('/dashboard')}
                                className="text-sm text-green-700 font-medium bg-green-100 px-3 py-1 rounded-md hover:bg-green-200"
                              >
                                Go to Dashboard <FaArrowRight className="inline ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : showBookingForm ? null : (
                      <button
                        onClick={handleBookShuttle}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
                      >
                        <FaCalendarAlt className="mr-2" /> Book This Shuttle
                      </button>
                    )}
                  </div>
                  
                  {showBookingForm && (
                    <ShuttleBookingForm
                      shuttle={shuttleData.find(s => s.id === selectedShuttle) as Shuttle}
                      onClose={handleCloseBookingForm}
                      onBook={handleBookingSubmit}
                    />
                  )}
                </>
              ) : (
                <div className="text-center h-full flex flex-col items-center justify-center">
                  <p className="text-gray-600 mb-2">Select a shuttle to view its live location.</p>
                  <FaMapMarkedAlt className="text-gray-400 text-6xl mx-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage; 