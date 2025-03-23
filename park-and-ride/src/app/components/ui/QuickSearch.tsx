'use client';

import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const popularStations = [
  'Central Station',
  'Riverside Metro',
  'Downtown Transit',
  'Airport Terminal',
  'University Hub',
];

export default function QuickSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to booking page with the search query
      router.push(`/booking?station=${encodeURIComponent(searchQuery)}`);
    }, 800);
  };

  const handleQuickSelect = (station: string) => {
    setSearchQuery(station);
    router.push(`/booking?station=${encodeURIComponent(station)}`);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Parking Spot</h2>
          <p className="text-lg text-gray-600">Enter a metro station to discover nearby parking options</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter metro station or area..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  Search
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Popular stations:</p>
            <div className="flex flex-wrap gap-2">
              {popularStations.map((station) => (
                <button
                  key={station}
                  onClick={() => handleQuickSelect(station)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition"
                >
                  {station}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 