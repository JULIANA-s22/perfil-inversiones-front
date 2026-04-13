import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

import { authService } from '../services/api';

const renderLogin = () =>
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza el formulario de login', () => {
    renderLogin();
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('muestra el link a registro', () => {
    renderLogin();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('permite escribir correo y contraseña', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Ingrese su email') as HTMLInputElement;
    const passInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('test@gmail.com');
    expect(passInput.value).toBe('123456');
  });

  it('llama a login al enviar el formulario', async () => {
    const fakeToken = 'h.' + btoa(JSON.stringify({ usuarioId: '1' })) + '.s';
    vi.mocked(authService.login).mockResolvedValue({
      tokenAcceso: fakeToken,
      tokenRefresco: 'r',
      expiraEnSegundos: 900,
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Ingrese su email'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        correo: 'test@gmail.com',
        contrasena: '123456',
      });
    });
  });

  it('muestra error cuando login falla', async () => {
    vi.mocked(authService.login).mockRejectedValue({
      response: { data: { mensaje: 'Credenciales incorrectas' } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Ingrese su email'), { target: { value: 'bad@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });
  });

  it('muestra el branding de Proyección', () => {
    renderLogin();
    expect(screen.getByText('Proyección')).toBeInTheDocument();
  });
});
