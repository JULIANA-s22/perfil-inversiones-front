import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

vi.mock('../services/api', () => ({
  authService: { login: vi.fn(), register: vi.fn() },
  historialService: { obtener: vi.fn().mockResolvedValue([]) },
  chatbotService: { listarConversaciones: vi.fn().mockResolvedValue([]) },
}));

const RutaProtegida = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

describe('Ruta protegida', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirige a /login sin token', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/app" element={<RutaProtegida><div>Dashboard</div></RutaProtegida>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('permite acceso con token', () => {
    const fakeToken = 'h.' + btoa(JSON.stringify({ usuarioId: '1', sub: 'test@test.com' })) + '.s';
    localStorage.setItem('token', fakeToken);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/app" element={<RutaProtegida><div>Dashboard</div></RutaProtegida>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('sin token no puede ver el dashboard', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/app" element={<RutaProtegida><div>Dashboard</div></RutaProtegida>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
