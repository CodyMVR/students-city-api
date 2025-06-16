import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken } from '../services/auth';
import { getRolesFromToken } from '../utils/jwt';

interface AuthContextProps {
  loggedIn: boolean;
  isAdmin: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        const roles = getRolesFromToken(token);
        setLoggedIn(true);
        setIsAdmin(roles.includes('ROLE_ADMIN'));
      } else {
        setLoggedIn(false);
        setIsAdmin(false);
      }
    })();
  }, []);

  const logout = async () => {
    await removeToken();
    setLoggedIn(false);
    setIsAdmin(false);
  };

  if (loggedIn === null) return null;

  return (
    <AuthContext.Provider value={{ loggedIn, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
