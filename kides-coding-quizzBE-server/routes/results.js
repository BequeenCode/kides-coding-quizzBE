const express = require('express');
const Result = require('../models/Result');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all results (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const results = await Result.find().populate('user', 'name username');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get results for current user
router.get('/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create result
router.post('/', auth, async (req, res) => {
  try {
    const { topic, score, total, percentage, answers } = req.body;
    
    const result = new Result({
      user: req.user._id,
      topic,
      score,
      total,
      percentage,
      answers
    });
    
    await result.save();
    
    // Populate user data
    await result.populate('user', 'name username');
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;