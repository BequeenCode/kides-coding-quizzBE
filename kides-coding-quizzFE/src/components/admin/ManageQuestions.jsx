// src/components/admin/ManageQuestions.jsx
import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../../utils/api';

const ManageQuestions = ({ setLoading }) => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    topic: 'HTML',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    difficulty: 'easy',
    explanation: ''
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const questionsData = await questionsAPI.getAll();
      setQuestions(questionsData);
    } catch (error) {
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Filter out empty options
      const filteredOptions = formData.options.filter(option => option.trim() !== '');
      
      await questionsAPI.create({
        ...formData,
        options: filteredOptions
      });
      
      alert('Question added successfully!');
      setFormData({
        topic: 'HTML',
        question: '',
        options: ['', '', '', ''],
        answer: '',
        difficulty: 'easy',
        explanation: ''
      });
      loadQuestions(); // Reload questions
    } catch (error) {
      alert('Failed to add question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    setLoading(true);
    try {
      await questionsAPI.delete(id);
      alert('Question deleted successfully!');
      loadQuestions(); // Reload questions
    } catch (error) {
      alert('Failed to delete question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-questions">
      <div className="add-question-form">
        <h3>Add New Question</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Topic:</label>
            <select name="topic" value={formData.topic} onChange={handleChange}>
              <option value="HTML">HTML</option>
              <option value="Scratch">Scratch</option>
              <option value="Python">Python</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Question:</label>
            <textarea 
              name="question" 
              value={formData.question} 
              onChange={handleChange}
              rows="3"
              placeholder="Enter your question here"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Options:</label>
            {formData.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required={index < 2} // At least 2 options are required
              />
            ))}
          </div>
          
          <div className="form-group">
            <label>Correct Answer:</label>
            <select name="answer" value={formData.answer} onChange={handleChange} required>
              <option value="">Select correct option</option>
              {formData.options.map((option, index) => (
                option && (
                  <option key={index} value={option}>
                    Option {index + 1}: {option}
                  </option>
                )
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Difficulty:</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Explanation (optional):</label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows="2"
              placeholder="Explanation for the correct answer"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Add Question</button>
        </form>
      </div>
      
      <div className="questions-table">
        <h3>Existing Questions ({questions.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>TOPIC</th>
              <th>QUESTION</th>
              <th>OPTIONS</th>
              <th>ANSWER</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q._id}>
                <td>{q._id.substring(0, 6)}...</td>
                <td>{q.topic}</td>
                <td>{q.question}</td>
                <td>
                  <ul>
                    {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                  </ul>
                </td>
                <td>{q.answer}</td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageQuestions;