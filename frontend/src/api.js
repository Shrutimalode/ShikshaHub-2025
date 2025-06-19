import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shikshahub-community-backend.onrender.com',
  // You can add headers or interceptors here if needed
});

export default api; 