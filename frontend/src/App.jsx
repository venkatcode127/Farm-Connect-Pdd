import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import MarketPrices from './pages/MarketPrices';
import Marketplace from './pages/Marketplace';
import Orders from './pages/Orders';
import Weather from './pages/Weather';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const PrivateRoute = ({ children }) => {
    return user ? <MainLayout user={user} onLogout={handleLogout}>{children}</MainLayout> : <Navigate to="/login" />;
  };

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />

          
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
          <Route path="/market" element={<PrivateRoute><MarketPrices /></PrivateRoute>} />
          <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/admin" element={
            user?.role === 'admin' ? <PrivateRoute><Admin /></PrivateRoute> : <Navigate to="/" />
          } />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;

