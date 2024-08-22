import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styling/SideNav.css';
import getCSRFToken from '../getCSRFToken';


const SideNav = () => {
  // Initialize state to track whether the side navigation is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the logOut function from the authentication context
  const { logOut } = useAuth();
  
  // Initialize useNavigate to navigate between routes programmatically
  const navigate = useNavigate();

  // Function to toggle the visibility of the side navigation
  const toggleSideNav = () => {
    setIsOpen(!isOpen); // Toggle the isOpen state between true and false
  };

  // Function to handle the logout process
  const handleLogout = async () => {
    await getCSRFToken(); // Fetch CSRF token before logging out (ensures security)
    logOut(); // Clear authentication state in the AuthContext
    localStorage.clear(); // Clear any stored tokens in localStorage
    navigate('/'); // Redirect user to the login page
  };

  return (
    <>
      {/* Button to open the side navigation; clicking it toggles the isOpen state */}
      <button className="profile-btn" onClick={toggleSideNav}>
        Profile
      </button>

      {/* The side navigation; it will be visible if isOpen is true */}
      <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
        {/* Button to close the side navigation; toggles the isOpen state */}
        <button className="close-btn" onClick={toggleSideNav}>
          &times;
        </button>

        {/* Logout button; clicking it triggers the handleLogout function */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </>
  );
};

export default SideNav;
