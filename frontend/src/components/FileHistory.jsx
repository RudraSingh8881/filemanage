// src/components/FileHistory.jsx - FIXED VERSION
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { History, RotateCcw, Trash2, X, Clock, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FileHistory = ({ onReuse }) => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Use getUserPins instead of API.get
      const userPins = await API.getUserPins(user.id || user._id);
      const recentPins = userPins.slice(0, 10); // Last 10 pins
      
      // Add history protection
      const protectedHistory = recentPins.map(pin => ({
        ...pin,
        isProtectedHistory: true,
        historyBackup: {
          image: pin.image,
          title: pin.title,
          description: pin.description,
          username: pin.username,
          createdAt: pin.createdAt
        }
      }));
      
      setHistory(protectedHistory);
    } catch (err) {
      console.log('Failed to load history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      loadHistory();
    }
  }, [showHistory]);

  const handleReuse = async (file) => {
    try {
      console.log('Reusing file from history:', file);
      const fileToReuse = file.historyBackup ? { ...file, ...file.historyBackup } : file;
      
      if (onReuse) {
        onReuse(fileToReuse);
      }
      
      setShowHistory(false);
    } catch (error) {
      console.error('Error reusing file:', error);
    }
  };

  const handleDeleteFromHistory = async (fileId, e) => {
    e.stopPropagation();
    if (!confirm('Remove this file from history?')) return;
    
    try {
      setHistory(prev => prev.filter(file => file._id !== fileId));
    } catch (err) {
      console.error('Failed to delete from history:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="mb-8">
      {/* HISTORY TOGGLE BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-700">Your File History</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition"
        >
          <History size={18} />
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* HISTORY PANEL */}
      {showHistory && (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-6 animate-fadeIn">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
              <Clock size={20} />
              Recent files ({history.length})
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* PROTECTION MESSAGE */}
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-600" />
              <p className="text-sm text-green-700">
                <strong>Protected History:</strong> Files remain here even if deleted from main pages
              </p>
            </div>
          </div>

          {/* HISTORY CONTENT */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-500">Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No file history yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create some file to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {history.map((file) => (
                <div
                  key={file._id}
                  className="bg-white rounded-xl border border-purple-200 hover:border-purple-500 transition cursor-pointer group relative"
                  onClick={() => handleReuse(file)}
                >
                  <div className="relative">
                    <img                      
                    src={`${API_URL}${file.image}`}
                      alt={file.title}
                      className="w-full h-32 object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x128?text=Image';
                      }}
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        🛡️ Protected
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 truncate">
                      {file.title || 'Untitled File'}
                    </h4>
                    {file.description && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {file.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-purple-600">
                        {formatDate(file.createdAt)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Click to reuse
                      </span>
                    </div>
                  </div>

                  {/* HOVER ACTIONS */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-xl">
                    <button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full transition hover:scale-110"
                      title="Reuse this file"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFromHistory(file._id, e)}
                      className="bg-red-500 text-white p-2 rounded-full transition hover:scale-110 hover:bg-red-600"
                      title="Remove from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileHistory;
