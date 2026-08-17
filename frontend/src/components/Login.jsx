import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import AuthLayout from './AuthLayout';

function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(phone, password);
      onLogin(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <AuthLayout>
      <div id="loginForm" className="auth-form">
        <h3>Welcome Back 👋</h3>
        <p className="auth-form-desc">Login to access your dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📱 Mobile Number</label>
            <div className="phone-input">
              <span className="phone-prefix">+91</span>
              <input 
                type="tel" 
                id="loginPhone" 
                className="text-input" 
                placeholder="Enter 10-digit number" 
                maxLength="10" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>🔒 Password</label>
            <a href="#" id="showForgot" style={{ fontSize: '0.8rem', color: 'var(--primary-glow)', textDecoration: 'none', fontWeight: '600' }}>Forgot Password?</a>
          </div>
          <input 
            type="password" 
            id="loginPassword" 
            className="text-input" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ marginBottom: '16px' }}
          />
          {error && <div className="auth-error" style={{ display: 'block', marginBottom: '10px' }}>{error}</div>}
          <button type="submit" className="btn-primary btn-full" id="loginBtn">🚀 Login</button>
        </form>
        <p className="auth-switch">New user? <Link to="/register" id="showRegister">Create an account</Link></p>
      </div>
    </AuthLayout>
  );
}

export default Login;
