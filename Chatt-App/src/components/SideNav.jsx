import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styling/SideNav.css';
import getCSRFToken from '../getCSRFToken';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage whether the side navigation is open or closed
  const [user, setUser] = useState(null); // State to store user information
  const { logOut } = useAuth(); // Destructuring logOut function from useAuth to handle user logout
  const navigate = useNavigate(); // Hook to navigate to different routes

  useEffect(() => {
    // Runs when the component is mounted (similar to componentDidMount)
    const storedUser = localStorage.getItem('user'); // Get the user info from localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user info if available
    }
  }, []); // Empty dependency array means this effect runs only once
  console.log('User from localStorage:', user); // Log the user info for debugging

  const toggleSideNav = () => {
    setIsOpen(!isOpen); // Toggle the state of isOpen when the button is clicked
  };

  const handleLogout = async () => {
    await getCSRFToken(); // Call the function to get the CSRF token before logging out
    logOut(); // Call the logout function from useAuth to log out the user
    localStorage.clear(); // Clear all data from localStorage
    navigate('/'); // Redirect the user to the homepage after logout
  };

  return (
    <>
      <button className="profile-btn" onClick={toggleSideNav}>
        Profile
      </button> {/* Button to open/close the side navigation */}

      <nav className={`side-nav ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSideNav}>
          &times;
        </button> {/* Button to close the side navigation */}

        {/* Display user information if available */}
        {user && (
          <div className="user-info">
            <img src={user.avatar || 'https://i.pravatar.cc/200'} alt="User Avatar" className="avatar" />
            {/* Display the user's avatar, or a default one if not available */}
            
            <div className='username-text'> 
            <p>Welcome to ChatApp <svg xmlns="http://www.w3.org/2000/svg" width="17" height="29" fill="white" className="bi bi-chat-dots" viewBox="0 0 16 16">
        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
        </svg></p> 
        <p>{user.username}</p> {/* Display the username */}
        <p>{user.email}</p> {/* Display the email */}
            </div>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> {/* Button to log out the user */}
      </nav>
    </>
  );
};

export default SideNav; // Export the SideNav component for use in other parts of the app
