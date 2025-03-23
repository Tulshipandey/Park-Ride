'use client';

import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaParking } from 'react-icons/fa';

type Location = {
  id: string;
  name: string;
  address: string;
  totalSpaces: number;
  availableSpaces: number;
  price: number;
};

const locations: Location[] = [
  {
    id: 'loc1',
    name: 'Downtown Central',
    address: '123 Main St, Downtown',
    totalSpaces: 250,
    availableSpaces: 84,
    price: 15
  },
  {
    id: 'loc2',
    name: 'North Station',
    address: '456 North Ave, Northside',
    totalSpaces: 180,
    availableSpaces: 23,
    price: 12
  },
  {
    id: 'loc3',
    name: 'West End Hub',
    address: '789 West Blvd, Westside',
    totalSpaces: 320,
    availableSpaces: 142,
    price: 18
  },
  {
    id: 'loc4',
    name: 'Airport Terminal',
    address: '101 Airport Dr, Terminal Side',
    totalSpaces: 200,
    availableSpaces: 5,
    price: 25
  },
  {
    id: 'loc5',
    name: 'South Bay Plaza',
    address: '202 South St, Southside',
    totalSpaces: 150,
    availableSpaces: 58,
    price: 14
  },
];

type AvailabilityCheckerProps = {
  onSelectLocation?: (locationId: string, date?: string, time?: string) => void;
};

export default function AvailabilityChecker({ onSelectLocation }: AvailabilityCheckerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  
  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API call with a delayed response
    setTimeout(() => {
      const filteredLocations = locations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredLocations.length > 0 ? filteredLocations : locations);
      setIsSearching(false);
    }, 800);
  };
  
  const getAvailabilityColor = (availableSpaces: number, totalSpaces: number) => {
    const percentage = (availableSpaces / totalSpaces) * 100;
    if (percentage < 10) return 'text-red-600';
    if (percentage < 30) return 'text-orange-500';
    return 'text-green-600';
  };
  
  const getAvailabilityText = (availableSpaces: number, totalSpaces: number) => {
    const percentage = (availableSpaces / totalSpaces) * 100;
    if (percentage < 10) return 'Almost Full';
    if (percentage < 30) return 'Limited Space';
    return 'Available';
  };
  
  const formatDateTime = () => {
    if (!selectedDate) return 'Select date and time';
    
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    
    return selectedTime 
      ? `${formattedDate} at ${selectedTime}`
      : formattedDate;
  };

  const handleReserve = (locationId: string) => {
    if (onSelectLocation) {
      onSelectLocation(locationId, selectedDate, selectedTime);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaParking className="mr-2" /> Real-Time Parking Availability
        </h3>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Check availability in real-time for your preferred location and booking time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search location or address"
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaClock className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-800"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select time</option>
                <option value="06:00">6:00 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button 
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaSearch className="mr-2" />
                )}
                <span>{isSearching ? 'Searching...' : 'Check'}</span>
              </button>
            </div>
          </div>
          
          {selectedDate && (
            <div className="mt-2 text-sm text-gray-600">
              Showing availability for: <span className="font-medium">{formatDateTime()}</span>
            </div>
          )}
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Available Parking Locations</h4>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Location</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Availability</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {searchResults.map((location) => (
                    <tr key={location.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{location.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{location.address}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          <span className={`font-medium ${getAvailabilityColor(location.availableSpaces, location.totalSpaces)}`}>
                            {getAvailabilityText(location.availableSpaces, location.totalSpaces)}
                          </span>
                          <span className="ml-2 text-gray-500">
                            ({location.availableSpaces}/{location.totalSpaces} spaces)
                          </span>
                        </div>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              getAvailabilityColor(location.availableSpaces, location.totalSpaces).replace('text-', 'bg-')
                            }`}
                            style={{ width: `${(location.availableSpaces / location.totalSpaces) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-black">
                        Rs.{location.price}/day
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button 
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition duration-150"
                          onClick={() => handleReserve(location.id)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Pro Tips</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></span>
              Weekday mornings (7-9 AM) and evenings (4-6 PM) are peak hours with higher rates.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></span>
              Booking at least 24 hours in advance ensures better availability and rates.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></span>
              Check availability at multiple locations for the best options.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 