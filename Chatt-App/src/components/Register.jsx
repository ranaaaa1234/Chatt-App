import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styling/Forms.css'


const Register = () => {
  // State hooks for form inputs and error message
  const [username, setUsername] = useState(''); // Username input
  const [password, setPassword] = useState(''); // Password input
  const [email, setEmail] = useState(''); // Email input
  const [error, setError] = useState(''); // Error message display
  const navigate = useNavigate(); // Hook to navigate to other routes

  // Function to fetch CSRF token from the server
  const getCSRFToken = async () => {
    try {
      // Make a PATCH request to get the CSRF token
      const response = await axios.patch('https://chatify-api.up.railway.app/csrf', {});
      return response.data.csrfToken; // Return the CSRF token from response
    } catch (error) {
      console.error('Failed to fetch CSRF token', error); // Log any errors
      throw new Error('Failed to fetch CSRF token'); // Throw error if fetching fails
    }
  };

  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const csrfToken = await getCSRFToken(); // Fetch CSRF token
      console.log('CSRF Token:', csrfToken); // Log the CSRF token for debugging

      // Make a POST request to register the user
      await axios.post('https://chatify-api.up.railway.app/auth/register', {
        username,
        password,
        email,
      }, {
        headers: { 'X-CSRF-Token': csrfToken }, // Set CSRF token in headers
      });

      // Redirect to the login page after successful registration
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Show specific error message from the API
        console.error('API Error:', error.response.data.message);
        setError(error.response.data.message); // Set error message to display
      } else {
        // Handle other errors
        console.error('Registration failed:', error);
        setError('Registration failed, please try again'); // Set generic error message to display
      }
    }
  };

  return (
<div className="register-container">
      <h2>Register</h2>
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
            autoComplete="username" // Added autocomplete attribute
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
            autoComplete="new-password" // Added autocomplete attribute
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
            autoComplete="email" // Added autocomplete attribute
          />
        </div>
        {error && <div className="error-message">
        <svg id='errorEmoji' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>{error}</div>} {/* Show error message if any */}
        <button id='register-btn' type="submit">Register</button> {/* Submit button */}
      </form>
    </div>
  );
};

export default Register;
