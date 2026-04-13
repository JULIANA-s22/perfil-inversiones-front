import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../pages/Landing';

const renderLanding = () =>
  render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>
  );

describe('Landing', () => {
  it('renderiza el logo Proyección en la nav', () => {
    renderLanding();
    expect(screen.getByText('Proyección')).toBeInTheDocument();
  });

  it('renderiza el título del hero', () => {
    renderLanding();
    expect(screen.getByText('Tu Futuro,')).toBeInTheDocument();
    expect(screen.getByText('Bajo Tu Control')).toBeInTheDocument();
  });

  it('tiene botón Crear cuenta', () => {
    renderLanding();
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
  });

  it('tiene botón Iniciar sesión', () => {
    renderLanding();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('tiene botón Probar Gratis en la nav', () => {
    renderLanding();
    expect(screen.getByText('Probar Gratis')).toBeInTheDocument();
  });

  it('tiene links de navegación', () => {
    renderLanding();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Simulador')).toBeInTheDocument();
    expect(screen.getAllByText('Asistente Valora').length).toBeGreaterThanOrEqual(1);
  });
});
