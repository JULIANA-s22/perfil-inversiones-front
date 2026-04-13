import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Historial from '../pages/Historial';

vi.mock('../services/api', () => ({
  historialService: {
    obtener: vi.fn(),
  },
}));

import { historialService } from '../services/api';

const renderHistorial = () =>
  render(
    <BrowserRouter>
      <Historial />
    </BrowserRouter>
  );

describe('Historial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el título', () => {
    vi.mocked(historialService.obtener).mockResolvedValue([]);
    renderHistorial();
    expect(screen.getByText('Historial de Simulaciones')).toBeInTheDocument();
  });

  it('muestra loading al inicio', () => {
    vi.mocked(historialService.obtener).mockReturnValue(new Promise(() => {}));
    renderHistorial();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje vacío cuando no hay registros', async () => {
    vi.mocked(historialService.obtener).mockResolvedValue([]);
    renderHistorial();

    await waitFor(() => {
      expect(screen.getByText('No hay simulaciones guardadas aún.')).toBeInTheDocument();
    });
  });

  it('renderiza las tarjetas de simulación', async () => {
    vi.mocked(historialService.obtener).mockResolvedValue([
      {
        id: '1',
        capitalActual: 5000000,
        aporteMensual: 500000,
        tiempoAnios: 10,
        valorConservador: 8000000,
        valorModerado: 10000000,
        valorAgresivo: 12000000,
        creadoEn: '2026-04-12T10:00:00',
      },
    ]);

    renderHistorial();

    await waitFor(() => {
      expect(screen.getByText('10 años')).toBeInTheDocument();
      expect(screen.getByText('Conservador')).toBeInTheDocument();
      expect(screen.getByText('Moderado')).toBeInTheDocument();
      expect(screen.getByText('Agresivo')).toBeInTheDocument();
    });
  });

  it('llama a historialService.obtener al montar', () => {
    vi.mocked(historialService.obtener).mockResolvedValue([]);
    renderHistorial();
    expect(historialService.obtener).toHaveBeenCalledOnce();
  });
});
