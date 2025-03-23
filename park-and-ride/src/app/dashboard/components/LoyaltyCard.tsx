'use client';

import { useState } from 'react';
import { FaGift, FaCoins, FaAngleRight, FaStar } from 'react-icons/fa';

type Reward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'parking' | 'ride' | 'general';
};

const sampleRewards: Reward[] = [
  {
    id: 'r1',
    name: 'Free Day Parking',
    description: 'Redeem for a full day of free parking at any location',
    pointsCost: 500,
    category: 'parking',
  },
  {
    id: 'r2',
    name: '50% Off Shuttle Ride',
    description: 'Get 50% off your next shuttle booking',
    pointsCost: 350,
    category: 'ride',
  },
  {
    id: 'r3',
    name: 'Free Car Wash',
    description: 'Enjoy a free car wash at any of our premium locations',
    pointsCost: 450,
    category: 'general',
  },
  {
    id: 'r4',
    name: 'Premium Parking Upgrade',
    description: 'Upgrade to a premium parking spot for one reservation',
    pointsCost: 300,
    category: 'parking',
  },
];

export default function LoyaltyCard() {
  const [points, setPoints] = useState(750); // Sample points
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'parking' | 'ride' | 'general'>('all');
  
  const filteredRewards = selectedCategory === 'all' 
    ? sampleRewards 
    : sampleRewards.filter(reward => reward.category === selectedCategory);
  
  const [redeemingReward, setRedeemingReward] = useState<Reward | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  
  const handleRedeem = (reward: Reward) => {
    if (points >= reward.pointsCost) {
      setRedeemingReward(reward);
    }
  };
  
  const confirmRedeem = () => {
    if (redeemingReward) {
      setPoints(points - redeemingReward.pointsCost);
      setRedeemSuccess(true);
      // Reset after a delay
      setTimeout(() => {
        setRedeemingReward(null);
        setRedeemSuccess(false);
      }, 2000);
    }
  };
  
  const cancelRedeem = () => {
    setRedeemingReward(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaGift className="mr-2" /> Loyalty Rewards
        </h3>
        <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full text-black">
          <FaCoins className="text-yellow-300 mr-1 text-black" />
          <span className="text-black font-medium">{points} points</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Earn points with every booking and redeem them for exciting rewards!
          </p>
          
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Rewards
            </button>
            <button 
              onClick={() => setSelectedCategory('parking')} 
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'parking' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Parking
            </button>
            <button 
              onClick={() => setSelectedCategory('ride')} 
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'ride' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ride Discounts
            </button>
            <button 
              onClick={() => setSelectedCategory('general')} 
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === 'general' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              General
            </button>
          </div>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {filteredRewards.map((reward) => (
            <li key={reward.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                  <p className="text-xs text-gray-500">{reward.description}</p>
                  <div className="flex items-center mt-1">
                    <FaCoins className="text-yellow-500 text-xs mr-1" />
                    <span className="text-xs font-medium text-gray-700">{reward.pointsCost} points</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={points < reward.pointsCost}
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
                    points >= reward.pointsCost
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Redeem
                  <FaAngleRight className="ml-1" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredRewards.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            No rewards available in this category.
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-medium text-black">Member Level: </span>
            <span className="ml-1 text-gray-700">
              {points < 500 ? 'Bronze' : points < 1000 ? 'Silver' : 'Gold'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Next level: {points < 500 ? '500 points for Silver' : points < 1000 ? '1000 points for Gold' : 'You reached the highest level!'}
          </p>
        </div>
      </div>
      
      {/* Redeem Confirmation Modal */}
      {redeemingReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            {redeemSuccess ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reward Redeemed!</h3>
                <p className="text-sm text-gray-500">
                  Your reward has been added to your account.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Redemption</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to redeem {redeemingReward.name} for {redeemingReward.pointsCost} points?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelRedeem}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRedeem}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 