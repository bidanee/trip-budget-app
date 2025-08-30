import React, { useEffect } from 'react'; // useEffect를 import 합니다.
import useAuthStore from './store/authStore';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {}, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? <Dashboard /> : <Auth />}
    </div>
  );
};

export default App;

