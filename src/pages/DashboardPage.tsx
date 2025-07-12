import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, ArrowUpDown, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useItems } from '../contexts/ItemContext';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getItemsByUser, getSwapRequestsByUser, updateSwapRequest, deleteItem } = useItems();
  const [activeTab, setActiveTab] = useState<'items' | 'requests'>('items');

  const userItems = getItemsByUser(user!.id);
  const { incoming, outgoing } = getSwapRequestsByUser(user!.id);

  const handleAcceptRequest = (requestId: string) => {
    updateSwapRequest(requestId, 'accepted');
    toast.success('Swap request accepted!');
  };

  const handleRejectRequest = (requestId: string) => {
    updateSwapRequest(requestId, 'rejected');
    toast.success('Swap request rejected');
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId);
      toast.success('Item deleted successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your items and swap requests</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">My Items</p>
                <p className="text-2xl font-bold text-gray-900">{userItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ArrowUpDown className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Swap Requests</p>
                <p className="text-2xl font-bold text-gray-900">{incoming.length + outgoing.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful Swaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...incoming, ...outgoing].filter(req => req.status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link to="/add-item">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Item</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('items')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'items'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Items ({userItems.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'requests'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Swap Requests ({incoming.length + outgoing.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* My Items Tab */}
            {activeTab === 'items' && (
              <div className="space-y-4">
                {userItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first item to the community</p>
                    <Link to="/add-item">
                      <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                        Add Your First Item
                      </button>
                    </Link>
                  </div>
                ) : (
                  userItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.category} • {item.size}</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                            item.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/item/${item.id}`}>
                          <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Swap Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                {/* Incoming Requests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Incoming Requests ({incoming.length})
                  </h3>
                  {incoming.length === 0 ? (
                    <p className="text-gray-600">No incoming requests</p>
                  ) : (
                    <div className="space-y-4">
                      {incoming.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {request.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">They want your:</p>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={request.requestedItem.image}
                                  alt={request.requestedItem.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{request.requestedItem.title}</p>
                                  <p className="text-sm text-gray-600">{request.requestedItem.size}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">They offer:</p>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={request.offeredItem.image}
                                  alt={request.offeredItem.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{request.offeredItem.title}</p>
                                  <p className="text-sm text-gray-600">{request.offeredItem.size}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Outgoing Requests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Outgoing Requests ({outgoing.length})
                  </h3>
                  {outgoing.length === 0 ? (
                    <p className="text-gray-600">No outgoing requests</p>
                  ) : (
                    <div className="space-y-4">
                      {outgoing.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {request.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">You want:</p>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={request.requestedItem.image}
                                  alt={request.requestedItem.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{request.requestedItem.title}</p>
                                  <p className="text-sm text-gray-600">{request.requestedItem.size}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">You offered:</p>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={request.offeredItem.image}
                                  alt={request.offeredItem.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{request.offeredItem.title}</p>
                                  <p className="text-sm text-gray-600">{request.offeredItem.size}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;