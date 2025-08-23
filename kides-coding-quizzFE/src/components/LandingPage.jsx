// src/components/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Features data
  const features = [
    {
      icon: '📊',
      title: 'Track Your Progress',
      description: 'See how you improve over time with your personal dashboard!'
    },
    {
      icon: '🏆',
      title: 'Cool Certificates',
      description: 'Download personalized certificates for every quiz you complete!'
    },
    {
      icon: '🔒',
      title: 'Safe & Fun',
      description: 'Your own secure account designed specially for young learners!'
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="landing-page">
      {/* Background image with overlay */}
      <div className="background-image"></div>
      
      {/* Animated background elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome Young Coders!</h1>
          <p>Create your account to test your coding skills with fun quizzes, track your progress, and earn awesome certificates!</p>
          
          <div className="hero-divider"></div>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              <span className="btn-emoji">🚀</span>
              Create Account & Start!
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <span className="btn-emoji">🎯</span>
              Already Have Account? Sign In!
            </Link>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="floating-code">
            <div className="code-snippet html-snippet">
              &lt;h1&gt;Hello Coder!&lt;/h1&gt;
            </div>
            <div className="code-snippet python-snippet">
              print("Let's Play!")
            </div>
            <div className="code-snippet scratch-snippet">
              when <span className="flag">⚑</span> clicked
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${index === activeFeature ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Interactive code playground */}
      <section className="interactive-demo">
        <h2>Try It Out!</h2>
        <div className="code-playground">
          <div className="code-output">
            <div id="output-text">Hello, Coder!</div>
          </div>
          <div className="code-buttons">
            <button className="code-btn" onClick={() => document.getElementById('output-text').textContent = "Hello, Coder!"}>
              HTML
            </button>
            <button className="code-btn" onClick={() => document.getElementById('output-text').textContent = "print('Hello, Coder!')"}>
              Python
            </button>
            <button className="code-btn" onClick={() => document.getElementById('output-text').textContent = "when ⚑ clicked"}>
              Scratch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;