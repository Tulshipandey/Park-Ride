'use client';

import Link from 'next/link';
import { FaParking, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <FaParking className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">Park&Ride</span>
            </div>
            <p className="text-gray-300">
              Making parking and commuting seamless with our convenient Park & Ride services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition duration-300">Home</Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition duration-300">Book Parking</Link>
              </li>
              <li>
                <Link href="/tracking" className="text-gray-300 hover:text-white transition duration-300">Track Shuttle</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition duration-300">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">Contact Us</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition duration-300">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition duration-300">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Park Avenue</p>
              <p>Cityville, State 12345</p>
              <p>Email: info@parkandride.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Park&Ride. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 