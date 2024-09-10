import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

 
  // Initialize authentication state on load
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
   
    if (token && isTokenValid(token)) {
      const decodedToken = decodeJwt(token);
      setUser({
        id: decodedToken.id,
        username: decodedToken.user,
        email: decodedToken.email,
        avatar: decodedToken.avatar
      });
      setIsAuthenticated(true);
      localStorage.setItem('jwtToken', token);

    }
  }, []);

  // Custom function to decode JWT token
  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1]; // Extract the payload part from JWT token
      const decodedPayload = atob(payload); // Decode Base64
      console.log('Decoded Payload:', decodedPayload); // Log the decoded payload
      return JSON.parse(decodedPayload);    // Parse JSON
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };
  

  // Function to check token validity (based on expiry)
  const isTokenValid = (token) => {
    const decodedToken = decodeJwt(token);
    if (!decodedToken) return false;
    
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp > currentTime; // Token is valid if expiration is in the future
    
  };

  const logIn = (token) => {
    const decodedToken = decodeJwt(token);  // Decode JWT token
    if (decodedToken) {
      setUser({
        id: decodedToken.id,
        username: decodedToken.user,
        email: decodedToken.email,
        avatar: decodedToken.avatar
      });
      setIsAuthenticated(true);
      localStorage.setItem('jwtToken', token); // Store JWT token in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: decodedToken.id,
        username: decodedToken.user,
        email: decodedToken.email,
        avatar: decodedToken.avatar
      }));
    } else {
      console.error("Failed to decode JWT token during login.");
    }
  };

  const logOut = () => {
    setIsAuthenticated(false);              // Update authentication state
    setUser(null);                          // Clear user data
    localStorage.removeItem('jwtToken');    // Remove JWT token from localStorage
    localStorage.removeItem('user');        // Remove user info from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
