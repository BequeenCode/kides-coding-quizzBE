const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ]
});

module.exports = mongoose.model("Quiz", quizSchema);
