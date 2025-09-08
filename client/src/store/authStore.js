import {create} from 'zustand';

const useAuthStore = create((set) => ({
  //  Store : 상태
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  // Action : 상태 변경 함수
  login: (newToken) => {
    localStorage.setItem('token', newToken);
    //  set : 상태 업데이트
    set({token: newToken, isAuthenticated: true});
  },

  logout: () => {
    localStorage.removeItem('token');
    set({token:null, isAuthenticated: false});
  }
}));

export default useAuthStore;