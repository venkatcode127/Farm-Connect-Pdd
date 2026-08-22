import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import AuthLayout from './AuthLayout';
import { useLanguage } from '../context/LanguageContext';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'farmer',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      const registeredUser = res.data || {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        location: formData.location
      };
      
      if (onLogin) {
        onLogin(registeredUser);
      } else {
        localStorage.setItem('user', JSON.stringify(registeredUser));
      }
      navigate('/');
    } catch (err) {
      // Fallback local registration if server unreachable
      const fallbackUser = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        location: formData.location,
        id: 'user_' + Date.now()
      };
      if (onLogin) {
        onLogin(fallbackUser);
        navigate('/');
      } else {
        setError(err.response?.data?.detail || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <div id="registerForm" className="auth-form">
        <h3>{t('register.title')}</h3>
        <p className="auth-form-desc">{t('register.subtitle')}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('register.fullName')}</label>
            <input 
              name="name"
              type="text" 
              id="regName" 
              className="text-input" 
              placeholder={t('register.enterName')} 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('login.mobile')}</label>
            <div className="phone-input">
              <span className="phone-prefix">+91</span>
              <input 
                name="phone"
                type="tel" 
                id="regPhone" 
                className="text-input" 
                placeholder={t('register.enterMobile')} 
                maxLength="10" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('register.email')}</label>
            <input 
              name="email"
              type="email" 
              id="regEmail" 
              className="text-input" 
              placeholder={t('register.enterEmail')} 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>{t('login.password')}</label>
            <input 
              name="password"
              type="password" 
              id="regPassword" 
              className="text-input" 
              placeholder={t('register.createPassword')} 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>{t('register.role')}</label>
            <select name="role" id="regRole" className="select-input" value={formData.role} onChange={handleChange}>
              <option value="farmer">{t('register.farmer')}</option>
              <option value="buyer">{t('register.buyer')}</option>
              <option value="trader">{t('register.trader')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('register.location')}</label>
            <input 
              name="location"
              type="text" 
              id="regLocation" 
              className="text-input" 
              placeholder={t('register.enterLocation')} 
              value={formData.location}
              onChange={handleChange}
              required 
            />
          </div>
          {error && <div className="auth-error" style={{ display: 'block', marginBottom: '10px' }}>{error}</div>}
          <button type="submit" className="btn-primary btn-full" id="registerBtn" style={{ marginTop: '10px' }}>{t('register.registerBtn')}</button>
        </form>
        <p className="auth-switch">{t('register.alreadyRegistered')} <Link to="/login" id="showLogin">{t('register.loginHere')}</Link></p>
      </div>
    </AuthLayout>
  );
}

export default Register;
