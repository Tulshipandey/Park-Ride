'use client';

import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      image: '/images/testimonial-1.jpg', // We'll add these images later
      stars: 5,
      text: 'Park & Ride has completely transformed my daily commute. I save time, money, and avoid the stress of city parking. The app is so easy to use and the tracking feature is spot on!'
    },
    {
      name: 'Michael Chen',
      role: 'Business Traveler',
      image: '/images/testimonial-2.jpg',
      stars: 5,
      text: 'As someone who travels frequently for business, this service has been invaluable. I can plan ahead, know exactly where I\'m parking, and the shuttle service is always on time.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Weekend Shopper',
      image: '/images/testimonial-3.jpg',
      stars: 4,
      text: 'I love using Park & Ride for my weekend shopping trips. The app remembers my favorite spots and the notifications about shuttle arrivals are super helpful.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what people who use Park & Ride have to say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-xl shadow relative"
            >
              <div className="flex items-center mb-6">
                <div className="mr-4 relative">
                  <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                    {/* Placeholder for now - we'll add real images later */}
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 h-5 w-5" />
                ))}
                {[...Array(5 - testimonial.stars)].map((_, i) => (
                  <FaStar key={i + testimonial.stars} className="text-gray-300 h-5 w-5" />
                ))}
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
              
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
                "
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-blue-600 font-semibold">Join thousands of satisfied commuters</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Ready to transform your commute?</h3>
          <Link href="/auth/login" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 text-center">
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 