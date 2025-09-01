import axios from 'axios';
import useAuthStore from '../store/authStore';

// 백엔드 API의 기본 URL
const API = axios.create({baseURL: 'http://localhost:3001'});

// 인터셉터 설정
API.interceptors.request.use((req) => {
  const token = useAuthStore.getState().token;
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// User API 요청 
export const signIn = (formData) => API.post('/api/users/login', formData);
export const signUp = (formData) => API.post('/api/users/register', formData);

// Budget API 요청
export const fetchBudgets = () => API.get('/api/budgets');
export const createBudget = (newBudget) => API.post('/api/budgets', newBudget);
export const updateBudget = (id, updatedBudget) => API.put(`/api/budgets/${id}`, updatedBudget);
export const deleteBudget = (id) => API.delete(`/api/budgets/${id}`);

export default API;
