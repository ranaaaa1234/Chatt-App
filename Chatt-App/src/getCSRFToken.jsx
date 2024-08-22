
import axios from 'axios';

const getCSRFToken = async () => {
  try {
    const response = await axios.patch('https://chatify-api.up.railway.app/csrf', {});
    const csrfToken = response.headers['x-csrf-token'];
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default getCSRFToken;