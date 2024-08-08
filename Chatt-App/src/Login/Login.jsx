
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/chat');
    }
  }, [navigate]);

  const getCSRFToken = async () => {
    try {
      const response = await axios.patch('https://chatify-api.up.railway.app/csrf', {});
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token', error);
      throw new Error('Failed to fetch CSRF token');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = await getCSRFToken();
      
      const response = await axios.post('https://chatify-api.up.railway.app/auth/token', {
        username,
        password,
      }, {
        headers: {
          'X-CSRF-Token': csrfToken,
        }
      });

      const { token, id, avatar } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, username, avatar }));

      setError('');
      navigate('/chat');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError('Invalid credentials');
      } else {
        setError('Log in failed');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button id='login-btn' type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
