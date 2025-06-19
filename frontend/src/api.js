import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://shikshahub-community-backend.onrender.com/api',
  // You can add headers or interceptors here if needed
});

export default api; 