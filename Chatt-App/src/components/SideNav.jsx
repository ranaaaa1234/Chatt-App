import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SideNav = () => {
  const { isAuthenticated, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut(); // Clear authentication state in AuthContext
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="side-nav">
      {isAuthenticated && (
        <button onClick={handleLogout}>Logout</button> // Show logout button only if authenticated
      )}
    </nav>
  );
};

export default SideNav;
