import { useState, useRef, type FormEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Calculadora.css';
import { simulacionService, almacenamientoService, type SimulacionResponse } from '../services/api';

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'decimal', maximumFractionDigits: 0 }).format(n);

const Calculadora = () => {
  const [capital, setCapital] = useState('60000000');
  const [aporte, setAporte] = useState('1800000');
  const [anios, setAnios] = useState(25);
  const [resultado, setResultado] = useState<SimulacionResponse | null>(null);
  const [perfilActivo, setPerfilActivo] = useState<'conservador' | 'moderado' | 'agresivo'>('moderado');
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const simular = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await simulacionService.simular({
        capitalActual: Number(capital.replace(/\./g, '')),
        aporteMensual: Number(aporte.replace(/\./g, '')),
        tiempoAnios: anios,
      });
      console.log('Respuesta backend:', res);
      setResultado(res);
    } catch (err: any) {
      const msg = err?.response?.data?.mensaje || err?.response?.data?.message || err?.message || 'Error al calcular la simulación';
      setError(`Error: ${msg}`);
      console.error('Simulación error:', err);
    } finally {
      setLoading(false);
    }
  };

const exportarPDF = async () => {
  if (!pdfRef.current || !resultado) return;
  setExportando(true);
  try {
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableW = pageW - margin * 2;

    const opciones = {
      scale: 2,
      backgroundColor: '#f4f5f7',
      useCORS: true,
    };

  
    const secciones = pdfRef.current.querySelectorAll<HTMLElement>(
      '.perfiles-row, .chart-container'
    );

    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Simulación de Inversión', margin, 20);
    pdf.setFontSize(12);
    pdf.setTextColor(122, 138, 156);
    pdf.text(
      `Capital: $${formatCOP(Number(capital.replace(/\./g, '')))} | Aporte mensual: $${formatCOP(Number(aporte.replace(/\./g, '')))} | Horizonte: ${anios} años`,
      margin, 28
    );
    pdf.text(`Perfil seleccionado: ${perfilActivo.toUpperCase()}`, margin, 35);

    let cursorY = 42;

    for (let i = 0; i < secciones.length; i++) {
      const canvas = await html2canvas(secciones[i], opciones);
      const imgData = canvas.toDataURL('image/png');
      const imgH = (canvas.height * usableW) / canvas.width;

    
      if (cursorY + imgH > pageH - margin) {
        pdf.addPage();
        cursorY = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, cursorY, usableW, imgH);
      cursorY += imgH + 8;
    }

    const nombreArchivo = `simulacion-${perfilActivo}-${anios}anios-${Date.now()}.pdf`;

  
    const { url } = await almacenamientoService.obtenerUrlSubida(nombreArchivo);
    const pdfBlob = pdf.output('blob');
    await almacenamientoService.subirArchivo(url, pdfBlob);

    pdf.save(nombreArchivo);
  } catch (err: any) {
    console.error('PDF error:', err);
    setError('Error al exportar el PDF');
  } finally {
    setExportando(false);
  }
};

  const enviarAlCorreo = async () => {
    if (!resultado) return;
    setEnviandoCorreo(true);
    setCorreoEnviado(false);
    try {
      await simulacionService.simular({
        capitalActual: Number(capital.replace(/\./g, '')),
        aporteMensual: Number(aporte.replace(/\./g, '')),
        tiempoAnios: anios,
      }, true);
      setCorreoEnviado(true);
      setTimeout(() => setCorreoEnviado(false), 4000);
    } catch {
      setError('Error al enviar el correo');
    } finally {
      setEnviandoCorreo(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    simular();
  };

  const handleCapitalChange = (val: string) => {
    const num = val.replace(/\D/g, '');
    setCapital(num ? formatCOP(Number(num)) : '');
  };

  const handleAporteChange = (val: string) => {
    const num = val.replace(/\D/g, '');
    setAporte(num ? formatCOP(Number(num)) : '');
  };

  const perfiles = resultado
    ? [
        { key: 'conservador' as const, data: resultado.conservador },
        { key: 'moderado' as const, data: resultado.moderado },
        { key: 'agresivo' as const, data: resultado.agresivo },
      ]
    : [];
  const proyeccionActiva = resultado
    ? perfilActivo === 'conservador' ? resultado.proyeccionConservador
    : perfilActivo === 'agresivo' ? resultado.proyeccionAgresivo
    : resultado.proyeccionModerado
    : [];
  const datosComparativos = resultado
    ? resultado.proyeccionModerado.map((item, i) => ({
        anio: item.anio,
        conservador: resultado.proyeccionConservador[i]?.proyectado ?? 0,
        moderado: item.proyectado,
        agresivo: resultado.proyeccionAgresivo[i]?.proyectado ?? 0,
      }))
    : [];

  return (
    <div>
      <h1 className="calc-title">Calculadora de Perfiles</h1>
      <p className="calc-desc">
        Simular y comparar distintos perfiles de inversión (conservador, moderado, agresivo) para su pensión voluntaria.
      </p>

      {error && <div className="calc-error">{error}</div>}

      <div className="calc-grid">
        <div className="calc-params">
          <p className="params-title">PARÁMETROS DE PROYECCIÓN</p>
          <form onSubmit={handleSubmit}>
            <label className="param-label">CAPITAL ACTUAL (COP)</label>
            <input
              className="param-input"
              value={capital}
              onChange={(e) => handleCapitalChange(e.target.value)}
              required
            />

            <label className="param-label">APORTE MENSUAL (COP)</label>
            <input
              className="param-input"
              value={aporte}
              onChange={(e) => handleAporteChange(e.target.value)}
              required
            />

            <label className="param-label">TIEMPO PROYECTADO (AÑOS)</label>
            <div className="slider-row">
              <input
                type="range"
                min="1"
                max="50"
                value={anios}
                onChange={(e) => setAnios(Number(e.target.value))}
                className="param-slider"
              />
              <span className="slider-value">{anios}</span>
            </div>

            <button type="submit" className="btn-simular" disabled={loading}>
              {loading ? 'Calculando...' : 'Simular'}
            </button>

            <button type="button" className="btn-exportar" onClick={exportarPDF} disabled={exportando || !resultado}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="12" y2="14" />
              </svg>
              {exportando ? 'Exportando...' : 'Exportar a PDF'}
            </button>

            <button type="button" className="btn-correo" onClick={enviarAlCorreo} disabled={enviandoCorreo || !resultado}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              {correoEnviado ? 'Enviado!' : enviandoCorreo ? 'Enviando...' : 'Enviar informacion al correo'}
            </button>
          </form>
        </div>

        <div className="calc-results" ref={pdfRef}>
          {!resultado && !loading && (
            <div className="empty-state">
              <div className="empty-hero">
                <div className="empty-icon">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c9b87c" strokeWidth="1.4">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h2 className="empty-title">Tu futuro financiero<br/>empieza aquí</h2>
                <p className="empty-sub">Configura tus parámetros y presiona <strong>Simular</strong> para ver la proyección de tu pensión voluntaria.</p>
              </div>
              <div className="empty-stats">
                <div className="empty-stat-card">
                  <span className="empty-stat-icon">📈</span>
                  <span className="empty-stat-value">3 perfiles</span>
                  <span className="empty-stat-label">Conservador · Moderado · Agresivo</span>
                </div>
                <div className="empty-stat-card">
                  <span className="empty-stat-icon">⏳</span>
                  <span className="empty-stat-value">Hasta 50 años</span>
                  <span className="empty-stat-label">Horizonte de proyección</span>
                </div>
                <div className="empty-stat-card">
                  <span className="empty-stat-icon">💡</span>
                  <span className="empty-stat-value">Interés compuesto</span>
                  <span className="empty-stat-label">El dinero que trabaja por ti</span>
                </div>
              </div>
              <div className="empty-tip">
                <span className="empty-tip-label">DATO CLAVE</span>
                <p>Invertir <strong>$1.800.000 mensuales</strong> durante 25 años puede multiplicar tu capital más de <strong>4 veces</strong> con un perfil moderado.</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="empty-state empty-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">Calculando tu proyección...</p>
            </div>
          )}
          {resultado && (
            <div className="perfiles-row">
              {perfiles.map(({ key, data }) => (
                <button
                  key={key}
                  className={`perfil-card ${perfilActivo === key ? 'perfil-active' : ''}`}
                  onClick={() => setPerfilActivo(key)}
                >
                  {perfilActivo === key && <span className="perfil-star">★</span>}
                  <span className="perfil-nombre">{data.nombre}</span>
                  <span className="perfil-valor">${formatCOP(data.valorFuturo)}</span>
                  <span className={`perfil-etiqueta perfil-${key}`}>{data.etiqueta}</span>
                </button>
              ))}
            </div>
          )}
          {resultado && (
            <div className="chart-container">
              <div className="chart-header">
                <div>
                  <p className="chart-title">Crecimiento del Patrimonio</p>
                  <p className="chart-sub">Proyección perfil {perfilActivo} — interés compuesto anual</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot legend-pasivo"></span> PASIVO
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot legend-proyectado"></span> PROYECTADO
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={proyeccionActiva}>
                  <XAxis dataKey="anio" tickFormatter={(v) => `AÑO ${v}`} tick={{ fontSize: 11, fill: '#7a8a9c' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => `$${formatCOP(Number(value))}`} labelFormatter={(label) => `Año ${label}`} />
                  <Line type="monotone" dataKey="pasivo" stroke="#b0c4de" strokeWidth={2} strokeDasharray="6 4" dot={false} name="Pasivo" />
                  <Line type="monotone" dataKey="proyectado" stroke="#c9b87c" strokeWidth={3} dot={false} name="Proyectado" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {resultado && (
            <div className="chart-container chart-comparativo">
              <div className="chart-header">
                <div>
                  <p className="chart-title">Comparación de Perfiles</p>
                  <p className="chart-sub">Proyección simultánea de los 3 perfiles de inversión</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#3b82f6' }}></span> CONSERVADOR
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#c9b87c' }}></span> MODERADO
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot" style={{ background: '#ef4444' }}></span> AGRESIVO
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={datosComparativos}>
                  <XAxis dataKey="anio" tickFormatter={(v) => `AÑO ${v}`} tick={{ fontSize: 11, fill: '#7a8a9c' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => `$${formatCOP(Number(value))}`} labelFormatter={(label) => `Año ${label}`} />
                  <Line type="monotone" dataKey="conservador" stroke="#3b82f6" strokeWidth={2} dot={false} name="Conservador" />
                  <Line type="monotone" dataKey="moderado" stroke="#c9b87c" strokeWidth={2} dot={false} name="Moderado" />
                  <Line type="monotone" dataKey="agresivo" stroke="#ef4444" strokeWidth={2} dot={false} name="Agresivo" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
