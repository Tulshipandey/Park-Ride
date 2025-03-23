'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaCar, FaSave, FaEdit, FaIdCard, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

type ProfileProps = {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    preferredPayment: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    vehicles: Array<{
      id: string;
      make: string;
      model: string;
      year: string;
      licensePlate: string;
    }>;
    paymentMethods: Array<{
      id: string;
      type: string;
      last4: string;
      expiryDate: string;
      isDefault: boolean;
    }>;
  };
};

export default function ProfileManager({ initialData }: ProfileProps) {
  const { user } = useAuth();
  const userId = user?.uid;
  
  const defaultData = {
    firstName: user?.displayName || 'firstName',
    lastName: 'lastName',
    email: user?.email || 'userName@example.com',
    phone: '(555) 123-4567',
    address: 'INDIA',
    preferredPayment: 'card1',
    notificationPreferences: {
      email: true,
      sms: true,
      push: false,
    },
    vehicles: [
      {
        id: 'v1',
        make: 'Toyota',
        model: 'Camry',
        year: '2020',
        licensePlate: 'ABC123',
      },
    ],
    paymentMethods: [
      {
        id: 'card1',
        type: 'Visa',
        last4: '4242',
        expiryDate: '12/25',
        isDefault: true,
      },
    ],
  };

  const [profile, setProfile] = useState(initialData || defaultData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [activeTab, setActiveTab] = useState<'personal' | 'vehicles' | 'payment' | 'preferences'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load profile from localStorage on component mount
  useEffect(() => {
    if (userId) {
      const savedProfile = localStorage.getItem(`user_profile_${userId}`);
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setEditedProfile(parsedProfile);
        } catch (error) {
          console.error('Failed to parse saved profile:', error);
        }
      } else {
        // If no saved profile, initialize with default data that includes user email
        const initialProfileData = {
          ...defaultData,
          email: user?.email || defaultData.email,
        };
        setProfile(initialProfileData);
        setEditedProfile(initialProfileData);
      }
    }
  }, [userId, user?.email]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Save profile data to localStorage
    if (userId) {
      try {
        localStorage.setItem(`user_profile_${userId}`, JSON.stringify(editedProfile));
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      setProfile(editedProfile);
      setIsEditing(false);
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    });
  };

  const handleNotificationChange = (channel: 'email' | 'sms' | 'push', value: boolean) => {
    setEditedProfile({
      ...editedProfile,
      notificationPreferences: {
        ...editedProfile.notificationPreferences,
        [channel]: value,
      },
    });
  };

  const handleVehicleChange = (index: number, field: string, value: string) => {
    const updatedVehicles = [...editedProfile.vehicles];
    updatedVehicles[index] = {
      ...updatedVehicles[index],
      [field]: value,
    };
    
    setEditedProfile({
      ...editedProfile,
      vehicles: updatedVehicles,
    });
  };

  const addVehicle = () => {
    setEditedProfile({
      ...editedProfile,
      vehicles: [
        ...editedProfile.vehicles,
        {
          id: `v${editedProfile.vehicles.length + 1}`,
          make: '',
          model: '',
          year: '',
          licensePlate: '',
        },
      ],
    });
  };

  const removeVehicle = (index: number) => {
    const updatedVehicles = [...editedProfile.vehicles];
    updatedVehicles.splice(index, 1);
    
    setEditedProfile({
      ...editedProfile,
      vehicles: updatedVehicles,
    });
  };

  const addPaymentMethod = () => {
    // In a real app, you'd open a payment form/modal
    alert('In a production app, this would open a secure payment form to add a new payment method.');
  };

  const setDefaultPaymentMethod = (id: string) => {
    const updatedPayments = editedProfile.paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    
    setEditedProfile({
      ...editedProfile,
      paymentMethods: updatedPayments,
      preferredPayment: id,
    });
  };

  const removePaymentMethod = (id: string) => {
    const updatedPayments = editedProfile.paymentMethods.filter(method => method.id !== id);
    
    setEditedProfile({
      ...editedProfile,
      paymentMethods: updatedPayments,
      preferredPayment: updatedPayments.length > 0 ? updatedPayments[0].id : '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaUser className="mr-2" /> Profile Management
        </h3>
        <button
          onClick={handleEditToggle}
          className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm flex items-center text-black"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <FaEdit className="mr-1 text-black" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="p-6">
        {saveSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            Profile updated successfully!
          </div>
        )}
        
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser className="inline mr-1 text-black" /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vehicles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCar className="inline mr-1 text-black" /> Vehicles
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-2 px-1 border-b-2 font-medium text-sm${
                activeTab === 'payment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCreditCard className="inline mr-1 text-black" /> Payment
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>

        {activeTab === 'personal' && (
          <div className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                ) : (
                  <p className="text-gray-900">{profile.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-black">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              ) : (
                <p className="text-gray-900">{profile.address}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div>
            {editedProfile.vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 text-black">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium flex items-center">
                    <FaCar className="mr-2 text-blue-500" /> 
                    {vehicle.make ? `${vehicle.make} ${vehicle.model}` : 'New Vehicle'}
                  </h4>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-black">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicle.make}
                        onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.make}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicle.model}
                        onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.model}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicle.year}
                        onChange={(e) => handleVehicleChange(index, 'year', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.year}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={vehicle.licensePlate}
                        onChange={(e) => handleVehicleChange(index, 'licensePlate', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{vehicle.licensePlate}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isEditing && (
              <button
                type="button"
                onClick={addVehicle}
                className="mt-4 px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                + Add Another Vehicle
              </button>
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Methods</h4>
            
            {editedProfile.paymentMethods.map((method) => (
              <div key={method.id} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaCreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.type} •••• {method.last4}</p>
                    <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                    {method.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Set default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isEditing && (
              <button
                type="button"
                onClick={addPaymentMethod}
                className="mt-4 px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                + Add Payment Method
              </button>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Notification Preferences</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Email Notifications</label>
                {isEditing ? (
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-email"
                      checked={editedProfile.notificationPreferences.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-email"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        editedProfile.notificationPreferences.email ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          editedProfile.notificationPreferences.email ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.notificationPreferences.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.notificationPreferences.email ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">SMS Notifications</label>
                {isEditing ? (
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-sms"
                      checked={editedProfile.notificationPreferences.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-sms"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        editedProfile.notificationPreferences.sms ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          editedProfile.notificationPreferences.sms ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.notificationPreferences.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.notificationPreferences.sms ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Push Notifications</label>
                {isEditing ? (
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-push"
                      checked={editedProfile.notificationPreferences.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="hidden"
                    />
                    <label
                      htmlFor="toggle-push"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        editedProfile.notificationPreferences.push ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          editedProfile.notificationPreferences.push ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.notificationPreferences.push ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.notificationPreferences.push ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 