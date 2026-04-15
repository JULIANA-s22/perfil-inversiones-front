import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Valora from './Valora';


const mockIniciarChat = vi.fn();
const mockIniciarCuestionario = vi.fn();
const mockEnviarMensaje = vi.fn();
const mockResponderCuestionario = vi.fn();
const mockObtenerMensajes = vi.fn();

vi.mock('../services/api', () => ({
  chatbotService: {
    iniciarChat: (...args: any[]) => mockIniciarChat(...args),
    iniciarCuestionario: (...args: any[]) => mockIniciarCuestionario(...args),
    enviarMensaje: (...args: any[]) => mockEnviarMensaje(...args),
    responderCuestionario: (...args: any[]) => mockResponderCuestionario(...args),
    obtenerMensajes: (...args: any[]) => mockObtenerMensajes(...args),
    listarConversaciones: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    userId: 'test-uuid-123',
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Valora', () => {
  it('renderiza pantalla de bienvenida sin conversación activa', () => {
    render(<Valora />);

    expect(screen.getByText('Asistente Valora')).toBeInTheDocument();
    expect(screen.getByText('Iniciar chat libre')).toBeInTheDocument();
    expect(screen.getByText('Descubrir mi perfil de riesgo')).toBeInTheDocument();
  });

  it('iniciar chat libre es clickeable', () => {
    render(<Valora />);

    const chatBtn = screen.getByText('Iniciar chat libre');
    expect(chatBtn).toBeInTheDocument();
    expect(chatBtn).not.toBeDisabled();
  });

  it('iniciar cuestionario es clickeable', () => {
    render(<Valora />);

    const cuestionarioBtn = screen.getByText('Descubrir mi perfil de riesgo');
    expect(cuestionarioBtn).toBeInTheDocument();
    expect(cuestionarioBtn).not.toBeDisabled();
  });
});
