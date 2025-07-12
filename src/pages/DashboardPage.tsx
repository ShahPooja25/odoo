import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Package,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
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
          className="flex gap-4 mb-8"
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

          <a
            href="https://v0-apparel-swap-analytics.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-shadow"
            >
              Admin Panel
            </motion.button>
          </a>
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
            {activeTab === 'items' && (
              <div className="space-y-4">
                {userItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
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
                        <button className="p-2 text-gray-600 hover:text-teal-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                {/* Incoming Requests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Incoming Requests ({incoming.length})
                  </h3>
                  {incoming.map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-500">{req.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">They want: {req.requestedItem.title}</p>
                      <p className="text-sm text-gray-700">They offer: {req.offeredItem.title}</p>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Outgoing Requests */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Outgoing Requests ({outgoing.length})
                  </h3>
                  {outgoing.map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        <span className="text-xs text-gray-500">{req.createdAt.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">You want: {req.requestedItem.title}</p>
                      <p className="text-sm text-gray-700">You offered: {req.offeredItem.title}</p>
                    </div>
                  ))}
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
