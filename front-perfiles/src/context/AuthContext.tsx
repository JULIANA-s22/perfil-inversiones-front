import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { authService, type LoginRequest, type RegisterRequest } from '../services/api';

function decodeJwt(token: string): Record<string, any> | null {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  nombre: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;
  const userId = useMemo(() => token ? decodeJwt(token)?.usuarioId || null : null, [token]);
  const nombre = useMemo(() => {
    if (!token) return null;
    const payload = decodeJwt(token);
    return payload?.nombreCompleto || payload?.nombre || payload?.name || payload?.sub || null;
  }, [token]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = async (data: LoginRequest) => {
    setLoading(true); setError(null);
    try { setToken((await authService.login(data)).tokenAcceso); }
    catch (err: any) { setError(err.response?.data?.mensaje || 'Credenciales incorrectas'); throw err; }
    finally { setLoading(false); }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true); setError(null);
    try { setToken((await authService.register(data)).tokenAcceso); }
    catch (err: any) { setError(err.response?.data?.mensaje || 'Error al crear la cuenta'); throw err; }
    finally { setLoading(false); }
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, userId, nombre, isAuthenticated, login, register, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
