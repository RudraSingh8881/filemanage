// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration (YOUR EXISTING CODE - KEEP AS IS)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Multer for image upload (YOUR EXISTING CODE - KEEP AS IS)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ MongoDB Connection (YOUR EXISTING CODE - KEEP AS IS)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB Error:', err.message);
    console.log('Using Demo Mode (data resets on restart)');
  });

// ✅ Schemas (YOUR EXISTING CODE - KEEP AS IS)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

const PinSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Pin = mongoose.model('Pin', PinSchema);

// ✅ Demo Mode Fallback (YOUR EXISTING CODE - KEEP AS IS)
let demoPins = [];

// ✅ JWT Middleware (YOUR EXISTING CODE - KEEP AS IS)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ========================
// ✅ NEW UPLOAD ROUTES ADD HERE
// ========================

// Upload image to uploads/ folder
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully to uploads/ folder',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all uploaded files from uploads/ folder
app.get('/api/upload/files', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    const fileList = files.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        url: `/uploads/${file}`
      };
    });
    
    res.json({ files: fileList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route to check uploads folder contents
app.get('/api/uploads-list', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    res.json({ 
      message: `Found ${files.length} files in uploads folder`,
      files: files 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ✅ YOUR EXISTING ROUTES (KEEP ALL AS IS)
// ========================

// === TEST ROUTE ===
app.get('/api/test', (req, res) => res.json({ msg: 'API Working!' }));

// === AUTH ROUTES ===
// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// === PIN ROUTES ===

// ✅ TEMPORARY FIX: Create Pin without authentication (REPLACE THIS ROUTE ONLY)
app.post('/api/pins', upload.single('image'), async (req, res) => {
  try {
    console.log('Pin creation request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ msg: 'Image file is required' });
    }

    const pinData = {
      title: req.body.title,
      description: req.body.description || '',
      image: `/uploads/${req.file.filename}`,
      userId: 'demo-user-id' // Temporary user ID
    };

    if (mongoose.connection.readyState === 1) {
      const newPin = new Pin(pinData);
      await newPin.save();
      const populated = await Pin.findById(newPin._id).populate('userId', 'username');
      res.json(populated);
    } else {
      const demoPin = {
        ...pinData,
        _id: Date.now().toString(),
        createdAt: new Date(),
        userId: 'demo-user-id'
      };
      demoPins.push(demoPin);
      res.json(demoPin);
    }
  } catch (err) {
    console.error('Pin creation error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// GET ALL PINS – SEARCH + PAGINATION (Used by /explore)
app.get('/api/pins', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchRegex = new RegExp(search.trim(), 'i');

    let pins = [];
    let total = 0;
    let hasMore = false;

    if (mongoose.connection.readyState === 1) {
      const query = search
        ? { $or: [{ title: searchRegex }, { description: searchRegex }] }
        : {};

      pins = await Pin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit) + 1)
        .populate('userId', 'username');

      total = await Pin.countDocuments(query);
      hasMore = pins.length > parseInt(limit);
      if (hasMore) pins = pins.slice(0, parseInt(limit));
    } else {
      const filtered = demoPins.filter(p =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      );

      pins = filtered
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + parseInt(limit));

      total = filtered.length;
      hasMore = skip + pins.length < total;
    }

    res.json({ pins, total, hasMore });
  } catch (err) {
    console.error('GET /api/pins error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Pins (Profile)
app.get('/api/pins/user/:userId', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pins = await Pin.find({ userId: req.params.userId })
        .sort({ createdAt: -1 })
        .populate('userId', 'username');
      res.json(pins);
    } else {
      const pins = demoPins.filter(p => p.userId === req.params.userId);
      res.json(pins);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update Pin - REMOVED AUTHENTICATION
app.put('/api/pins/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pin = await Pin.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!pin) return res.status(404).json({ msg: 'Pin not found' });
      res.json(pin);
    } else {
      const index = demoPins.findIndex(p => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ msg: 'Not found' });
      demoPins[index] = { ...demoPins[index], ...req.body };
      res.json(demoPins[index]);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete Pin - REMOVED AUTHENTICATION
app.delete('/api/pins/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const result = await Pin.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ msg: 'Pin not found' });
      res.json({ msg: 'Deleted' });
    } else {
      demoPins = demoPins.filter(p => p._id !== req.params.id);
      res.json({ msg: 'Deleted' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Create uploads folder (YOUR EXISTING CODE - KEEP AS IS)
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// ========================
// ✅ TEMPORARY MOCK AUTH ROUTES (ADDED AT THE END)
// ========================

// Simple mock login that always works
app.post('/api/simple-login', (req, res) => {
  console.log('Simple login request:', req.body);
  
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password should be at least 6 characters' 
    });
  }
  
  // Always return success for testing
  res.json({
    message: 'Login successful (demo mode)',
    token: 'demo-token-' + Date.now(),
    user: {
      id: 1,
      username: 'demo_user',
      email: email,
      avatar: null
    }
  });
});

// Simple mock register that always works
app.post('/api/simple-register', (req, res) => {
  console.log('Simple register request:', req.body);
  
  const { username, email, password } = req.body;
  
  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ 
      message: 'Username, email and password are required' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password should be at least 6 characters' 
    });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ 
      message: 'Username should be at least 3 characters' 
    });
  }
  
  // Mock successful registration
  res.status(201).json({
    message: 'User registered successfully (demo mode)',
    token: 'demo-token-' + Date.now(),
    user: {
      id: 2,
      username: username,
      email: email,
      avatar: null
    }
  });
});

// ✅ Start Server (YOUR EXISTING CODE - KEEP AS IS)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/test`);
  console.log(`Upload Test: http://localhost:${PORT}/api/uploads-list`);
  console.log(`Demo Login: POST http://localhost:${PORT}/api/simple-login`);
  console.log(`Demo Register: POST http://localhost:${PORT}/api/simple-register`);
});