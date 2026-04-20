import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isManager = () => user?.role === 'MANAGER';
  const isMember = () => user?.role === 'MEMBER';
  const canPlaceOrder = () => user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canCancelOrder = () => user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canManagePayment = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, logout,
      isAdmin, isManager, isMember,
      canPlaceOrder, canCancelOrder, canManagePayment
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
