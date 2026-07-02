import axios from 'axios';


const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : 'https://expense-splitter-8fkw.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;