import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-kmtrack-final.vercel.app',
});

export default api;