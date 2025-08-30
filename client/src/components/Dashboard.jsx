import React from 'react'
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  }

  return (
    <div>
    <h1>로그인 성공! 대시보드에 오신 것을 환영합니다.</h1>
    <button onClick={handleLogout}>로그아웃</button>
    </div>
  )
}

export default Dashboard