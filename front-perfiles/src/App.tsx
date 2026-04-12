import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registro from './pages/Registro';
import DashboardLayout from './components/DashboardLayout';
import Calculadora from './pages/Calculadora';
import Valora from './pages/Valora';
import Historial from './pages/Historial';
import type { ReactNode } from 'react';

const RutaProtegida = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/app" element={<RutaProtegida><DashboardLayout /></RutaProtegida>}>
        <Route index element={<Navigate to="calculadora" />} />
        <Route path="calculadora" element={<Calculadora />} />
        <Route path="valora" element={<Valora />} />
        <Route path="historial" element={<Historial />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
