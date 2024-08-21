import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Chat from './components/Chat';
import Profile from './components/Profile';
import Header from './components/Header';
import SideNav from './components/SideNav';
import MainPage from './components/MainPage';
import './index.css';

const App = () => {
  return (
    <>
      <Header />
      <SideNav />

      <Routes>
        {/* First page shows only the buttons to navigate to Login or Register */}
        <Route path="/" element={<MainPage />} />

        {/* Dedicated routes for Login and Register */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />

        {/* Other routes */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
