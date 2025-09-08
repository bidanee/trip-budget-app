import React, { useEffect } from 'react'; // useEffect를 import 합니다.
import useAuthStore from './store/authStore';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { Route, Routes } from 'react-router-dom'
import BudgetDetail from './components/BudgetDetail'

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {}, [isAuthenticated]);

  return (
    <Routes>
      {isAuthenticated ? (
        <>
        {/* 로그인 했을 때 보여줄 페이지 */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/budget/:id" element={<BudgetDetail />} />
        </>
      ) : (
        <>
        {/* 로그인 안 했을 때 보여줄 페이지 */}
        <Route path="*" element={<Auth />} />
        </>
      )}
    </Routes>
  );
};

export default App;

