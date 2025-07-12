import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const SwapRequestModal = ({ isOpen, onClose, requestedItem, offeredItem = null }) => {
  const { user } = useAuth();
  const { items, refreshItems } = useItems();
  const [userItems, setUserItems] = useState([]);
  const [selectedOfferedItem, setSelectedOfferedItem] = useState(offeredItem);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen && user) {
      loadUserItems();
    }
  }, [isOpen, user]);

  const loadUserItems = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (userProfile) {
        const userClothingItems = items.filter(item => 
          item.user_id === userProfile.id && 
          item.status === 'available'
        );
        setUserItems(userClothingItems);
      }
    } catch (error) {
      console.error('Error loading user items:', error);
      toast.error('Failed to load your items');
    }
  };

  const handleSubmit = async () => {
    if (!selectedOfferedItem) {
      toast.error('Please select an item to offer');
      return;
    }

    if (!message.trim()) {
      toast.error('Please add a message to your swap request');
      return;
    }

    setLoading(true);

    try {
      const { data: fromProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data: toProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', requestedItem.user_id)
        .single();

      const { data: swapRequest, error } = await supabase
        .from('swap_requests')
        .insert({
          from_user_id: fromProfile.id,
          to_user_id: toProfile.id,
          requested_item_id: requestedItem.id,
          offered_item_id: selectedOfferedItem.id,
          message: message.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Swap request sent successfully!');
      onClose();
      refreshItems();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedOfferedItem(offeredItem);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Request Swap</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
<div className="p-6">
          {/* Requested Item */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Item You Want</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex space-x-4">
                <img
                  src={requestedItem.image_urls?.[0]  requestedItem.image_url}
                  alt={requestedItem.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{requestedItem.title}</h4>
                  <p className="text-sm text-gray-600">{requestedItem.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {requestedItem.category}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {requestedItem.size}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {requestedItem.condition}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Select Item to Offer */}
          {step === 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Select Item to Offer</h3>
              {userItems.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 mb-2">No items available for swap</p>
                  <p className="text-sm text-gray-400">Add some items to your wardrobe first</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {userItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedOfferedItem(item)}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedOfferedItem?.id === item.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex space-x-3">
                        <img
                          src={item.image_urls?.[0]  item.image_url}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-800 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {item.category} • {item.size} • {item.condition}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
{/* Step 2: Add Message */}
          {step === 2 && selectedOfferedItem && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Your Offer</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex space-x-4">
                  <img
                    src={selectedOfferedItem.image_urls?.[0]  selectedOfferedItem.image_url}
                    alt={selectedOfferedItem.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{selectedOfferedItem.title}</h4>
                    <p className="text-sm text-gray-600">{selectedOfferedItem.description}</p>
                    <div className="flex space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {selectedOfferedItem.category}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {selectedOfferedItem.size}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {selectedOfferedItem.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to the owner
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them why you'd like to swap and any additional details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex space-x-2">
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedOfferedItem}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              )}
              
              {step === 2 && (
                <>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading  !message.trim()}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;