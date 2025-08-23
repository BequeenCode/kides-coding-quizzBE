// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, setUser, loading }) => {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <header className="header" style={headerStyle}>
      <div className="container" style={containerStyle}>
        <Link to="/" className="logo" style={logoStyle}>
          <div style={logoContentStyle}>
            <span style={iconStyle}>🚀</span>
            <h1 style={h1Style}>Kids Coding Quiz</h1>
          </div>
        </Link>
        <nav className="nav" style={navStyle}>
          {user ? (
            <>
              <span style={welcomeStyle}>Welcome, {user.name}!</span>
              <button 
                onClick={handleLogout} 
                style={{...btnStyle, ...btnOutlineStyle}}
                className="btn btn-outline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{...btnStyle, ...btnOutlineStyle}}
                className="btn btn-outline"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{...btnStyle, ...btnPrimaryStyle}}
                className="btn btn-primary"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
      
      {/* Inline styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Comic+Neue:wght@400;700&display=swap');
          
          .header {
            font-family: 'Comic Neue', cursive;
          }
          
          .btn {
            transition: all 0.3s ease;
          }
          
          .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </header>
  );
};

// Styles
const headerStyle = {
  background: 'linear-gradient(135deg, #6a5acd 0%, #4ecdc4 100%)',
  padding: '1rem 0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderBottom: '5px solid #ff6b6b'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem'
};

const logoStyle = {
  textDecoration: 'none'
};

const logoContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const iconStyle = {
  fontSize: '2.5rem'
};

const h1Style = {
  fontFamily: "'Fredoka One', cursive",
  color: '#fff',
  fontSize: '2rem',
  textShadow: '3px 3px 0 #ff6b6b',
  margin: 0,
  letterSpacing: '1px'
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const welcomeStyle = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.1rem'
};

const btnStyle = {
  padding: '0.5rem 1.5rem',
  borderRadius: '50px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  border: '3px solid transparent',
  fontFamily: "'Comic Neue', cursive"
};

const btnOutlineStyle = {
  background: 'transparent',
  borderColor: '#ffe66d',
  color: '#ffe66d'
};

const btnPrimaryStyle = {
  background: '#ff6b6b',
  color: 'white',
  borderColor: '#ff6b6b'
};

export default Header;