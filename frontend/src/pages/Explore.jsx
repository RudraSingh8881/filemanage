// src/pages/Explore.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import API from '../utils/api';
import MasonryGrid from '../components/MasonryGrid';
import { Search, Loader2, X } from 'lucide-react';

const Explore = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const loadPins = async (query = '', pageNum = 1, append = false) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // ✅ FIXED API CALL
      const res = await API.getPins(query, pageNum);
      const newPins = res.pins || [];
      setPins(prev => append ? [...prev, ...newPins] : newPins);
      setHasMore(res.hasMore || newPins.length === 12);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setPins([]);
      loadPins(search, 1, false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Infinite scroll
  const lastPinRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      loadPins(search, page, true);
    }
  }, [page]);

  useEffect(() => {
    loadPins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* SEARCH BAR */}
        <div className="sticky top-20 bg-gradient-to-br from-purple-50 to-pink-50 z-40 pt-4 pb-8 backdrop-blur-lg">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-500" size={24} />
            <input
              type="text"
              placeholder="Search pins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-12 py-5 text-lg rounded-full bg-white/90 backdrop-blur-md shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* PINS GRID */}
        {pins.length === 0 && !loading ? (
          <div className="text-center py-24">
            <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-48 h-48 mx-auto mb-8 animate-pulse"></div>
            <h3 className="text-3xl font-bold text-gray-700 mb-3">
              {search ? 'No pins found' : 'No pins yet'}
            </h3>
            <p className="text-xl text-gray-500">
              {search ? `Try searching for "${search}"` : 'Be the first to create a pin!'}
            </p>
          </div>
        ) : (
          <div className="pb-20">
            <MasonryGrid
              pins={pins.map((pin, i) => ({
                ...pin,
                ref: i === pins.length - 1 ? lastPinRef : null
              }))}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-purple-600" size={48} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;