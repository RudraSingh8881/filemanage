// src/components/Navbar.jsx - ✅ UPDATED
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, Plus, User, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold text-purple-600">PinHub</span>
          </Link>

          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pins..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          {/* NAV ICONS */}
          <div className="flex items-center gap-4">

            {/* HOME */}
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition">
              <Home size={24} />
            </Link>

            {/* EXPLORE */}
            <Link to="/explore" className="p-2 hover:bg-gray-100 rounded-full transition">
              <Search size={24} />
            </Link>

            {/* CREATE PIN */}
            {user && (
              <Link to="/create" className="p-2 hover:bg-gray-100 rounded-full transition">
                <Plus size={24} />
              </Link>
            )}

            {/* PROFILE */}
            {user && (
              <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full transition">
                <User size={24} />
              </Link>
            )}

            {/* AUTH BUTTON */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition font-medium"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-medium"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;