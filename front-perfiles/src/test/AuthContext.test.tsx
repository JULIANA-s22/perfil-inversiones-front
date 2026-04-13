import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

import { authService } from '../services/api';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicia sin autenticación', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
  });

  it('login exitoso guarda token y extrae userId', async () => {
    const fakeToken = 'header.' + btoa(JSON.stringify({ usuarioId: 'abc-123', sub: 'test@gmail.com' })) + '.sig';

    vi.mocked(authService.login).mockResolvedValue({
      tokenAcceso: fakeToken,
      tokenRefresco: 'refresh',
      expiraEnSegundos: 900,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ correo: 'test@gmail.com', contrasena: '123456' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(fakeToken);
    expect(result.current.userId).toBe('abc-123');
    expect(localStorage.getItem('token')).toBe(fakeToken);
  });

  it('login fallido muestra error', async () => {
    vi.mocked(authService.login).mockRejectedValue({
      response: { data: { mensaje: 'Credenciales incorrectas' } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login({ correo: 'bad@gmail.com', contrasena: 'wrong' });
      } catch {
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Credenciales incorrectas');
  });

  it('registro exitoso guarda token', async () => {
    const fakeToken = 'header.' + btoa(JSON.stringify({ usuarioId: 'new-123', sub: 'new@gmail.com' })) + '.sig';

    vi.mocked(authService.register).mockResolvedValue({
      tokenAcceso: fakeToken,
      tokenRefresco: 'refresh',
      expiraEnSegundos: 900,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({ nombreCompleto: 'Nuevo', correo: 'new@gmail.com', contrasena: '123456' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userId).toBe('new-123');
  });

  it('logout limpia el token', async () => {
    const fakeToken = 'header.' + btoa(JSON.stringify({ usuarioId: 'abc-123' })) + '.sig';

    vi.mocked(authService.login).mockResolvedValue({
      tokenAcceso: fakeToken,
      tokenRefresco: 'refresh',
      expiraEnSegundos: 900,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ correo: 'test@gmail.com', contrasena: '123456' });
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('useAuth fuera de AuthProvider lanza error', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth debe usarse dentro de AuthProvider');
  });
});
