import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Registro from '../pages/Registro';

vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

import { authService } from '../services/api';

const renderRegistro = () =>
  render(
    <AuthProvider>
      <BrowserRouter>
        <Registro />
      </BrowserRouter>
    </AuthProvider>
  );

describe('Registro', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza el formulario de registro', () => {
    renderRegistro();
    expect(screen.getByText('Crea tu cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su nombre completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('muestra el link a login', () => {
    renderRegistro();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('permite escribir nombre, correo y contraseña', () => {
    renderRegistro();
    const nombreInput = screen.getByPlaceholderText('Ingrese su nombre completo') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Ingrese su email') as HTMLInputElement;
    const passInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: 'Juan Perez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@gmail.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });

    expect(nombreInput.value).toBe('Juan Perez');
    expect(emailInput.value).toBe('juan@gmail.com');
    expect(passInput.value).toBe('123456');
  });

  it('llama a register al enviar el formulario', async () => {
    const fakeToken = 'h.' + btoa(JSON.stringify({ usuarioId: '1' })) + '.s';
    vi.mocked(authService.register).mockResolvedValue({
      tokenAcceso: fakeToken,
      tokenRefresco: 'r',
      expiraEnSegundos: 900,
    });

    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingrese su nombre completo'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese su email'), { target: { value: 'juan@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        nombreCompleto: 'Juan',
        correo: 'juan@gmail.com',
        contrasena: '123456',
      });
    });
  });

  it('muestra error cuando registro falla', async () => {
    vi.mocked(authService.register).mockRejectedValue({
      response: { data: { mensaje: 'El correo ya existe' } },
    });

    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingrese su nombre completo'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('Ingrese su email'), { target: { value: 'existe@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('El correo ya existe')).toBeInTheDocument();
    });
  });
});
