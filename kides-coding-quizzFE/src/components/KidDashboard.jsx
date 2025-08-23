// src/components/KidDashboard.jsx
import React, { useState, useEffect } from 'react';
import { questionsAPI, resultsAPI } from '../utils/api';

const KidDashboard = ({ user, setLoading }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);

  const topics = [
    { id: 1, name: 'HTML', icon: '🌐', color: '#ff7e5f' },
    { id: 2, name: 'Scratch', icon: '🐱', color: '#00cdac' },
    { id: 3, name: 'Python', icon: '🐍', color: '#7474bf' }
  ];

  const handleTopicSelect = async (topic) => {
    setLoading(true);
    try {
      const questionsData = await questionsAPI.getRandom(topic.name, 10);
      setQuestions(questionsData);
      setSelectedTopic(topic);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setAnswers([]);
    } catch (error) {
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerIndex) => {
    const currentQ = questions[currentQuestion];
    const selectedAnswer = currentQ.options[answerIndex];
    const isCorrect = selectedAnswer === currentQ.answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const newAnswers = [...answers, {
      question: currentQ.question,
      selected: selectedAnswer,
      correct: currentQ.answer,
      isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, submit results
      try {
        await resultsAPI.create({
          topic: selectedTopic.name,
          score: isCorrect ? score + 1 : score,
          total: questions.length,
          percentage: Math.round(((isCorrect ? score + 1 : score) / questions.length) * 100),
          answers: newAnswers
        });
        
        setShowResult(true);
      } catch (error) {
        alert('Failed to save results. Please try again.');
      }
    }
  };

  const generateCertificate = () => {
    setLoading(true);
    // In a real app, this would generate and download a PDF certificate
    setTimeout(() => {
      alert("Certificate generated! In a real app, this would download a PDF.");
      setLoading(false);
    }, 1500);
  };

  if (!selectedTopic) {
    return (
      <div className="kid-dashboard">
        <h2>Welcome, {user.name}!</h2>
        <p>Choose a topic to start your quiz:</p>
        <div className="topic-selection">
          {topics.map(topic => (
            <div 
              key={topic.id} 
              className="topic-card"
              style={{ backgroundColor: topic.color }}
              onClick={() => handleTopicSelect(topic)}
            >
              <div className="topic-icon">{topic.icon}</div>
              <h3>{topic.name}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-result">
        <h2>Quiz Completed!</h2>
        <h3>Your score: {score} out of {questions.length}</h3>
        <div className="certificate-section">
          <button onClick={generateCertificate} className="btn btn-primary">
            Download Certificate
          </button>
        </div>
        <button 
          onClick={() => setSelectedTopic(null)} 
          className="btn btn-outline"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-interface">
        <h2>Loading questions...</h2>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-interface">
      <h2>{selectedTopic.name} Quiz</h2>
      <div className="progress">
        Question {currentQuestion + 1} of {questions.length}
      </div>
      <div className="question-card">
        <h3>{currentQ.question}</h3>
        <div className="options">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleAnswerSelect(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button 
        onClick={() => setSelectedTopic(null)} 
        className="btn btn-outline"
      >
        Change Topic
      </button>
    </div>
  );
};

export default KidDashboard;