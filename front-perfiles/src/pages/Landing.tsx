import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="nav-logo">Proyección</span>
        <div className="nav-links">
          <a href="#" className="nav-link active">Inicio</a>
          <a href="#simulador" className="nav-link">Simulador</a>
          <a href="#valora" className="nav-link">Asistente Valora</a>
        </div>
        <button className="btn-probar" onClick={() => navigate('/registro')}>
          Probar Gratis
        </button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            Tu Futuro,<br />
            <span className="hero-accent">Bajo Tu Control</span>
          </h1>
          <p className="hero-desc">
            Simulaciones financieras avanzadas para simular y comparar distintos
            perfiles de inversión (conservador, moderado, agresivo) para su pensión
            voluntaria. Proyecta tu éxito con la autoridad de datos en tiempo real.
          </p>
          <div className="hero-buttons">
            <button className="btn-crear" onClick={() => navigate('/registro')}>
              Crear cuenta
            </button>
            <button className="btn-iniciar" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="card-grid">
            <div className="card-main">
              <div className="card-chart-area"></div>
              <p className="card-label">CRECIMIENTO PROYECTADO</p>
              <p className="card-value">+24.5% p.a.</p>
            </div>
            <div className="card-small card-eficiencia">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span>EFICIENCIA</span>
            </div>
            <div className="card-wide card-seguridad">
              <div className="shield-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="card-seg-title">Seguridad de Nivel Bancario</p>
                <p className="card-seg-sub">Protección de datos cifrada 256-bit</p>
              </div>
            </div>
            <div className="card-small card-ia">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="card-ia-text">Optimización mediante IA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial">
        <h2 className="editorial-title">Poder Editorial en Tus Finanzas</h2>
        <p className="editorial-desc">
          Diseñamos herramientas que no solo calculan, sino que proyectan tu realidad financiera con precisión quirúrgica.
        </p>

        <div className="features-row">
          <div className="feature-card" id="simulador">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="10" y2="10" />
                <line x1="14" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="10" y2="14" />
                <line x1="14" y1="14" x2="16" y2="14" />
              </svg>
            </div>
            <h3 className="feature-name">Calculadora Inteligente</h3>
            <p className="feature-desc">
              Ejecuta múltiples escenarios de jubilación comparando perfiles conservadores, moderados y agresivos con variables macroeconómicas reales. Optimiza tu pensión voluntaria con flujos dinámicos de capital.
            </p>
            <button className="feature-link" onClick={() => navigate('/login')}>
              Explorar simulador <span>→</span>
            </button>
          </div>

          <div className="feature-card" id="valora">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
                <path d="M8 12a4 4 0 0 1 8 0" />
              </svg>
            </div>
            <h3 className="feature-name">Asistente Valora</h3>
            <p className="feature-desc">
              Nuestra Inteligencia Artificial procesa la normativa previsional vigente en tiempo real para darte respuestas con base legal y técnica impecable.
            </p>
            <button className="feature-link" onClick={() => navigate('/login')}>
              Hablar con el experto <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stat">
          <span className="stat-value">$4.2B</span>
          <span className="stat-label">FONDOS SIMULADOS</span>
        </div>
        <div className="stat">
          <span className="stat-value">50k+</span>
          <span className="stat-label">USUARIOS ACTIVOS</span>
        </div>
        <div className="stat">
          <span className="stat-value">99.9%</span>
          <span className="stat-label">PRECISIÓN ALGORÍTMICA</span>
        </div>
        <div className="stat">
          <span className="stat-value">24/7</span>
          <span className="stat-label">MONITOREO IA</span>
        </div>
      </section>
    </div>
  );
};

export default Landing;
