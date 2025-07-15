import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
  };
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };
  useEffect(() => {
    api.post('/auth/refresh')
      .then(({ data }) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}