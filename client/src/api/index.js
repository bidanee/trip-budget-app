import axios from 'axios';

// 백엔드 API의 기본 URL
const API = axios.create({baseURL: 'http://localhost:3001'});

// 인터셉터 설정
API.interceptors.request.use((req) => {
  if(localStorage.getItem('profile')){
    //사용자 정보 확인, 있으면 토큰 가져와서 요청 헤더에 추가
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
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
