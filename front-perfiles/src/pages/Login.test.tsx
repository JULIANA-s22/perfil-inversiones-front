import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';



const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    loading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );



beforeEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  it('renderiza el formulario correctamente', () => {
    renderLogin();

    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('envía credenciales y navega al dashboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(undefined);
    renderLogin();

    await user.type(screen.getByPlaceholderText('Ingrese su email'), 'test@mail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        correo: 'test@mail.com',
        contrasena: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    });
  });

  it('no navega si login falla', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce(new Error('fail'));
    renderLogin();

    await user.type(screen.getByPlaceholderText('Ingrese su email'), 'test@mail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong');
    await user.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
