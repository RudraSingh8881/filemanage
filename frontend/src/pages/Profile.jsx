// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import MasonryGrid from '../components/MasonryGrid';
import { Edit2, Trash2, Loader2, Check, X, Upload } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [pins, setPins] = useState([]);
  const [editingPin, setEditingPin] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [deletingPin, setDeletingPin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const userId = user?.id || localStorage.getItem('userId') || 'demo';

  useEffect(() => {
    loadPins();
  }, [userId]);

  const loadPins = async () => {
    try {
      // ✅ FIXED API CALL
      const userPins = await API.getUserPins(userId);
      setPins(userPins.map(p => ({
        ...p,
        username: user?.username,
        likedBy: p.likedBy || []
      })));
    } catch (err) {
      setPins([]);
    }
  };

  const startEdit = (pin) => {
    setEditingPin(pin._id);
    setEditTitle(pin.title);
    setEditDesc(pin.description);
    setEditImage(null);
    setEditImagePreview(`http://localhost:5000${pin.image}`);
  };

  const cancelEdit = () => {
    setEditingPin(null);
    setEditTitle('');
    setEditDesc('');
    setEditImage(null);
    setEditImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    setEditImagePreview(`http://localhost:5000${pins.find(p => p._id === editingPin)?.image}`);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);

    const formData = new FormData();
    formData.append('title', editTitle.trim());
    formData.append('description', editDesc.trim());
    if (editImage) formData.append('image', editImage);

    try {
      // ✅ FIXED API CALL
      await API.updatePin(editingPin, formData);
      setShowSuccess(true);
      setTimeout(() => {
        loadPins();
        cancelEdit();
        setShowSuccess(false);
      }, 1500);
    } catch (err) {
      alert('Failed to update pin');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingPin(id);
  };

  const cancelDelete = () => {
    setDeletingPin(null);
  };

  const deletePin = async () => {
    try {
      // ✅ FIXED API CALL
      await API.deletePin(deletingPin);
      loadPins();
      cancelDelete();
    } catch (err) {
      alert('Failed to delete pin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mb-10 text-center border border-purple-100">
          <div className="w-36 h-36 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-2xl ring-8 ring-white/50">
            {user?.username?.[0].toUpperCase() || 'U'}
          </div>
          <h1 className="text-5xl font-extrabold mt-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {user?.username || 'Guest User'}
          </h1>
          <p className="text-2xl text-purple-600 font-medium mt-2">
            @{user?.username?.toLowerCase().replace(/\s+/g, '') || 'guest'}
          </p>
          <p className="text-gray-600 mt-2 text-lg">{user?.email || 'No email'}</p>

          <div className="flex justify-center gap-12 mt-8">
            <div>
              <div className="text-4xl font-bold text-purple-600">{pins.length}</div>
              <div className="text-gray-600 font-medium">Pins</div>
            </div>
          </div>
        </div>

        {/* MASONRY GRID */}
        {pins.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-48 h-48 mx-auto mb-8 animate-pulse"></div>
            <h3 className="text-3xl font-bold text-gray-700 mb-3">No pins yet</h3>
            <p className="text-xl text-gray-500">Create your first masterpiece!</p>
          </div>
        ) : (
          <MasonryGrid pins={pins} onEdit={startEdit} onDelete={confirmDelete} />
        )}

        {/* EDIT MODAL WITH IMAGE UPLOAD */}
        {editingPin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 animate-fadeIn max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Pin</h3>
                <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* IMAGE UPLOAD IN EDIT */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label htmlFor="edit-image-upload" className="cursor-pointer block">
                    {editImagePreview ? (
                      <div className="relative group">
                        <img
                          src={editImagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-xl shadow-lg group-hover:scale-105 transition"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEditImage();
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload size={40} className="mx-auto text-purple-500" />
                        <p className="text-lg font-medium text-gray-700">Change image</p>
                        <p className="text-sm text-gray-500">Click to upload new image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* TITLE */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-5 py-3 border-2 border-purple-200 rounded-xl text-lg font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition mb-4"
              />

              {/* DESCRIPTION */}
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={4}
                placeholder="Description"
                className="w-full px-5 py-3 border-2 border-purple-200 rounded-xl resize-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition mb-6"
              />

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={saveEdit}
                  disabled={saving || !editTitle.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {deletingPin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={40} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Delete Pin?</h3>
                <p className="text-gray-600 mb-6">This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={deletePin}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS TOAST */}
        {showSuccess && (
          <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounceIn z-50">
            <Check size={24} />
            <span className="font-bold">Pin updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;