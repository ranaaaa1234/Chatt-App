import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setAvatar(user.avatar);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://chatify-api.up.railway.app/user', {
        username,
        email,
        avatar
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), username, email, avatar }));
    } catch (error) {
      setError('Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://chatify-api.up.railway.app/users/${JSON.parse(localStorage.getItem('user')).id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.clear();
      navigate('/');
    } catch (error) {
      setError('Delete failed');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Avatar URL:</label>
        <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        <button type="submit">Update</button>
        {error && <div className="error">{error}</div>}
      </form>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Profile;
