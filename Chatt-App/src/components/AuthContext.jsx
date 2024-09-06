import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kontrollera om JWT-token finns i localStorage och om den är giltig
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true); // Användaren anses inloggad om token finns
    }
  }, []);

  const logIn = (token, user) => {
    setIsAuthenticated(true);
    localStorage.setItem('jwtToken', token); // Spara JWT-token
    localStorage.setItem('user', JSON.stringify(user)); // Spara användarinfo
  };

  const logOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('jwtToken'); // Ta bort JWT-token
    localStorage.removeItem('user'); // Ta bort användarinfo
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
