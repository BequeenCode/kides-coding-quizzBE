const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// POST /api/quiz/add
router.post("/add", async (req, res) => {
  try {
    const { topic, question, options } = req.body;
    const quiz = new Quiz({ topic, question, options });
    await quiz.save();
    res.json({ message: "Quiz added successfully!", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quiz - get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
