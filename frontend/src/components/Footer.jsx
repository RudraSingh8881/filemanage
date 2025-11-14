// src/components/Footer.jsx - UPDATED TO MATCH NAVBAR
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Instagram, Twitter, Home, Search, Plus, User, History } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand - Matches Navbar Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                P
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PinHub
              </h1>
            </div>
            <p className="text-purple-200 text-lg leading-relaxed">
              Where creativity meets inspiration. Save, share, and discover amazing pins from our community!
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all transform hover:scale-110 hover:shadow-lg">
                <Instagram size={20} className="text-pink-300" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all transform hover:scale-110 hover:shadow-lg">
                <Twitter size={20} className="text-blue-300" />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all transform hover:scale-110 hover:shadow-lg">
                <Github size={20} className="text-gray-300" />
              </a>
            </div>
          </div>

          {/* Navigation - Matches Navbar Items */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300 flex items-center gap-2">
              <Home size={18} />
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <Home size={16} className="group-hover:scale-110 transition" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <Search size={16} className="group-hover:scale-110 transition" />
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <Plus size={16} className="group-hover:scale-110 transition" />
                  Create Pin
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <User size={16} className="group-hover:scale-110 transition" />
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Features - Matches Navbar Features */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300 flex items-center gap-2">
              <History size={18} />
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-purple-400 rounded-full group-hover:scale-150 transition"></div>
                  Pin History
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-pink-400 rounded-full group-hover:scale-150 transition"></div>
                  Image Compression
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition"></div>
                  Search & Discover
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-300 transition-all flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition"></div>
                  Reuse Pins
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter - Enhanced */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300">Stay Inspired</h3>
            <p className="text-purple-200 mb-4 leading-relaxed">
              Get weekly creative inspiration, trending pins, and exclusive tips delivered to your inbox!
            </p>
            <div className="flex group">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="px-4 py-3 rounded-l-full bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:border-pink-400 flex-1 transition-all group-hover:bg-white/15"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-r-full font-bold hover:shadow-2xl transition-all transform hover:scale-105 hover:from-pink-600 hover:to-purple-700 flex items-center gap-2">
                <Heart size={16} />
                Subscribe
              </button>
            </div>
            <p className="text-xs text-purple-300 mt-3">
              No spam ever. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-lg font-medium">
                Made with <Heart className="inline mx-1 text-red-500 animate-pulse" size={18} /> by 
                <span className="font-bold text-pink-300 ml-1">Creative Minds</span>
              </p>
              <p className="text-sm text-purple-300 mt-1">
                © {currentYear} PinHub. All rights reserved. Crafted with React & Tailwind CSS
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-purple-300 hover:text-pink-300 transition hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition hover:underline">
                Terms of Service
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition hover:underline">
                Cookie Policy
              </a>
              <a href="#" className="text-purple-300 hover:text-pink-300 transition hover:underline">
                Support
              </a>
            </div>

            {/* Stats */}
            <div className="text-center md:text-right">
              <div className="flex gap-4 text-xs text-purple-300">
                <span>🚀 10K+ Pins</span>
                <span>👥 2K+ Users</span>
                <span>⭐ 50K+ Likes</span>
              </div>
            </div>
          </div>

          {/* Mobile App Coming Soon */}
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-pink-300 font-medium mb-2">
              📱 Mobile App Coming Soon!
            </p>
            <p className="text-purple-300 text-sm">
              Get ready to take your pin collection everywhere you go
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;