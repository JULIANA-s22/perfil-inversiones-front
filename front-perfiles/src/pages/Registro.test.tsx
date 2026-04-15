import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from './Registro';


const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
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

const renderRegistro = () =>
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  );


beforeEach(() => {
  vi.clearAllMocks();
});

describe('Registro', () => {
  it('renderiza el formulario de registro', () => {
    renderRegistro();

    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su nombre completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('envía datos de registro y navega al dashboard', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValueOnce(undefined);
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Ingrese su nombre completo'), 'María López');
    await user.type(screen.getByPlaceholderText('Ingrese su email'), 'maria@mail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'secure123');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nombreCompleto: 'María López',
        correo: 'maria@mail.com',
        contrasena: 'secure123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    });
  });

  it('no navega si registro falla', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValueOnce(new Error('Email ya registrado'));
    renderRegistro();

    await user.type(screen.getByPlaceholderText('Ingrese su nombre completo'), 'Test');
    await user.type(screen.getByPlaceholderText('Ingrese su email'), 'dup@mail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '123456');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('link a login apunta a /login', () => {
    renderRegistro();
    const link = screen.getByText('Iniciar sesión');
    expect(link).toHaveAttribute('href', '/login');
  });
});
