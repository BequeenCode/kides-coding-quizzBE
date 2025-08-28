const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Allowed admin emails
const allowedAdminEmails = ['admin1@school.com', 'admin2@school.com'];

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, role, age, email } = req.body;

    // Restrict admin registration
    let userRole = role;
    if (role === 'admin') {
      if (!allowedAdminEmails.includes(email)) {
        return res.status(403).json({ message: 'Admin registration restricted' });
      }
      userRole = 'admin';
    } else {
      userRole = 'kid';
    }

    // Check if username/email exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = new User({ name, username, password, role: userRole, age, email });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: user.role, age: user.age, email: user.email }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const correct = await user.correctPassword(password);
    if (!correct) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: user.role, age: user.age, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
