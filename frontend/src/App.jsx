// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import CreatePin from './pages/CreatePin';
import Login from './components/Login';
import Register from './pages/Register';
import Footer from './components/Footer';     // FOOTER ADD HO GAYA
import Navbar from './components/Navbar';       // TERA PURANA NAVBAR BHI HAI
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
          
          {/* TERA PURANA NAVBAR */}
          <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-purple-600">Rudra.PinHub</Link>
              
              <nav className="flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
                <Link to="/create" className="text-gray-700 hover:text-purple-600 font-medium">Create Pin</Link>
                
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Welcome, {user.username || user.email}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-gray-700 hover:text-purple-600 font-medium">Login</Link>
                    <span className="text-gray-400">|</span>
                    <Link to="/register" className="text-gray-700 hover:text-purple-600 font-medium">Register</Link>
                  </div>
                )}
              </nav>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>

          {/* FOOTER HAR PAGE ME DIKHEGA */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;