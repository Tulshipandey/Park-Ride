'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaParking, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleProtectedLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!user) {
      // Store information about which page the user was trying to access
      const pageMessages = {
        '/booking': 'Please login or register to book a parking spot',
        '/tracking': 'Please login or register to track shuttles'
      };
      
      // Save the message to localStorage
      localStorage.setItem('authRedirectMessage', pageMessages[path as keyof typeof pageMessages]);
      router.push('/auth/login');
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FaParking className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Park&Ride</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition duration-300">
              Home
            </Link>
            <a 
              href="#"
              onClick={(e) => handleProtectedLink(e, '/booking')} 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition duration-300 cursor-pointer"
            >
              Book Parking
            </a>
            <a 
              href="#"
              onClick={(e) => handleProtectedLink(e, '/tracking')} 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition duration-300 cursor-pointer"
            >
              Shuttles
            </a>
            {user ? (
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-inner">
              <Link href="/" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <a 
                href="#"
                onClick={(e) => handleProtectedLink(e, '/booking')}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium"
              >
                Book Parking
              </a>
              <a 
                href="#"
                onClick={(e) => handleProtectedLink(e, '/tracking')}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium"
              >
                Shuttles
              </a>
              {user ? (
                <Link href="/dashboard" className="bg-blue-600 text-white block px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
              ) : (
                <Link href="/auth/login" className="bg-blue-600 text-white block px-3 py-2 rounded-md font-medium">
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 