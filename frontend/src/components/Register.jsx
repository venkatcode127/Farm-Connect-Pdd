import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import AuthLayout from './AuthLayout';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'farmer',
    location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <AuthLayout>
      <div id="registerForm" className="auth-form">
        <h3>Create Account 🌱</h3>
        <p className="auth-form-desc">Join thousands of smart farmers</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Full Name</label>
            <input 
              name="name"
              type="text" 
              id="regName" 
              className="text-input" 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>📱 Mobile Number</label>
            <div className="phone-input">
              <span className="phone-prefix">+91</span>
              <input 
                name="phone"
                type="tel" 
                id="regPhone" 
                className="text-input" 
                placeholder="Enter 10-digit valid Indian number" 
                maxLength="10" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>📧 Email (Optional)</label>
            <input 
              name="email"
              type="email" 
              id="regEmail" 
              className="text-input" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>🔒 Password</label>
            <input 
              name="password"
              type="password" 
              id="regPassword" 
              className="text-input" 
              placeholder="Create a password (min 4 chars)" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>🧑‍🌾 Role</label>
            <select name="role" id="regRole" className="select-input" value={formData.role} onChange={handleChange}>
              <option value="farmer">Farmer / కిసాన్</option>
              <option value="buyer">Buyer / கொள்முதல்</option>
              <option value="trader">Trader / వ్యాపారి</option>
            </select>
          </div>
          <div className="form-group">
            <label>📍 Location</label>
            <input 
              name="location"
              type="text" 
              id="regLocation" 
              className="text-input" 
              placeholder="Village/City, State" 
              value={formData.location}
              onChange={handleChange}
              required 
            />
          </div>
          {error && <div className="auth-error" style={{ display: 'block', marginBottom: '10px' }}>{error}</div>}
          <button type="submit" className="btn-primary btn-full" id="registerBtn" style={{ marginTop: '10px' }}>✅ Register & Login</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login" id="showLogin">Login here</Link></p>
      </div>
    </AuthLayout>
  );
}

export default Register;
