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

// ========================
// ✅ CORS CONFIG
// ========================
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const FRONTEND_ORIGINS = FRONTEND_URL.split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ========================
// ✅ MULTER
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ========================
// ✅ DATABASE
// ========================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB Error:', err.message);
    console.log('Using Demo Mode (data resets on restart)');
  });

// ========================
// ✅ SCHEMAS
// ========================
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

let demoPins = [];

// ========================
// ✅ FIXED AUTH MIDDLEWARE
// ========================
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token expired or invalid' });
  }
};

// ========================
// ✅ TEST
// ========================
app.get('/api/test', (req, res) => res.json({ msg: 'API Working!' }));

// ========================
// ✅ AUTH ROUTES
// ========================
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashed });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username, email }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ========================
// ✅ GET ALL PINS
// ========================
app.get('/api/pins', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchRegex = new RegExp(search.trim(), 'i');

    let pins = [];

    if (mongoose.connection.readyState === 1) {
      const query = search
        ? { $or: [{ title: searchRegex }, { description: searchRegex }] }
        : {};

      pins = await Pin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'username');

    } else {
      pins = demoPins.slice(skip, skip + parseInt(limit));
    }

    res.json({ pins });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// ✅ CREATE PIN
// ========================
app.post('/api/pins', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Image required' });
    }

    const pinData = {
      title: req.body.title,
      description: req.body.description || '',
      image: `/uploads/${req.file.filename}`,
      userId: req.user.id
    };

    const newPin = new Pin(pinData);
    await newPin.save();

    const populated = await Pin.findById(newPin._id).populate('userId', 'username');
    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ========================
// ✅ UPDATE PIN (FIXED HERE)
// ========================
app.put('/api/pins/:id', authenticate, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ msg: 'Pin not found' });

    // 🔥 FIXED COMPARISON
    if (!pin.userId.equals(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized: not owner' });
    }

    const updated = await Pin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ========================
// ✅ DELETE PIN (FIXED HERE)
// ========================
app.delete('/api/pins/:id', authenticate, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ msg: 'Pin not found' });

    // 🔥 FIXED COMPARISON
    if (!pin.userId.equals(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized: not owner' });
    }

    await Pin.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted successfully' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET USER HISTORY
app.get('/api/history', authenticate, async (req, res) => {
  try {
    const pins = await Pin.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(pins);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET PINS BY USER
app.get('/api/pins/user/:userId', authenticate, async (req, res) => {
  try {
    const pins = await Pin.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(pins);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ========================
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});