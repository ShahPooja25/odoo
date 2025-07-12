import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems, Item } from '../contexts/ItemContext';
import toast from 'react-hot-toast';

interface SwapRequestModalProps {
  item: Item;
  onClose: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ item, onClose }) => {
  const { user } = useAuth();
  const { items, createSwapRequest } = useItems();
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  const userItems = items.filter(
    (userItem) => 
      userItem.uploaderId === user?.id && 
      userItem.status === 'available' && 
      userItem.id !== item.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItemId) {
      toast.error('Please select an item to offer');
      return;
    }

    createSwapRequest(item.id, selectedItemId, user!.id, item.uploaderId);
    toast.success('Swap request sent successfully!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Request Swap</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Requested Item */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">You want:</h3>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.category} • {item.size}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>

            {/* Your Items */}
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select an item to offer:</h3>
              
              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have any available items to swap.</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Add some items first
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {userItems.map((userItem) => (
                    <label
                      key={userItem.id}
                      className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedItemId === userItem.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedItem"
                        value={userItem.id}
                        checked={selectedItemId === userItem.id}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <img
                        src={userItem.image}
                        alt={userItem.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{userItem.title}</h4>
                        <p className="text-sm text-gray-600">
                          {userItem.category} • {userItem.size} • {userItem.condition}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Actions */}
              {userItems.length > 0 && (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    Send Request
                  </motion.button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SwapRequestModal;