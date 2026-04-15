import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authService, simulacionService, historialService, chatbotService } from './api';

vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return {
    default: { create: vi.fn(() => instance) },
    ...instance,
  };
});

const api = axios.create() as any;

beforeEach(() => {
  vi.clearAllMocks();
});


describe('authService', () => {
  it('login envía credenciales y retorna tokens', async () => {
    const mockResponse = {
      data: { tokenAcceso: 'abc123', tokenRefresco: 'ref456', expiraEnSegundos: 900 },
    };
    api.post.mockResolvedValueOnce(mockResponse);

    const result = await authService.login({ correo: 'test@mail.com', contrasena: '123456' });

    expect(api.post).toHaveBeenCalledWith('/api/autenticacion/inicio-sesion', {
      correo: 'test@mail.com',
      contrasena: '123456',
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('register envía datos y retorna tokens', async () => {
    const mockResponse = {
      data: { tokenAcceso: 'abc', tokenRefresco: 'ref', expiraEnSegundos: 900 },
    };
    api.post.mockResolvedValueOnce(mockResponse);

    const result = await authService.register({
      nombreCompleto: 'Juan Pérez',
      correo: 'juan@mail.com',
      contrasena: 'pass123',
    });

    expect(api.post).toHaveBeenCalledWith('/api/autenticacion/registro', {
      nombreCompleto: 'Juan Pérez',
      correo: 'juan@mail.com',
      contrasena: 'pass123',
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('login propaga error del servidor', async () => {
    api.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(
      authService.login({ correo: 'x@x.com', contrasena: 'bad' })
    ).rejects.toThrow('Network Error');
  });
});


describe('simulacionService', () => {
  it('simula sin enviar correo por defecto', async () => {
    const mockData = {
      data: {
        capitalActual: 60000000,
        aporteMensual: 1800000,
        tiempoAnios: 25,
        conservador: { nombre: 'Conservador', valorFuturo: 213619805 },
        moderado: { nombre: 'Moderado', valorFuturo: 251696029 },
        agresivo: { nombre: 'Agresivo', valorFuturo: 298157677 },
      },
    };
    api.post.mockResolvedValueOnce(mockData);

    const result = await simulacionService.simular({
      capitalActual: 60000000,
      aporteMensual: 1800000,
      tiempoAnios: 25,
    });

    expect(api.post).toHaveBeenCalledWith('/api/simulacion?enviarCorreo=false', {
      capitalActual: 60000000,
      aporteMensual: 1800000,
      tiempoAnios: 25,
    });
    expect(result.moderado.valorFuturo).toBe(251696029);
  });
});
