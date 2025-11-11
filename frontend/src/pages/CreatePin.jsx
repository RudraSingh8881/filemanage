// frontend/src/pages/CreatePin.jsx - ✅ USE THIS SIMPLE VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const CreatePin = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Login check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to create pins');
      navigate('/login');
    }
  }, [navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title) return;

    setLoading(true);
    
    try {
      // Double check token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      const formData = { title, description, image };
      await API.createPin(formData);
      alert('Pin created successfully!');
      navigate('/');
      
    } catch (err) {
      console.error('Error creating pin:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error creating pin. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">Create Pin</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500">
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" id="image" />
            <label htmlFor="image" className="cursor-pointer block">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
              ) : (
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    📷
                  </div>
                  <p className="text-lg font-medium">Click to upload image</p>
                </div>
              )}
            </label>
          </div>

          {/* TITLE */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border rounded-xl text-lg"
            required
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-4 border rounded-xl"
          />

          <button
            type="submit"
            disabled={loading || !image || !title}
            className="w-full bg-purple-600 text-white p-4 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Pin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;