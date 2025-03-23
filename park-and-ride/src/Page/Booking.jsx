/**
 * Booking page component
 * Allows users to book parking spots by selecting location, date, and duration
 * Integrates with the map view to provide location-based parking options
 */
import { useState } from 'react';
import MapView from '../components/MapView';

const Booking = () => {
  // State variables to track booking form inputs
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');

  /**
   * Handle form submission for parking booking
   * Prevents default form behavior and shows confirmation
   */
  const handleBooking = (e) => {
    e.preventDefault();
    alert('Booking Confirmed!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Map section showing parking locations */}
      <div className="min-h-screen flex flex-col items-center p-4">
        <h2 className="text-3xl font-bold text-primary mb-4">Find Parking Near You</h2>
        <MapView />
      </div>

      {/* Booking form section */}
      <form
        className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
        onSubmit={handleBooking}
      >
        <h2 className="text-2xl font-bold mb-4 text-primary">Book Your Parking</h2>

        {/* Location input field */}
        <input
          type="text"
          placeholder="Enter Location"
          className="border w-full p-2 mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Date selection field */}
        <input
          type="date"
          className="border w-full p-2 mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Duration selection dropdown */}
        <select
          className="border w-full p-2 mb-3"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="">Select Duration</option>
          <option value="1">1 Hour</option>
          <option value="2">2 Hours</option>
          <option value="3">3 Hours</option>
          <option value="full">Full Day</option>
        </select>

        {/* Form submission button */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;
