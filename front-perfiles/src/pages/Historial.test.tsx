import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Historial from './Historial';


const mockObtener = vi.fn();

vi.mock('../services/api', () => ({
  historialService: {
    obtener: (...args: any[]) => mockObtener(...args),
  },
}));


beforeEach(() => {
  vi.clearAllMocks();
});

describe('Historial', () => {
  it('muestra loading inicialmente', () => {
    mockObtener.mockReturnValue(new Promise(() => {})); 
    render(<Historial />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje vacío cuando no hay registros', async () => {
    mockObtener.mockResolvedValueOnce([]);
    render(<Historial />);

    await waitFor(() => {
      expect(screen.getByText('No hay simulaciones guardadas aún.')).toBeInTheDocument();
    });
  });

  it('renderiza cards con datos de simulaciones', async () => {
    mockObtener.mockResolvedValueOnce([
      {
        id: '1',
        capitalActual: 60000000,
        aporteMensual: 1800000,
        tiempoAnios: 25,
        valorConservador: 213619805,
        valorModerado: 251696029,
        valorAgresivo: 298157677,
        creadoEn: '2026-04-14T10:00:00Z',
      },
    ]);

    render(<Historial />);

    await waitFor(() => {
      expect(screen.getByText('25 años')).toBeInTheDocument();
      expect(screen.getByText('Conservador')).toBeInTheDocument();
      expect(screen.getByText('Moderado')).toBeInTheDocument();
      expect(screen.getByText('Agresivo')).toBeInTheDocument();
    });
  });

  it('renderiza múltiples registros', async () => {
    mockObtener.mockResolvedValueOnce([
      {
        id: '1', capitalActual: 10000000, aporteMensual: 500000, tiempoAnios: 10,
        valorConservador: 100, valorModerado: 200, valorAgresivo: 300,
        creadoEn: '2026-01-01T00:00:00Z',
      },
      {
        id: '2', capitalActual: 20000000, aporteMensual: 1000000, tiempoAnios: 15,
        valorConservador: 400, valorModerado: 500, valorAgresivo: 600,
        creadoEn: '2026-02-01T00:00:00Z',
      },
    ]);

    render(<Historial />);

    await waitFor(() => {
      expect(screen.getByText('10 años')).toBeInTheDocument();
      expect(screen.getByText('15 años')).toBeInTheDocument();
    });
  });
});
