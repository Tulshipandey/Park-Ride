'use client';

import { useState, useEffect } from 'react';
import { FaCalculator, FaCreditCard, FaInfoCircle, FaCheck } from 'react-icons/fa';

type LocationOption = {
  id: string;
  name: string;
  baseRate: number;
  premiumMultiplier: number;
};

type VehicleType = {
  id: string;
  name: string;
  rateMultiplier: number;
};

type AdditionalService = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const locations: LocationOption[] = [
  { id: 'loc1', name: 'Downtown Central', baseRate: 15, premiumMultiplier: 1.5 },
  { id: 'loc2', name: 'North Station', baseRate: 12, premiumMultiplier: 1.3 },
  { id: 'loc3', name: 'West End Hub', baseRate: 18, premiumMultiplier: 1.2 },
  { id: 'loc4', name: 'Airport Terminal', baseRate: 25, premiumMultiplier: 1.8 },
  { id: 'loc5', name: 'South Bay Plaza', baseRate: 14, premiumMultiplier: 1.4 },
];

const vehicleTypes: VehicleType[] = [
  { id: 'standard', name: 'Standard Car', rateMultiplier: 1.0 },
  { id: 'compact', name: 'Compact Car', rateMultiplier: 0.9 },
  { id: 'suv', name: 'SUV / Crossover', rateMultiplier: 1.2 },
  { id: 'van', name: 'Van / Minivan', rateMultiplier: 1.3 },
  { id: 'electric', name: 'Electric Vehicle', rateMultiplier: 1.1 },
];

const additionalServices: AdditionalService[] = [
  { 
    id: 'express', 
    name: 'Express Shuttle', 
    price: 5, 
    description: 'Priority boarding on shuttle services with direct routes' 
  },
  { 
    id: 'valet', 
    name: 'Valet Parking', 
    price: 10, 
    description: 'Drop off your vehicle and let our team park it for you' 
  },
  { 
    id: 'charging', 
    name: 'EV Charging', 
    price: 8, 
    description: 'Electric vehicle charging while you\'re away' 
  },
  { 
    id: 'wash', 
    name: 'Car Wash', 
    price: 15, 
    description: 'Your car will be washed and ready when you return' 
  },
  { 
    id: 'covered', 
    name: 'Covered Parking', 
    price: 7, 
    description: 'Park in our covered garage spaces' 
  },
];

const discountCodes = {
  'NEWUSER': 15,
  'WEEKEND': 10,
  'SUMMER23': 20,
};

type ReservationCalculatorProps = {
  selectedLocationId?: string;
  selectedDate?: string;
  selectedTime?: string;
  onCalculatePrice?: (price: number) => void;
  onBookingSubmit?: (bookingData: any) => Promise<void>;
  userId?: string;
};

