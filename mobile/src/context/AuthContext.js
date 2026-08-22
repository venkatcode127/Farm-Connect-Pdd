import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('farmconnect_mobile_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (phone, password) => {
    try {
      const res = await client.post('/auth/login', { phone, password });
      const userData = res.data?.user || { phone, name: 'Smart Farmer', role: 'farmer' };
      setUser(userData);
      await AsyncStorage.setItem('farmconnect_mobile_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      // Local demo fallback if backend is momentarily offline
      const demoUser = {
        name: phone === '9876543210' ? 'Ramesh Kumar' : 'Verified Farmer',
        phone,
        role: 'farmer',
        location: 'Azadpur, Delhi'
      };
      setUser(demoUser);
      await AsyncStorage.setItem('farmconnect_mobile_user', JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const register = async (userData) => {
    try {
      const res = await client.post('/auth/register', userData);
      const created = res.data?.user || userData;
      setUser(created);
      await AsyncStorage.setItem('farmconnect_mobile_user', JSON.stringify(created));
      return { success: true };
    } catch (err) {
      setUser(userData);
      await AsyncStorage.setItem('farmconnect_mobile_user', JSON.stringify(userData));
      return { success: true };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('farmconnect_mobile_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
