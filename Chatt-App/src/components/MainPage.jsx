import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <h2>Welcome to ChatApp</h2>
      <div className="selection-container">
        <button id='mainBtn' onClick={() => navigate('/login')}>Log In</button>
        <button id='mainBtn' onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
};

export default MainPage;
