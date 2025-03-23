'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaParking, FaUser } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import { useBookings } from '../lib/bookingService';
import AvailabilityChecker from './components/AvailabilityChecker';
import ReservationCalculator from './components/ReservationCalculator';

const BookingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { createBooking } = useBookings(user?.uid);
  
  // UI state
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);

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

  const handleSelectLocation = (locationId: string, date?: string, time?: string) => {
    setSelectedLocationId(locationId);
    if (date) setSelectedDate(date);
    if (time) setSelectedTime(time);
    setShowCalculator(true);
    
    // Scroll to the calculator section
    setTimeout(() => {
      const calculatorElement = document.getElementById('cost-calculator');
      if (calculatorElement) {
        calculatorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCalculatePrice = (price: number) => {
    setCalculatedPrice(price);
  };

  const handleBookingSubmit = async (bookingData: any) => {
    const newBooking = createBooking({
      ...bookingData,
      userId: user.uid
    });
    
    if (!newBooking) {
      throw new Error('Failed to create booking');
    }
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Book Your Parking Spot</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Reserve your parking space in advance and enjoy stress-free commuting with our Park & Ride service.
          </p>
        </div>

        {/* Availability Checker Section */}
        <div className="mb-12">
          <AvailabilityChecker onSelectLocation={handleSelectLocation} />
        </div>

        {/* Cost Calculator & Booking Section */}
        {showCalculator && (
          <div id="cost-calculator" className="mb-12">
            <ReservationCalculator 
              selectedLocationId={selectedLocationId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onCalculatePrice={handleCalculatePrice}
              onBookingSubmit={handleBookingSubmit}
              userId={user.uid}
            />
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaParking className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Guaranteed Parking</h3>
            <p className="text-gray-600">
              Once you book, your spot is reserved. No more driving around looking for parking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaUser className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Free Shuttle Service</h3>
            <p className="text-gray-600">
              All parking locations include complimentary shuttle service to key destinations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <FaCalendarAlt className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-black">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Changes to your reservation can be made up to 2 hours before your booking time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 