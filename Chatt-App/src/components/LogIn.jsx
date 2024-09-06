import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styling/Forms.css'

const LogIn = () => {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const { logIn } = useAuth(); // Get the logIn function from context
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

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

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);


  // Function to handle form submission
  const handleLogIn = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const csrfToken = await getCsrfToken(); // Fetch CSRF token
      console.log('Csrf Token:', csrfToken); // Log the CSRF token for debugging

      // Make a POST request to generate the authentication token
      const response = await axios.post('https://chatify-api.up.railway.app/auth/token', {
        username,
        password,
      }, {
        headers: { 'X-Csrf-Token': csrfToken }, // Set CSRF token in headers
      });

      // Extract token and user details from response
      const { token, id, email, avatar } = response.data;
      logIn(token, { id, username, email, avatar }); // Pass token and user data to logIn
      
      // Save token and user details in localStorage
      console.log('Token:', token);
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify({ id, username, email, avatar }));
 

      // Redirect to the chat page upon successful login
      navigate('/chat');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Show specific error message from the API
        console.error('API Error:', error.response.data.message);
        setError('Invalid credentials'); // Display generic error message for invalid credentials
      } else {
        // Handle other errors
        console.error('Log in failed:', error);
        setError('Log in failed, please try again'); // Set generic error message for login failure
      }
  }
  };

    // Function to handle the click event
    const handleBackClick = () => {
      navigate('/');
    }
     const handleMainpageClick = () => {
      navigate('/register'); 
    }

  return (

    <div className='formContent'>

    <div className='backToMain'> 
    <h2>User log in</h2><button id='backToMainBtn' onClick={handleBackClick} style={{ cursor: 'pointer' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="30" fill="black" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
    <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
  </svg>
</button>
          </div>
<div className="login-container">

{successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleLogIn}>
      <div id='form-field'>
          <label htmlFor="username">Username:</label>
          <input 
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username" // Added autocomplete attribute
          />
        </div>
        <div id='form-field'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Added autocomplete attribute
          />
        </div>
        <div> 
        {error && <div className="error-message">
          <svg id='errorEmoji' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>{error}</div>} {/* Show error message if any */}
          </div>

          <div className='redirect-content'> 
        <p>Don't have an account?<button id='redirectBtn' onClick={handleMainpageClick} style={{ cursor: 'pointer' }}>
          Register here</button></p>
          </div>

        <button id='login-btn' type="submit">Log in</button> {/* Submit button */}
      </form>
    </div></div>
  );
};

export default LogIn;
