// src/components/Footer.jsx
import React from 'react';
import { Heart, Github, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                P
              </div>
              <h1 className="text-3xl font-black">PinHub</h1>
            </div>
            <p className="text-purple-200 text-lg">
              Where creativity meets inspiration. Save, share, and discover amazing pins!
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition transform hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition transform hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition transform hover:scale-110">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="hover:text-pink-300 transition">Home</a></li>
              <li><a href="/explore" className="hover:text-pink-300 transition">Explore</a></li>
              <li><a href="/create" className="hover:text-pink-300 transition">Create Pin</a></li>
              <li><a href="/profile" className="hover:text-pink-300 transition">Profile</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300">Community</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-pink-300 transition">About Us</a></li>
              <li><a href="#" className="hover:text-pink-300 transition">Blog</a></li>
              <li><a href="#" className="hover:text-pink-300 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-pink-300 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-pink-300">Stay Updated</h3>
            <p className="text-purple-200 mb-4">Get weekly inspiration in your inbox!</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 rounded-l-full bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:border-pink-400 flex-1"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-r-full font-bold hover:shadow-2xl transition transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-lg">
            Made with <Heart className="inline mx-2 text-red-500 animate-pulse" size={20} /> by 
            <span className="font-bold text-pink-300"> You</span>
          </p>
          <p className="text-sm text-purple-300 mt-2">
            © 2025 PinHub. All rights reserved. Built with love & React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;