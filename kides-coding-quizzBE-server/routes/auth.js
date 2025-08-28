// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    const { name, username, password, role, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Registration failed: Username already exists');
      return res.status(400).json({ 
        message: 'Username already exists',
        error: 'USERNAME_EXISTS'
      });
    }

    // Create new user
    const user = new User({ name, username, password, role, age });
    await user.save();
    
    console.log('User created successfully:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        age: user.age
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

module.exports = router;