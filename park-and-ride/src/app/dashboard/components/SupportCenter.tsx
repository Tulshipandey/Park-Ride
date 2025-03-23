'use client';

import { useState } from 'react';
import { FaQuestionCircle, FaAngleDown, FaAngleUp, FaHeadset, FaPaperPlane, FaList, FaSearch } from 'react-icons/fa';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    id: 'f1',
    question: 'How do I cancel my parking reservation?',
    answer: 'You can cancel your parking reservation from the Dashboard by navigating to Upcoming Bookings, selecting the booking you wish to cancel, and clicking on the "Cancel Booking" button. Cancellations made at least 24 hours in advance are eligible for a full refund.',
    category: 'bookings',
  },
  {
    id: 'f2',
    question: 'What happens if I arrive late for my parking slot?',
    answer: 'Your parking slot is reserved for the entire duration of your booking. If you arrive later than your booking start time, you can still use your reserved spot, but you won\'t receive any refund or extension for the unused time.',
    category: 'bookings',
  },
  {
    id: 'f3',
    question: 'How do I redeem my loyalty rewards?',
    answer: 'To redeem loyalty rewards, go to the Loyalty section in your Dashboard, browse available rewards, and click the "Redeem" button next to your desired reward. Redeemed rewards will be automatically applied to your next eligible booking.',
    category: 'loyalty',
  },
  {
    id: 'f4',
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover. You can also pay using digital wallets such as Apple Pay, Google Pay, and PayPal.',
    category: 'payments',
  },
  {
    id: 'f5',
    question: 'How do I update my vehicle information?',
    answer: 'You can update your vehicle information from your Profile settings. Click on the "Profile" tab, select the "Vehicles" section, and either edit existing vehicles or add new ones. Make sure to save changes before exiting.',
    category: 'account',
  },
  {
    id: 'f6',
    question: 'Can I change my shuttle booking to a different time?',
    answer: 'Yes, you can modify your shuttle booking time up to 1 hour before the scheduled departure. Go to Upcoming Bookings in your Dashboard, select the shuttle booking, and click on "Modify Booking" to change the time.',
    category: 'bookings',
  },
];

export default function SupportCenter() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    subject: '',
    message: '',
    attachFile: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData({
      ...contactFormData,
      [name]: value,
    });
  };

  const handleFileToggle = () => {
    setContactFormData({
      ...contactFormData,
      attachFile: !contactFormData.attachFile,
    });
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      // Reset form after delay
      setTimeout(() => {
        setShowContactForm(false);
        setFormSubmitted(false);
        setContactFormData({
          subject: '',
          message: '',
          attachFile: false,
        });
      }, 3000);
    }, 1000);
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaQuestionCircle className="mr-2" /> Help & Support
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-2/3 mb-4 md:mb-0 md:pr-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 text-black">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FaList className="mr-2 text-blue-500" />
            Frequently Asked Questions
          </h4>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <FaAngleUp className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FaAngleDown className="h-5 w-5 text-blue-500" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                      <div className="mt-2 text-xs text-blue-600">
                        <span className="capitalize px-2 py-1 bg-blue-50 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No FAQs found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 text-black">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FaHeadset className="mr-2 text-blue-500" />
            Need More Help?
          </h4>
          
          {!showContactForm ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-4 text-black">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues.
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              {formSubmitted ? (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Support Request Submitted!</h3>
                  <p className="text-sm text-gray-500">
                    Our team will respond to your inquiry within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact}>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={contactFormData.subject}
                      onChange={handleContactFormChange}
                      required
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text-black">Select a topic</option>
                      <option value="booking_issue">Booking Issue</option>
                      <option value="payment_issue">Payment Issue</option>
                      <option value="technical_problem">Technical Problem</option>
                      <option value="account_help">Account Help</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4 text-black">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactFormChange}
                      required
                      rows={4}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please describe your issue in detail..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        id="attachFile"
                        type="checkbox"
                        checked={contactFormData.attachFile}
                        onChange={handleFileToggle}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="attachFile" className="ml-2 block text-sm text-gray-700">
                        Attach a file or screenshot
                      </label>
                    </div>
                  </div>
                  
                  {contactFormData.attachFile && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        File
                      </label>
                      <input
                        type="file"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: JPG, PNG, PDF. Max size: 10MB
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaPaperPlane className="inline mr-1" /> 
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 