import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register({ nombreCompleto: nombre, correo, contrasena });
      navigate('/app');
    } catch {
    }
  };

  return (
    <div className="auth-container registro">
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <h2 className="auth-heading">Crea tu cuenta</h2>
          <p className="auth-subheading">Accede a herramientas financieras de alta autoridad.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="input-label">NOMBRE COMPLETO</label>
            <div className="input-group">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                placeholder="Ingrese su nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <label className="input-label">CORREO ELECTRÓNICO</label>
            <div className="input-group">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                type="email"
                placeholder="Ingrese su email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <label className="input-label">CONTRASEÑA</label>
            <div className="input-group">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-divider"></div>
          <p className="auth-switch">¿Ya tienes una cuenta?</p>
          <Link to="/login" className="auth-switch-link">Iniciar sesión</Link>
        </div>
      </div>

      <div className="auth-brand">
        <h1 className="brand-title">Proyección</h1>
        <p className="brand-desc">
          La arquitectura financiera diseñada para la autoridad y precisión editorial.
        </p>
        <div className="brand-quote">
          <p className="quote-text">"La precisión es la base de la proyección."</p>
          <div className="quote-line"></div>
        </div>
        <p className="brand-footer">ARQUITECTURA DE AUTORIDAD FINANCIERA © 2024</p>
      </div>
    </div>
  );
};

export default Registro;
