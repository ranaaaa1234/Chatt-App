
import Register from './Register/Register.jsx'
import Login from './Login/Login.jsx'
import Chat from './Chat/Chat.jsx'
import SideNav from './SideNav/SideNav.jsx'
import UserInfo from './Login/UserInfo.jsx'
import Header from './Header/Header.jsx'
import './App.css'
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
        <Register />
        <Header />
        <Login />
        <Chat />
        <UserInfo />
        <SideNav />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        {/* Lägg till andra rutter här */}
      </Routes>
    

    </>
  )
}

export default App
