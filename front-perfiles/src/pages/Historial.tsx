import { useState, useEffect } from 'react';
import { historialService, type HistorialDto } from '../services/api';
import './Historial.css';

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'decimal', maximumFractionDigits: 0 }).format(n);

const Historial = () => {
  const [registros, setRegistros] = useState<HistorialDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historialService.obtener()
      .then(setRegistros)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="hist-title">Historial de Simulaciones</h1>
      <p className="hist-desc">Todas tus simulaciones guardadas automáticamente.</p>

      {loading && <p className="hist-loading">Cargando...</p>}

      {!loading && registros.length === 0 && (
        <p className="hist-empty">No hay simulaciones guardadas aún.</p>
      )}

      <div className="hist-grid">
        {registros.map((r) => (
          <div key={r.id} className="hist-card">
            <div className="hist-card-header">
              <span className="hist-date">
                {new Date(r.creadoEn).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
              <span className="hist-years">{r.tiempoAnios} años</span>
            </div>
            <div className="hist-params">
              <div>
                <span className="hist-label">Capital</span>
                <span className="hist-value">${formatCOP(r.capitalActual)}</span>
              </div>
              <div>
                <span className="hist-label">Aporte mensual</span>
                <span className="hist-value">${formatCOP(r.aporteMensual)}</span>
              </div>
            </div>
            <div className="hist-results">
              <div className="hist-perfil">
                <span className="hist-perfil-name conservador">Conservador</span>
                <span className="hist-perfil-val">${formatCOP(r.valorConservador)}</span>
              </div>
              <div className="hist-perfil">
                <span className="hist-perfil-name moderado">Moderado</span>
                <span className="hist-perfil-val">${formatCOP(r.valorModerado)}</span>
              </div>
              <div className="hist-perfil">
                <span className="hist-perfil-name agresivo">Agresivo</span>
                <span className="hist-perfil-val">${formatCOP(r.valorAgresivo)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
