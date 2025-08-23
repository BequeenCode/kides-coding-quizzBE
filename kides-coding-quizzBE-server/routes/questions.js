const express = require('express');
const Question = require('../models/Question');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all questions
router.get('/', auth, async (req, res) => {
  try {
    const { topic } = req.query;
    const query = topic ? { topic } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get random questions by topic
router.get('/random/:topic', auth, async (req, res) => {
  try {
    const { topic } = req.params;
    const { limit = 10 } = req.query;
    
    const questions = await Question.aggregate([
      { $match: { topic } },
      { $sample: { size: parseInt(limit) } }
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create question (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { topic, question, options, answer, difficulty } = req.body;
    
    const newQuestion = new Question({
      topic,
      question,
      options,
      answer,
      difficulty
    });
    
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update question (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { topic, question, options, answer, difficulty } = req.body;
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { topic, question, options, answer, difficulty },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete question (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;