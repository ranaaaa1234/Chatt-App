import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styling/Forms.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch CSRF token from the server
  const getCsrfToken = async () => {
    try {
      const response = await axios.patch('https://chatify-api.up.railway.app/csrf');
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token', error);
      throw new Error('Failed to fetch CSRF token');
    }
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = await getCsrfToken();

      // Register the user and get the JWT token
      const response = await axios.post('https://chatify-api.up.railway.app/auth/register', {
        username,
        password,
        email,
      }, {
        headers: { 'X-Csrf-Token': csrfToken },
      });

      const { token } = response.data; // Extract JWT token from the response

      // Save token to local storage
      localStorage.setItem('jwtToken', token);

      // Redirect to login page with success message
      navigate('/login', { state: { successMessage: 'Registration successful! Please log in.' } });

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className='formContent'>
      <div className='backToMain'>
        <h2>Register</h2>
        <button id='backToMainBtn' onClick={handleBackClick} style={{ cursor: 'pointer' }}>
          {/* Back icon */}
        </button>
      </div>
      <div className="register-container">
        <form onSubmit={handleRegister}>
          <div id='form-field'>
            <label htmlFor="register-username">Username:</label>
            <input
              type="text"
              id="register-username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div id='form-field'>
            <label htmlFor="register-password">Password:</label>
            <input
              type="password"
              id="register-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div id='form-field'>
            <label htmlFor="register-email">Email:</label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className='redirect-content'>
            <p>Already have an account?<button id='redirectBtn' onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
              Log in here</button></p>
          </div>
          <button id='register-btn' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
