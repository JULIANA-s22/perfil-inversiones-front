import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mockAxios };
});

import { authService, simulacionService, historialService, chatbotService } from '../services/api';
import api from '../services/api';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login llama al endpoint correcto', async () => {
    const mockResponse = {
      data: { tokenAcceso: 'token123', tokenRefresco: 'refresh', expiraEnSegundos: 900 },
    };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await authService.login({ correo: 'test@gmail.com', contrasena: '123456' });

    expect(api.post).toHaveBeenCalledWith('/api/autenticacion/inicio-sesion', {
      correo: 'test@gmail.com',
      contrasena: '123456',
    });
    expect(result.tokenAcceso).toBe('token123');
  });

  it('register llama al endpoint correcto', async () => {
    const mockResponse = {
      data: { tokenAcceso: 'newtoken', tokenRefresco: 'refresh', expiraEnSegundos: 900 },
    };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await authService.register({
      nombreCompleto: 'Test',
      correo: 'test@gmail.com',
      contrasena: '123456',
    });

    expect(api.post).toHaveBeenCalledWith('/api/autenticacion/registro', {
      nombreCompleto: 'Test',
      correo: 'test@gmail.com',
      contrasena: '123456',
    });
    expect(result.tokenAcceso).toBe('newtoken');
  });
});

describe('simulacionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('simular sin correo llama con enviarCorreo=false', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { capitalActual: 5000000 } });

    await simulacionService.simular({ capitalActual: 5000000, aporteMensual: 500000, tiempoAnios: 10 });

    expect(api.post).toHaveBeenCalledWith(
      '/api/simulacion?enviarCorreo=false',
      { capitalActual: 5000000, aporteMensual: 500000, tiempoAnios: 10 }
    );
  });

  it('simular con correo llama con enviarCorreo=true', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { capitalActual: 5000000 } });

    await simulacionService.simular({ capitalActual: 5000000, aporteMensual: 500000, tiempoAnios: 10 }, true);

    expect(api.post).toHaveBeenCalledWith(
      '/api/simulacion?enviarCorreo=true',
      { capitalActual: 5000000, aporteMensual: 500000, tiempoAnios: 10 }
    );
  });
});

describe('historialService', () => {
  it('obtener llama al endpoint correcto', async () => {
    const mockData = [{ id: '1', capitalActual: 5000000 }];
    vi.mocked(api.get).mockResolvedValue({ data: mockData });

    const result = await historialService.obtener();

    expect(api.get).toHaveBeenCalledWith('/api/historial');
    expect(result).toEqual(mockData);
  });
});

describe('chatbotService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('iniciarChat llama con el usuarioId', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1, estado: 'ACTIVA' } });

    await chatbotService.iniciarChat('abc-123');

    expect(api.post).toHaveBeenCalledWith('/api/chatbot/conversaciones/chat', { usuarioId: 'abc-123' });
  });

  it('iniciarCuestionario llama con el usuarioId', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 2, estado: 'ACTIVA' } });

    await chatbotService.iniciarCuestionario('abc-123');

    expect(api.post).toHaveBeenCalledWith('/api/chatbot/conversaciones/cuestionario', { usuarioId: 'abc-123' });
  });

  it('enviarMensaje llama con conversacionId y contenido', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1, contenido: 'Hola' } });

    await chatbotService.enviarMensaje(5, 'Hola');

    expect(api.post).toHaveBeenCalledWith('/api/chatbot/conversaciones/5/mensajes', { contenido: 'Hola' });
  });

  it('obtenerMensajes llama con el conversacionId', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    await chatbotService.obtenerMensajes(5);

    expect(api.get).toHaveBeenCalledWith('/api/chatbot/conversaciones/5/mensajes');
  });

  it('listarConversaciones llama con el usuarioId', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    await chatbotService.listarConversaciones('abc-123');

    expect(api.get).toHaveBeenCalledWith('/api/chatbot/conversaciones/usuario/abc-123');
  });
});
