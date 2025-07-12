import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, User, Calendar, Tag, Sparkles } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import SwapRequestModal from '../components/SwapRequestModal';
import AIAssistant from '../components/AIAssistant';
import toast from 'react-hot-toast';

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items } = useItems();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const item = items.find(item => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h1>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const handleSwapRequest = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to request a swap');
      navigate('/login');
      return;
    }
    setShowSwapModal(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAIAssistant = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use AI assistant');
      navigate('/login');
      return;
    }
    setShowAIAssistant(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{item.uploaderName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  item.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.status === 'available' ? 'Available for Swap' : 'Already Swapped'}
              </span>
            </div>

            {/* Item Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{item.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{item.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2 font-medium">{item.size}</span>
                </div>
                <div>
                  <span className="text-gray-600">Condition:</span>
                  <span className="ml-2 font-medium">{item.condition}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Tags */}
            {item.tags?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="flex items-center space-x-1 px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      <span>#{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {item.status === 'available' && (
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSwapRequest}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Propose Swap
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAIAssistant}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Get AI Recommendations</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <SwapRequestModal
          requestedItem={item}
          onClose={() => setShowSwapModal(false)}
        />
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          selectedItem={item}
        />
      )}
    </div>
  );
};

export default ItemDetailPage;
