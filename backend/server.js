require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Models
const User = require('./models/User');
const Student = require('./models/Student');

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:3000
    credentials: true,
  })
);

/* ---------- DB CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.error('DB Connection Error:', err));

/* ---------- GOOGLE CLIENT ---------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------- JWT MIDDLEWARE ---------- */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(403).json({ message: 'Token required' });

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/* ---------- AUTH ROUTES ---------- */

// Register (Email/Password)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      authProvider: 'local',
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (Email/Password)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    if (user.authProvider === 'google')
      return res
        .status(400)
        .json({ message: 'Please login with Google' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login / Register
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // MUST match frontend
    });

    const { sub, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        picture,
        authProvider: 'google',
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

/* ---------- STUDENT ROUTES (PROTECTED) ---------- */

// Create student
app.post('/api/students', verifyToken, async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      userId: req.user.id,
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error creating student' });
  }
});

// Get students (only logged-in user)
app.get('/api/students', verifyToken, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Update student (ownership check)
app.put('/api/students/:id', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!student)
      return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error updating student' });
  }
});

// Delete student (ownership check)
app.delete('/api/students/:id', verifyToken, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!student)
      return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student' });
  }
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
