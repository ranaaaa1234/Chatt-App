import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styling/SideNav.css';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logOut, user } = useAuth(); // Get logOut and user from AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    console.log('user:', user); // Add this to debug
  }, [user]);


  const toggleSideNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logOut(); // This will use logOut from AuthContext
    navigate('/'); // Redirect to home after logout
  };

  return (
    <>
      <button className="profile-btn" onClick={toggleSideNav}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </button>

      <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSideNav}>
          &times;
        </button>

        {user && ( // Ensure authUser is present and has username
          <div className="user-info">
            <img src={user.avatar} alt="User Avatar" className="avatar" />
            <div className='username-text'> 
              <p>Welcome to Chatify</p>
              <p>{user.username || 'No Username Available'}</p> {/* Fallback if username is missing */}
              <p>{user.email}</p>
            </div>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </>
  );
};

export default SideNav;
