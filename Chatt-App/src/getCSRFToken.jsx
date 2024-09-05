
import axios from 'axios';

const getCsrfToken = async () => {
  try {
    const response = await axios.patch('https://chatify-api.up.railway.app/csrf', {}, { withCredentials: true });
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

export default getCsrfToken;