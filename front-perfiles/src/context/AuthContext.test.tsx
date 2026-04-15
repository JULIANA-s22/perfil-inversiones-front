import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';


const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../services/api', () => ({
  authService: {
    login: (...args: any[]) => mockLogin(...args),
    register: (...args: any[]) => mockRegister(...args),
  },
}));


const TestComponent = () => {
  const { isAuthenticated, nombre, userId, login, register, logout, error, loading } = useAuth();

  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'autenticado' : 'no-autenticado'}</span>
      <span data-testid="nombre">{nombre ?? 'sin-nombre'}</span>
      <span data-testid="userId">{userId ?? 'sin-id'}</span>
      <span data-testid="error">{error ?? 'sin-error'}</span>
      <span data-testid="loading">{loading ? 'cargando' : 'listo'}</span>
      <button onClick={() => login({ correo: 'test@mail.com', contrasena: '123' })}>Login</button>
      <button onClick={() => register({ nombreCompleto: 'Juan', correo: 'j@mail.com', contrasena: '123' })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );


beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('AuthContext', () => {
  it('inicia sin autenticación', () => {
    renderWithProvider();

    expect(screen.getByTestId('auth')).toHaveTextContent('no-autenticado');
    expect(screen.getByTestId('nombre')).toHaveTextContent('sin-nombre');
    expect(screen.getByTestId('error')).toHaveTextContent('sin-error');
  });

  it('renderiza componente de prueba correctamente', () => {
    renderWithProvider();

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('login es llamado cuando se hace clic en botón', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ tokenAcceso: 'test-token', tokenRefresco: 'ref', expiraEnSegundos: 900 });

    renderWithProvider();
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ correo: 'test@mail.com', contrasena: '123' });
    });
  });

  it('register es llamado cuando se hace clic en botón', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValueOnce({ tokenAcceso: 'test-token', tokenRefresco: 'ref', expiraEnSegundos: 900 });

    renderWithProvider();
    await user.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ nombreCompleto: 'Juan', correo: 'j@mail.com', contrasena: '123' });
    });
  });
});
