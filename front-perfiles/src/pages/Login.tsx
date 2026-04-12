import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ correo, contrasena });
      navigate('/app');
    } catch {
    }
  };

  return (
    <div className="auth-container">
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

      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <h2 className="auth-heading">Bienvenido de nuevo</h2>
          <p className="auth-subheading">Ingrese sus credenciales para acceder a su cuenta.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="input-label">CORREO ELECTRÓNICO</label>
            <div className="input-group">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                type="email"
                placeholder="nombre@empresa.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="label-row">
              <label className="input-label">CONTRASEÑA</label>
              <a href="#" className="forgot-link">¿Olvidó su contraseña?</a>
            </div>
            <div className="input-group">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button type="button" className="toggle-pass" onClick={() => setMostrarPass(!mostrarPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Recuerda mi sesión</span>
            </label>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>

          <div className="auth-divider"></div>
          <p className="auth-switch">
            ¿Aún no tiene una cuenta corporativa?
          </p>
          <Link to="/registro" className="auth-switch-link">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
