import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Custom function to decode JWT token
  const decodeJwt = (token) => {
    const payload = token.split('.')[1]; 
    return JSON.parse(atob(payload)); // Decode Base64 payload and parse it to JSON
  };

  useEffect(() => {
    // Kontrollera om JWT-token finns i localStorage och om den är giltig
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = decodeJwt(token); // Decode token
        setUser({
          id: decodedToken.id, 
          username: decodedToken.username,  // Get the username
          email: decodedToken.email,        // Get email
          avatar: decodedToken.avatar       // Get avatar URL or value
        });
        setIsAuthenticated(true); // Set user as authenticated if token exists
      } catch (error) {
        console.error("Ogiltig token:", error);
        logOut(); // Om det är en ogiltig token loggar vi ut användaren
      }
    }
  }, []);

  const logIn = (token) => {
    try {
      const decodedToken = decodeJwt(token); // Decode JWT-token when user logs in
      setUser({
        id: decodedToken.id, 
        username: decodedToken.username,   // Extract username
        email: decodedToken.email,         // Extract email
        avatar: decodedToken.avatar        // Extract avatar URL
      });
      setIsAuthenticated(true);
      localStorage.setItem('jwtToken', token); // Save JWT-token in localStorage
    } catch (error) {
      console.error("Kunde inte decoda token:", error);
    }
  };

  const logOut = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user data
    localStorage.removeItem('jwtToken'); // Remove JWT-token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
