'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

interface CTAProps {
  customText?: string;
  buttonText?: string;
}

const CTA = ({ customText, buttonText }: CTAProps) => {
  const { user } = useAuth();
  
  // Default heading text
  const headingText = customText || "Ready for a stress-free commute?";
  
  // Default button text
  const primaryButtonText = buttonText || "Book Now";
  
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-0 md:w-2/3"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {headingText}
            </h2>
            <p className="text-blue-100 text-xl max-w-2xl">
              {user 
                ? "Access premium features and enjoy priority service with our enhanced parking options. Save time and get more out of your commute."
                : "Download our app now and transform your daily travel experience with Park & Ride. Book parking, track shuttles, and enjoy a seamless journey."
              }
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              href={user ? "/booking" : "/auth/login"} 
              className="inline-flex items-center justify-center bg-white text-blue-700 px-6 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition duration-300 font-medium"
            >
              {primaryButtonText}
              <FaArrowRight className="ml-2" />
            </Link>
            {user ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 font-medium"
              >
                View Dashboard
              </Link>
            ) : (
              <Link 
                href="/auth/register" 
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-700 transition duration-300 font-medium"
              >
                Sign Up Free
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 