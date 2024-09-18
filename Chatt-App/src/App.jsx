import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Chat from './components/Chat';
import SideNav from './components/SideNav';
import MainPage from './components/MainPage';
import './index.css';

import { useAuth } from './components/AuthContext';

const App = () => {
  const { isAuthenticated } = useAuth(); // Access the authentication status
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <>
      {/* Only render SideNav if the user is authenticated */}
      {isAuthenticated && <SideNav />}

      <Routes>
        {/* First page shows only the buttons to navigate to Login or Register */}
        <Route path="/" element={<MainPage />} />

        {/* Dedicated routes for Login and Register */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        {/* Other routes <Route path="/profile" element={<Profile />} /> */}
        <Route path="/chat" element={<Chat />} />
        
      </Routes>
    </>
  );
};

export default App;
