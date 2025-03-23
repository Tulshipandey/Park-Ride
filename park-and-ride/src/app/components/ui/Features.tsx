'use client';

import { FaParking, FaShuttleVan, FaMobileAlt, FaWallet, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <FaParking className="h-8 w-8 text-blue-600" />,
      title: 'Easy Parking',
      description: 'Find and reserve parking spaces with just a few taps. No more circling around looking for spots.'
    },
    {
      icon: <FaShuttleVan className="h-8 w-8 text-blue-600" />,
      title: 'Reliable Shuttles',
      description: 'Regular shuttle services to key destinations with live tracking for exact arrival times.'
    },
    {
      icon: <FaMapMarkerAlt className="h-8 w-8 text-blue-600" />,
      title: 'Real-time Tracking',
      description: 'Track your shuttle in real-time and receive notifications when it\'s approaching your stop.'
    },
    {
      icon: <FaWallet className="h-8 w-8 text-blue-600" />,
      title: 'Secure Payments',
      description: 'Multiple payment options available with secure processing and digital receipts.'
    },
    {
      icon: <FaCalendarAlt className="h-8 w-8 text-blue-600" />,
      title: 'Advance Booking',
      description: 'Plan ahead by booking your parking spot and shuttle service days or weeks in advance.'
    },
    {
      icon: <FaMobileAlt className="h-8 w-8 text-blue-600" />,
      title: 'Offline Access',
      description: 'Access your tickets and track your rides even without an internet connection.'
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Features Designed For Convenience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our Park & Ride service combines technology and convenience to make your commute stress-free.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 