// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { getPins, updatePin, deletePin } from '../utils/api';

const Home = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPin, setEditingPin] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    setLoading(true);
    try {
      const data = await getPins();
      setPins(data.pins || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (pin) => {
    setEditingPin(pin._id);
    setEditForm({ title: pin.title, description: pin.description });
  };

  // SABSE SIMPLE UPDATE LOGIC — 100% WORKING!
  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);

      await updatePin(editingPin, formData);

      // YE HAI MAGIC LINE — direct update, no backend dependency!
      setPins(pins.map(p => 
        p._id === editingPin 
          ? { ...p, title: editForm.title, description: editForm.description }
          : p
      ));

      setEditingPin(null);
      setEditForm({ title: '', description: '' });
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pin?')) return;
    try {
      await deletePin(id);
      setPins(pins.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-3xl font-bold text-purple-600">Loading pins...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            PinHub
          </h1>
          <p className="text-2xl text-purple-600 mt-4">Discover & Create Amazing Pins</p>
        </div>

        <div className="masonry">
          {pins.map((pin) => (
            <div
              key={pin._id}
              className="break-inside-avoid mb-6 group relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <img
                src={`http://localhost:5000${pin.image}`}
                alt={pin.title}
                className="w-full object-cover"
                onError={(e) => e.target.src = '/placeholder-image.jpg'}
              />

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="flex gap-3 pointer-events-auto">
                  <button
                    onClick={() => startEdit(pin)}
                    className="bg-white text-purple-600 px-5 py-3 rounded-full font-bold shadow-lg hover:bg-purple-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pin._id)}
                    className="bg-red-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="p-6">
                {editingPin === pin._id ? (
                  <div className="space-y-4">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:border-purple-600 outline-none"
                      placeholder="Title"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl resize-none focus:border-purple-600 outline-none"
                      placeholder="Description"
                    />
                    <div className="flex gap-3">
                      <button onClick={saveEdit} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold">
                        Save
                      </button>
                      <button onClick={() => setEditingPin(null)} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800">{pin.title}</h3>
                    <p className="text-gray-600 mt-2">{pin.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {pins.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-64 h-64 mx-auto mb-8"></div>
            <h3 className="text-4xl font-bold text-gray-700">No pins yet!</h3>
            <p className="text-2xl text-gray-500 mt-4">Your pins will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;