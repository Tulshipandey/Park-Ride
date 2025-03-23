'use client';

import { useState, useEffect } from 'react';

// Types
export interface Booking {
  id: string;
  location: string;
  slot: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'completed' | 'active' | 'canceled';
  userId?: string;
  createdAt: string;
  // Shuttle booking properties
  shuttleId?: number;
  shuttleName?: string;
  specialRequests?: string;
}

// In a real app, this would be a database. For now, we'll use localStorage
class BookingService {
  private static instance: BookingService;
  private STORAGE_KEY = 'park-and-ride-bookings';

  private constructor() {
    // Initialize with some demo data if empty
    if (typeof window !== 'undefined' && !localStorage.getItem(this.STORAGE_KEY)) {
      const initialBookings: Booking[] = [
        {
          id: 'BKG-1234567',
          location: 'Central Station',
          slot: 'B5',
          date: 'March 22, 2023',
          startTime: '8:00 AM',
          endTime: '6:00 PM',
          status: 'active',
          userId: 'user123',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'BKG-7654321',
          location: 'North Parking',
          slot: 'D12',
          date: 'March 25, 2023',
          startTime: '9:30 AM',
          endTime: '7:30 PM',
          status: 'pending',
          userId: 'user123',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialBookings));
    }
  }

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // Get all bookings
  public getBookings(): Booking[] {
    if (typeof window === 'undefined') return [];
    const bookingsJson = localStorage.getItem(this.STORAGE_KEY);
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  }

  // Get bookings for a specific user
  public getUserBookings(userId: string): Booking[] {
    const bookings = this.getBookings();
    return bookings.filter(booking => booking.userId === userId);
  }

  // Get a specific booking by ID
  public getBookingById(id: string): Booking | null {
    const bookings = this.getBookings();
    return bookings.find(booking => booking.id === id) || null;
  }

  // Create a new booking
  public createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const bookings = this.getBookings();
    
    // Generate a unique booking ID
    const bookingId = `BKG-${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    
    return newBooking;
  }

  // Update a booking
  public updateBooking(id: string, updatedData: Partial<Booking>): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) return null;
    
    bookings[index] = {
      ...bookings[index],
      ...updatedData
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    return bookings[index];
  }
  
  // Delete a booking
  public deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filteredBookings = bookings.filter(booking => booking.id !== id);
    
    if (filteredBookings.length === bookings.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBookings));
    return true;
  }
}

// Custom hook for managing bookings
export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const bookingService = BookingService.getInstance();
  
  // Load bookings
  const loadBookings = () => {
    try {
      setLoading(true);
      const loadedBookings = userId 
        ? bookingService.getUserBookings(userId)
        : bookingService.getBookings();
      setBookings(loadedBookings);
      setError(null);
    } catch (err) {
      setError('Error loading bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a booking
  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      const newBooking = bookingService.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      setError('Error creating booking');
      console.error(err);
      return null;
    }
  };
  
  // Update a booking
  const updateBooking = (id: string, updatedData: Partial<Booking>) => {
    try {
      const updated = bookingService.updateBooking(id, updatedData);
      if (updated) {
        setBookings(prev => prev.map(booking => 
          booking.id === id ? updated : booking
        ));
      }
      return updated;
    } catch (err) {
      setError('Error updating booking');
      console.error(err);
      return null;
    }
  };
  
  // Delete a booking
  const deleteBooking = (id: string) => {
    try {
      const success = bookingService.deleteBooking(id);
      if (success) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
      }
      return success;
    } catch (err) {
      setError('Error deleting booking');
      console.error(err);
      return false;
    }
  };
  
  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, [userId]);
  
  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    deleteBooking,
    refreshBookings: loadBookings
  };
}

export default BookingService; 