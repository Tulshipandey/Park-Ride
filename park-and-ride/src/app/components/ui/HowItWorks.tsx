'use client';

import { FaSearch, FaCar, FaQrcode, FaSubway, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const steps = [
  {
    id: 1,
    title: 'Search Location',
    description: 'Find parking spots near metro stations or your desired location.',
    icon: <FaSearch className="h-8 w-8 text-blue-500" />,
  },
  {
    id: 2,
    title: 'Reserve Parking',
    description: 'Book your parking spot in advance with flexible options.',
    icon: <FaCar className="h-8 w-8 text-blue-500" />,
  },
  {
    id: 3,
    title: 'Get QR Code',
    description: 'Receive a secure QR code for contactless entry and exit.',
    icon: <FaQrcode className="h-8 w-8 text-blue-500" />,
  },
  {
    id: 4,
    title: 'Enjoy Your Ride',
    description: 'Connect to public transit or book a ride through our app.',
    icon: <FaSubway className="h-8 w-8 text-blue-500" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple 4-step process makes commuting a breeze
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white relative z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 text-blue-700">
                    {step.icon}
                  </div>
                  <div className="h-8 w-8 mb-4 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <FaArrowRight className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ready to simplify your commute? Download our app or sign up online to get started.
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
} 