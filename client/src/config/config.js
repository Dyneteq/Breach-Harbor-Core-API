const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';
const clientBaseUrl = process.env.REACT_APP_CLIENT_BASE_URL || 'http://localhost:3000';


const config = {
  apiBaseUrl,
  clientBaseUrl,
};

export default config;