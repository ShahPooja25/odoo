import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, User, LogOut, Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg"
            >
              <Shirt className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              ReWear
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Browse Items</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/add-item"
                  className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/browse"
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-teal-600"
            >
              <Search className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/add-item"
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-teal-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-teal-600"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;