export default function ReservationCalculator({ 
  selectedLocationId, 
  selectedDate,
  selectedTime,
  onCalculatePrice,
  onBookingSubmit,
  userId
}: ReservationCalculatorProps) {
  const [location, setLocation] = useState(locations[0]);
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isPremiumTime, setIsPremiumTime] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState<{label: string, amount: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Set today as default start date and tomorrow as default end date
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
    
    // Determine if current time is premium time (7-9 AM or 4-6 PM)
    const currentHour = today.getHours();
    setIsPremiumTime(
      (currentHour >= 7 && currentHour < 9) || 
      (currentHour >= 16 && currentHour < 18)
    );
  }, []);
  
  // Update location if selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId) {
      const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
      if (selectedLocation) {
        setLocation(selectedLocation);
      }
    }
  }, [selectedLocationId]);
  
  // Update date and time if selected from AvailabilityChecker
  useEffect(() => {
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // Also set end date to next day if it's the same as start date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay.toISOString().split('T')[0]);
    }
    
    if (selectedTime) {
      setStartTime(selectedTime);
      
      // Calculate a default end time (8 hours later)
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const endTimeDate = new Date();
      endTimeDate.setHours(hours + 8, minutes);
      const formattedEndHour = endTimeDate.getHours().toString().padStart(2, '0');
      const formattedEndMinutes = endTimeDate.getMinutes().toString().padStart(2, '0');
      setEndTime(`${formattedEndHour}:${formattedEndMinutes}`);
    }
  }, [selectedDate, selectedTime]);
  
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = locations.find(loc => loc.id === event.target.value);
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  };
  
  const handleVehicleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVehicle = vehicleTypes.find(veh => veh.id === event.target.value);
    if (selectedVehicle) {
      setVehicleType(selectedVehicle);
    }
  };
  
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  const applyDiscountCode = () => {
    if (!discountCode.trim()) {
      setErrorMessage('Please enter a discount code');
      return;
    }
    
    const upperCaseCode = discountCode.toUpperCase();
    if (upperCaseCode in discountCodes) {
      setAppliedDiscount(discountCodes[upperCaseCode as keyof typeof discountCodes]);
      setErrorMessage('');
    } else {
      setAppliedDiscount(0);
      setErrorMessage('Invalid discount code');
    }
  };
  
  const calculateDurationHours = () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      setErrorMessage('Please select dates and times');
      return 0;
    }
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    if (end <= start) {
      setErrorMessage('End time must be after start time');
      return 0;
    }
    
    setErrorMessage('');
    const durationMs = end.getTime() - start.getTime();
    return durationMs / (1000 * 60 * 60); // Convert ms to hours
  };
  
  const calculatePrice = () => {
    setIsCalculatingPrice(true);
    
    setTimeout(() => {
      const hours = calculateDurationHours();
      
      if (hours <= 0) {
        setIsCalculatingPrice(false);
        return;
      }
      
      // Calculate base price = (base rate * vehicle multiplier * hours)
      const basePrice = location.baseRate * vehicleType.rateMultiplier * hours;
      
      // Apply premium time multiplier if applicable
      const premiumPrice = isPremiumTime ? (basePrice * location.premiumMultiplier) - basePrice : 0;
      
      // Calculate services price
      const servicesArray = selectedServices.map(serviceId => {
        const service = additionalServices.find(s => s.id === serviceId);
        return service ? service.price : 0;
      });
      const servicesPrice = servicesArray.reduce((total, price) => total + price, 0);
      
      // Calculate subtotal
      const subtotal = basePrice + premiumPrice + servicesPrice;
      
      // Apply discount if available
      const discountAmount = appliedDiscount > 0 ? (subtotal * (appliedDiscount / 100)) : 0;
      
      // Final price
      const finalPrice = subtotal - discountAmount;
      
      // Create breakdown
      const newBreakdown = [
        { label: 'Base Parking Fee', amount: parseFloat(basePrice.toFixed(2)) },
      ];
      
      if (premiumPrice > 0) {
        newBreakdown.push({ 
          label: 'Peak Hour Surcharge', 
          amount: parseFloat(premiumPrice.toFixed(2))
        });
      }
      
      if (servicesPrice > 0) {
        newBreakdown.push({ 
          label: 'Additional Services', 
          amount: parseFloat(servicesPrice.toFixed(2))
        });
      }
      
      if (discountAmount > 0) {
        newBreakdown.push({ 
          label: `Discount (${appliedDiscount}%)`, 
          amount: -parseFloat(discountAmount.toFixed(2))
        });
      }
      
      newBreakdown.push({ 
        label: 'Total', 
        amount: parseFloat(finalPrice.toFixed(2))
      });
      
      setBreakdown(newBreakdown);
      setCalculatedPrice(parseFloat(finalPrice.toFixed(2)));
      setShowBreakdown(true);
      setIsCalculatingPrice(false);
      
      // Call the callback with the calculated price
      if (onCalculatePrice) {
        onCalculatePrice(parseFloat(finalPrice.toFixed(2)));
      }
    }, 800);
  };

  const getLocationName = (locationId: string) => {
    const loc = locations.find(l => l.id === locationId);
    return loc ? loc.name : 'Unknown Location';
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    // Convert 24h format to AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleBookNow = async () => {
    if (!calculatedPrice) {
      setErrorMessage('Please calculate the price first');
      return;
    }

    if (!location || !startDate || !endDate || !startTime || !endTime) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Create random slot based on location
      const slot = `${location.id.charAt(location.id.length - 1)}${Math.floor(Math.random() * 20) + 1}`;
      
      const bookingData = {
        location: getLocationName(location.id),
        slot,
        date: formatDate(startDate),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        status: 'confirmed',
        price: calculatedPrice,
        vehicleType: vehicleType.name,
        userId: userId
      };
      
      if (onBookingSubmit) {
        await onBookingSubmit(bookingData);
        setBookingSuccess(true);
      } else {
        throw new Error('Booking submission handler not provided');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If booking was successful, show success message
  if (bookingSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-600 py-6 px-8 text-center">
          <FaCheck className="h-16 w-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white">Booking Successful!</h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Your parking spot has been reserved. You will be redirected to your dashboard where you can view your booking details.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaCalculator className="mr-2" /> Calculate Your Parking Cost
        </h3>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-4">
          Get an accurate estimate of your parking cost by entering your details below.
        </p>
        
        <div className="space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Location Selection */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Parking Location</label>
            <div className="relative">
              <select
                id="location"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={location.id}
                onChange={handleLocationChange}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} (Rs.{loc.baseRate}/hr base rate)
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                id="startTime"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                id="endDate"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                id="endTime"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          {/* Vehicle Type Selection */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              id="vehicleType"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              value={vehicleType.id}
              onChange={handleVehicleTypeChange}
            >
              {vehicleTypes.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.rateMultiplier < 1 ? '-' : '+'}{Math.abs((vehicle.rateMultiplier - 1) * 100)}% rate)
                </option>
              ))}
            </select>
          </div>
          
          {/* Additional Services */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Services</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`service-${service.id}`}
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`service-${service.id}`} className="font-medium text-gray-700">
                      {service.name} (Rs.{service.price})
                    </label>
                    <p className="text-gray-500">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Discount Code */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-1">
              <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700">Discount Code</label>
              <div className="ml-2 text-sm text-gray-500">
                <span className="inline-flex items-center">
                  <FaInfoCircle className="h-4 w-4 mr-1" />
                  Try codes: NEWUSER, WEEKEND, SUMMER23
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                id="discountCode"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                className="inline-flex items-center justify-center bg-blue-600 py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={applyDiscountCode}
              >
                Apply
              </button>
            </div>
            
            {appliedDiscount > 0 && (
              <div className="mt-2 text-sm text-green-600">
                {appliedDiscount}% discount applied!
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full bg-blue-600 py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={calculatePrice}
              disabled={isCalculatingPrice}
            >
              {isCalculatingPrice ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <FaCalculator className="mr-2" />
                  Calculate Cost
                </>
              )}
            </button>
          </div>
          
          {showBreakdown && calculatedPrice !== null && (
            <div className="border-t pt-4 text-black">
              <h4 className="text-md font-medium text-gray-900 mb-2">Cost Breakdown</h4>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="space-y-2">
                  {breakdown.map((item, index) => (
                    <div key={index} className={`flex justify-between ${item.label === 'Total' ? 'font-bold border-t pt-2 mt-2' : ''}`}>
                      <span>{item.label}</span>
                      <span className={item.amount < 0 ? 'text-green-600' : ''}>
                        Rs.{item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleBookNow}
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white w-full ${
                    isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
              
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FaCreditCard className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-blue-800 font-medium">Pay this amount when you check out from the parking.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 