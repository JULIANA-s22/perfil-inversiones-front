import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculadora from './Calculadora';


const mockSimular = vi.fn();
const mockObtenerUrlSubida = vi.fn();
const mockSubirArchivo = vi.fn();

vi.mock('../services/api', () => ({
  simulacionService: {
    simular: (...args: any[]) => mockSimular(...args),
  },
  almacenamientoService: {
    obtenerUrlSubida: (...args: any[]) => mockObtenerUrlSubida(...args),
    subirArchivo: (...args: any[]) => mockSubirArchivo(...args),
  },
}));

vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,fake',
    height: 800,
    width: 1200,
  })),
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: { pageSize: { getWidth: () => 297, getHeight: () => 210 } },
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    addImage: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    output: vi.fn(() => new Blob(['fake-pdf'], { type: 'application/pdf' })),
  })),
}));

const mockResultado = {
  capitalActual: 60000000,
  aporteMensual: 1800000,
  tiempoAnios: 6,
  conservador: { nombre: 'Conservador', tasaAnual: 3, valorFuturo: 213619805, etiqueta: 'ESTABILIDAD 3% TEA' },
  moderado: { nombre: 'Moderado', tasaAnual: 7, valorFuturo: 251696029, etiqueta: 'EQUILIBRIO 7% TEA' },
  agresivo: { nombre: 'Agresivo', tasaAnual: 11, valorFuturo: 298157677, etiqueta: 'CRECIMIENTO 11% TEA' },
  proyeccionConservador: [{ anio: 0, pasivo: 60000000, proyectado: 60000000 }],
  proyeccionModerado: [{ anio: 0, pasivo: 60000000, proyectado: 60000000 }],
  proyeccionAgresivo: [{ anio: 0, pasivo: 60000000, proyectado: 60000000 }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Calculadora', () => {
  it('renderiza el formulario con campos y botón', () => {
    render(<Calculadora />);

    expect(screen.getByText('Calculadora de Perfiles')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar a PDF/i })).toBeInTheDocument();
  });

  it('muestra estado vacío antes de simular', () => {
    render(<Calculadora />);

    expect(screen.getByText(/Tu futuro financiero/)).toBeInTheDocument();
    expect(screen.getByText(/Configura tus parámetros/)).toBeInTheDocument();
  });

  it('simula y muestra resultados', async () => {
    const user = userEvent.setup();
    mockSimular.mockResolvedValueOnce(mockResultado);

    render(<Calculadora />);
    await user.click(screen.getByRole('button', { name: /Simular/i }));

    await waitFor(() => {
      expect(mockSimular).toHaveBeenCalled();
      expect(screen.getByText('ESTABILIDAD 3% TEA')).toBeInTheDocument();
      expect(screen.getByText('EQUILIBRIO 7% TEA')).toBeInTheDocument();
      expect(screen.getByText('CRECIMIENTO 11% TEA')).toBeInTheDocument();
    });
  });

  it('exporta PDF cuando hay resultados', async () => {
    const user = userEvent.setup();
    mockSimular.mockResolvedValueOnce(mockResultado);

    render(<Calculadora />);
    
    await user.click(screen.getByRole('button', { name: /Simular/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Exportar a PDF/i })).not.toBeDisabled());

    await user.click(screen.getByRole('button', { name: /Exportar a PDF/i }));

    await waitFor(() => {
      expect(mockSubirArchivo).toHaveBeenCalledTimes(0);
    });
  });

  it('muestra error cuando la simulación falla', async () => {
    const user = userEvent.setup();
    mockSimular.mockRejectedValueOnce(new Error('Error en servidor'));

    render(<Calculadora />);
    await user.click(screen.getByRole('button', { name: /Simular/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });
});
