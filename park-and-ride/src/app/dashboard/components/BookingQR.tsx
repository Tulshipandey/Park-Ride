'use client';

import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheckCircle, FaQrcode, FaCar, FaSignOutAlt, FaSignInAlt, FaTimesCircle, FaTrash, FaShuttleVan, FaUserFriends, FaRegStickyNote } from 'react-icons/fa';
import QRCodeGenerator from './QRCodeGenerator';
import { useBookings } from '../../lib/bookingService';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';

interface BookingQRProps {
  bookingId?: string;
}

const BookingQR = ({ bookingId }: BookingQRProps) => {
  const { user } = useAuth();
  const { bookings, loading, error, updateBooking, deleteBooking, refreshBookings } = useBookings(user?.uid);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'qrcode' | 'active'>('details');
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // If bookingId is provided, select that booking
    if (bookingId && bookings.length > 0) {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setSelectedBooking(booking);
      }
    }
    
    // If there's an active booking, default to active tab
    const activeBooking = bookings.find(b => b.status === 'active');
    if (activeBooking) {
      setSelectedBooking(activeBooking);
      setActiveTab('active');
    }
  }, [bookingId, bookings]);

  // Debug logging
  useEffect(() => {
    if (selectedBooking) {
      console.log("Selected booking:", selectedBooking.id);
      console.log("Active tab:", activeTab);
    }
  }, [selectedBooking, activeTab]);

  const handleCheckout = (bookingId: string) => {
    if (confirm('Are you sure you want to check out from this parking spot?')) {
      updateBooking(bookingId, { status: 'completed' });
      alert('Check-out successful!');
      setActiveTab('details');
    }
  };

  const handleCheckin = (bookingId: string) => {
    if (confirm('Are you sure you want to check in to this parking spot?')) {
      const updated = updateBooking(bookingId, { status: 'active' });
      if (updated) {
        setCheckinSuccess(true);
        setTimeout(() => {
          setCheckinSuccess(false);
          setActiveTab('active');
        }, 2000);
      }
    }
  };
  
  const handleCancel = (bookingId: string) => {
    if (cancelConfirm === bookingId) {
      // User has confirmed cancelation
      const success = updateBooking(bookingId, { status: 'canceled' });
      if (success) {
        alert('Booking cancelled successfully!');
        // Refresh bookings to ensure the UI is updated
        refreshBookings();
      } else {
        alert('Failed to cancel booking. Please try again.');
      }
      setCancelConfirm(null);
    } else {
      // Ask for confirmation
      setCancelConfirm(bookingId);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">There was an error loading your bookings. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if booking is a shuttle booking
  const isShuttleBooking = (booking: any) => {
    return booking.shuttleId !== undefined;
  };

  // Shuttle booking details component
  const ShuttleBookingDetails = ({ booking }: { booking: any }) => {
    return (
      <div className="py-4">
        <div className="flex items-center mb-3">
          <FaShuttleVan className="text-blue-600 text-xl mr-3" />
          <div>
            <h3 className="font-medium text-gray-900">{booking.shuttleName || 'Shuttle Service'}</h3>
            <p className="text-sm text-gray-600">Shuttle ID: {booking.shuttleId}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Route</p>
              <p className="text-gray-600">{booking.location}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaCalendarAlt className="text-blue-600 mt-1 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Date</p>
              <p className="text-gray-600">{booking.date}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaClock className="text-blue-600 mt-1 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Departure Time</p>
              <p className="text-gray-600">{booking.startTime}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaUserFriends className="text-blue-600 mt-1 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Passengers</p>
              <p className="text-gray-600">{booking.slot.includes('Passengers') ? booking.slot : '1'}</p>
            </div>
          </div>
          
          {booking.specialRequests && (
            <div className="flex items-start">
              <FaRegStickyNote className="text-blue-600 mt-1 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Special Requests</p>
                <p className="text-gray-600">{booking.specialRequests}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // If a specific booking was requested
  if (bookingId && selectedBooking) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Booking Details</h3>
        
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'qrcode' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('qrcode')}
          >
            QR Code
          </button>
        </div>
        
        {activeTab === 'details' && (
          <div className="w-full max-w-md">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-blue-600 mr-2" />
                <p className="text-gray-800 font-medium">{selectedBooking.location} - Slot {selectedBooking.slot}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <p className="text-gray-800">{selectedBooking.date}</p>
              </div>
              <div className="flex items-center">
                <FaClock className="text-blue-600 mr-2" />
                <p className="text-gray-800">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500">Booking ID: {selectedBooking.id}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedBooking.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : selectedBooking.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedBooking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'qrcode' && (
          <div>
            <QRCodeGenerator booking={selectedBooking} />
            
            {selectedBooking.status === 'confirmed' && (
              <div className="mt-4 flex justify-center">
                {checkinSuccess ? (
                  <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Check-in successful! Redirecting to active parking...
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckin(selectedBooking.id)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaSignInAlt className="mr-2" />
                    <span>Check-in Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Otherwise show list of all bookings
  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <FaCalendarAlt className="mr-2" /> My Bookings
        </h2>
      </div>
      
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('active')}
        >
          <div className="flex items-center">
            <FaCar className="mr-1" />
            <span>Active Bookings</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('details')}
        >
          All Bookings
        </button>
      </div>
      
      {activeTab === 'active' ? (
        <div className="p-6">
          {bookings.filter(b => b.status === 'active').length === 0 ? (
            <div className="text-center py-8">
              <FaCar className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No active bookings found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Parking */}
              {bookings.filter(b => b.status === 'active' && !isShuttleBooking(b)).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Active Parking</h3>
                  
                  {bookings
                    .filter(b => b.status === 'active' && !isShuttleBooking(b))
                    .map(booking => (
                      <div key={booking.id}>
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <FaMapMarkerAlt className="text-green-600 mr-2" />
                            <p className="text-gray-800 font-medium">{booking.location} - Slot {booking.slot}</p>
                          </div>
                          <div className="flex items-center mb-2">
                            <FaCalendarAlt className="text-green-600 mr-2" />
                            <p className="text-gray-800">{booking.date}</p>
                          </div>
                          <div className="flex items-center mb-4">
                            <FaClock className="text-green-600 mr-2" />
                            <p className="text-gray-800">{booking.startTime} - {booking.endTime}</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-800 mb-3">Check-out QR Code:</p>
                            <div className="flex justify-center">
                              <QRCodeGenerator booking={booking} />
                            </div>
                            <div className="mt-4 text-center">
                              <p className="text-sm text-gray-600 mb-2">Use this QR code when leaving the parking area</p>
                              <button
                                onClick={() => handleCheckout(booking.id)}
                                className="flex items-center mx-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                <FaSignOutAlt className="mr-2" />
                                <span>Check-out</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              
              {/* Active Shuttle Bookings */}
              {bookings.filter(b => b.status === 'active' && isShuttleBooking(b)).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Active Shuttle Bookings</h3>
                  
                  {bookings
                    .filter(b => b.status === 'active' && isShuttleBooking(b))
                    .map(booking => (
                      <div key={booking.id} className="mb-4">
                        <div className="flex items-center mb-2">
                          <FaShuttleVan className="text-blue-600 mr-2" />
                          <p className="text-gray-800 font-medium">{booking.shuttleName || 'Shuttle'} - {booking.location}</p>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-blue-600 mr-2" />
                          <p className="text-gray-800">{booking.date}</p>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaClock className="text-blue-600 mr-2" />
                          <p className="text-gray-800">{booking.startTime}</p>
                        </div>
                        {booking.slot && booking.slot.includes('Passengers') && (
                          <div className="flex items-center mb-4">
                            <FaUserFriends className="text-blue-600 mr-2" />
                            <p className="text-gray-800">{booking.slot}</p>
                          </div>
                        )}
                        
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-3">Boarding Pass:</p>
                          <div className="flex justify-center">
                            <QRCodeGenerator booking={booking} />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 mb-2">Present this QR code when boarding the shuttle</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : activeTab === 'details' ? (
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">No bookings found</p>
              <button
                onClick={() => router.push('/booking')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book a Parking Spot
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600">
                View your parking and shuttle bookings below. You can manage your bookings, view QR codes for parking check-in/out and shuttle boarding.
              </p>
              
              {/* Upcoming Bookings Section */}
              {bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">Upcoming Bookings</h3>
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.status === 'confirmed' || b.status === 'pending')
                      .map(booking => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              {isShuttleBooking(booking) ? (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaShuttleVan className="text-blue-600 mr-2" />
                                    <p className="text-gray-800 font-medium">{booking.shuttleName || 'Shuttle'} - {booking.location}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-blue-600 mr-2" />
                                    <p className="text-gray-800">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-blue-600 mr-2" />
                                    <p className="text-gray-800">{booking.startTime}</p>
                                  </div>
                                  {booking.slot && booking.slot.includes('Passengers') && (
                                    <div className="flex items-center mt-1">
                                      <FaUserFriends className="text-blue-600 mr-2" />
                                      <p className="text-gray-800">{booking.slot}</p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaMapMarkerAlt className="text-blue-600 mr-2" />
                                    <p className="text-gray-800 font-medium">{booking.location} - Slot {booking.slot}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-blue-600 mr-2" />
                                    <p className="text-gray-800">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-blue-600 mr-2" />
                                    <p className="text-gray-800">{booking.startTime} - {booking.endTime}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                                booking.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setActiveTab('qrcode');
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none"
                                >
                                  <FaQrcode className="mr-1" /> View QR
                                </button>
                                
                                {booking.status === 'confirmed' && !isShuttleBooking(booking) && (
                                  <button
                                    onClick={() => handleCheckin(booking.id)}
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                  >
                                    <FaSignInAlt className="mr-1" /> Check-in
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleCancel(booking.id)}
                                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded 
                                    ${cancelConfirm === booking.id 
                                      ? 'text-white bg-red-600 hover:bg-red-700' 
                                      : 'text-red-600 bg-white border border-red-600 hover:bg-red-50'} 
                                    focus:outline-none`}
                                >
                                  {cancelConfirm === booking.id 
                                    ? <><FaTrash className="mr-1" /> Confirm Cancel</> 
                                    : <><FaTimesCircle className="mr-1" /> Cancel</>}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Completed Bookings Section */}
              {bookings.filter(b => b.status === 'completed').length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">Completed Bookings</h3>
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.status === 'completed')
                      .map(booking => (
                        <div key={booking.id} className="border rounded-lg p-4 opacity-75">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              {isShuttleBooking(booking) ? (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaShuttleVan className="text-gray-600 mr-2" />
                                    <p className="text-gray-800 font-medium">{booking.shuttleName || 'Shuttle'} - {booking.location}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-gray-600 mr-2" />
                                    <p className="text-gray-800">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-gray-600 mr-2" />
                                    <p className="text-gray-800">{booking.startTime}</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaMapMarkerAlt className="text-gray-600 mr-2" />
                                    <p className="text-gray-800 font-medium">{booking.location} - Slot {booking.slot}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-gray-600 mr-2" />
                                    <p className="text-gray-800">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-gray-600 mr-2" />
                                    <p className="text-gray-800">{booking.startTime} - {booking.endTime}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-gray-100 text-gray-800">
                                Completed
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Canceled Bookings Section */}
              {bookings.filter(b => b.status === 'canceled').length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">Canceled Bookings</h3>
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.status === 'canceled')
                      .map(booking => (
                        <div key={booking.id} className="border border-red-100 rounded-lg p-4 opacity-75">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              {isShuttleBooking(booking) ? (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaShuttleVan className="text-gray-500 mr-2" />
                                    <p className="text-gray-700 font-medium">{booking.shuttleName || 'Shuttle'} - {booking.location}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-gray-500 mr-2" />
                                    <p className="text-gray-700">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-gray-500 mr-2" />
                                    <p className="text-gray-700">{booking.startTime}</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center mb-1">
                                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                    <p className="text-gray-700 font-medium">{booking.location} - Slot {booking.slot}</p>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <FaCalendarAlt className="text-gray-500 mr-2" />
                                    <p className="text-gray-700">{booking.date}</p>
                                  </div>
                                  <div className="flex items-center">
                                    <FaClock className="text-gray-500 mr-2" />
                                    <p className="text-gray-700">{booking.startTime} - {booking.endTime}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 bg-red-100 text-red-800">
                                Canceled
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6">
          {selectedBooking ? (
            <div>
              <QRCodeGenerator booking={selectedBooking} />
              
              {selectedBooking.status === 'confirmed' && (
                <div className="mt-4 flex justify-center">
                  {checkinSuccess ? (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center">
                      <FaCheckCircle className="mr-2" />
                      Check-in successful! Redirecting to active parking...
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckin(selectedBooking.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-2" />
                      <span>Check-in Now</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaQrcode className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">Please select a booking to generate QR code</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingQR; 