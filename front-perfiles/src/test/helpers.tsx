import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}

export function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>{ui}</BrowserRouter>
  );
}

export const TOKEN_MOCK = 'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'test@gmail.com', usuarioId: 'abc-123', nombreCompleto: 'Test Usuario' })) +
  '.fake-signature';
