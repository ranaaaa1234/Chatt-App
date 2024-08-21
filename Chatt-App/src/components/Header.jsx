import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleTitleClick = () => {
    navigate('/'); // Navigate to the main page when h1 is clicked
  };

  return (
    <header>
      <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
        ChatApp
      </h1>
    </header>
  );
};

export default Header;
