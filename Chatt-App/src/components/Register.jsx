import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styling/Forms.css'
import getCsrfToken from '../getCsrfToken';


const Register = () => {
  // State hooks for form inputs and error message
  const [username, setUsername] = useState(''); // Username input
  const [password, setPassword] = useState(''); // Password input
  const [email, setEmail] = useState(''); // Email input
  const [error, setError] = useState(''); // Error message display
  const navigate = useNavigate(); // Hook to navigate to other routes

  // Function to fetch CSRF token from the server
  const getCsrfToken = async () => {
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
      const csrfToken = await getCsrfToken(); // Fetch CSRF token

      // Make a POST request to register the user
      await axios.post('https://chatify-api.up.railway.app/auth/register', {
        username,
        password,
        email,
      }, {
        headers: { 'X-Csrf-Token': csrfToken }, // Set CSRF token in headers
      });

      // Success message 
      navigate('/login', { state: {successMessage: 'Registartion successful! Please log in.'}});

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Show specific error message from the API
        console.error('API Error:', error.response.data.message);
        setError(error.response.data.message); // Set error message to display
      } else {
        // Handle other errors
        console.error('Registration failed:', error);
        setError('Username or email already exists'); // Set generic error message to display
      }

      setSuccessMessage('');
    }

  };

     // Function to handle the click event
     const handleMainpageClick = () => {
      navigate('/login'); // Navigate to the main page when the button is clicked
    }

      // Function to handle the click event
      const handleBackClick = () => {
        navigate('/'); // Navigate to the main page when the button is clicked
      }
  

  return (

    <div className='formContent'>

<div className='backToMain'> 
    <h2>Register user</h2><button id='backToMainBtn' onClick={handleBackClick} style={{ cursor: 'pointer' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" fill="black" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
  </svg>
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
        </svg>
            {error}
        </div>} 

        <div className='redirect-content'> 
        <p >Already have an account?<button id='redirectBtn' onClick={handleMainpageClick} style={{ cursor: 'pointer' }}>
          Log in here</button></p>
          </div>


        <button id='register-btn' type="submit">Register</button> {/* Submit button */}
      </form>
    </div></div>
  );
};

export default Register;
