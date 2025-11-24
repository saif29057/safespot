import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';         
import Accueil from './pages/Accueil';
import Dashboard from './pages/Dashboard';
import Destination from './pages/Destination';
import Prediction from './pages/Prediction';
import AdminHome from './pages/AdminHome';
import AdminClients from './pages/AdminClients';
import AdminPrediction from './pages/AdminPrediction';
import SafeSpotLogin from './Login';  

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'client');

  const handleLogin = (name, role = 'client') => {
    setUserName(name);
    setUserRole(role);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('client');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={isLoggedIn ? (
            userRole === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Accueil userName={userName} onLogout={handleLogout} />
            )
          ) : (
            <SafeSpotLogin onLogin={handleLogin} />
          )} 
        />

        {/* Client Routes */}
        <Route 
          path="/acceuil" 
          element={isLoggedIn && userRole === 'client' ? (
            <Accueil userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn && userRole === 'client' ? (
            <Dashboard userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />
        <Route 
          path="/destination" 
          element={isLoggedIn && userRole === 'client' ? (
            <Destination userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />
        <Route 
          path="/prediction" 
          element={isLoggedIn && userRole === 'client' ? (
            <Prediction userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isLoggedIn && userRole === 'admin' ? (
            <AdminHome userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />
        <Route 
          path="/admin/clients" 
          element={isLoggedIn && userRole === 'admin' ? (
            <AdminClients userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />
        <Route 
          path="/admin/prediction" 
          element={isLoggedIn && userRole === 'admin' ? (
            <AdminPrediction userName={userName} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )} 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;