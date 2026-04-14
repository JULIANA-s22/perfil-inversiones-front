import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  tokenAcceso: string;
  tokenRefresco: string;
  expiraEnSegundos: number;
}

export interface SimulacionRequest {
  capitalActual: number;
  aporteMensual: number;
  tiempoAnios: number;
}

export interface PerfilDto {
  nombre: string;
  tasaAnual: number;
  valorFuturo: number;
  etiqueta: string;
}

export interface ProyeccionAnualDto {
  anio: number;
  pasivo: number;
  proyectado: number;
}

export interface SimulacionResponse {
  capitalActual: number;
  aporteMensual: number;
  tiempoAnios: number;
  conservador: PerfilDto;
  moderado: PerfilDto;
  agresivo: PerfilDto;
  proyeccionConservador: ProyeccionAnualDto[];
  proyeccionModerado: ProyeccionAnualDto[];
  proyeccionAgresivo: ProyeccionAnualDto[];
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/autenticacion/inicio-sesion', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/autenticacion/registro', data);
    return response.data;
  },
};

export const simulacionService = {
  simular: async (data: SimulacionRequest, enviarCorreo = false): Promise<SimulacionResponse> => {
    const response = await api.post(`/api/simulacion?enviarCorreo=${enviarCorreo}`, data);
    return response.data;
  },
};

export interface HistorialDto {
  id: string;
  capitalActual: number;
  aporteMensual: number;
  tiempoAnios: number;
  valorConservador: number;
  valorModerado: number;
  valorAgresivo: number;
  creadoEn: string;
}

export const historialService = {
  obtener: async (): Promise<HistorialDto[]> => {
    const response = await api.get('/api/historial');
    return response.data;
  },
};

export interface ConversacionDto {
  id: number;
  usuarioId: string;
  iniciadaEn: string;
  estado: string;
}

export interface MensajeDto {
  id: number;
  conversacionId: number;
  rol: 'USUARIO' | 'ASISTENTE';
  contenido: string;
  enviadoEn: string;
}

export const almacenamientoService = {
  obtenerUrlSubida: async (nombreArchivo: string): Promise<{ url: string; key: string }> => {
    const response = await api.post(
      `/api/almacenamiento/presigned-url?nombreArchivo=${encodeURIComponent(nombreArchivo)}&tipoContenido=application/pdf`
    );
    return response.data;
  },

  subirArchivo: async (urlPresignada: string, archivo: Blob) => {
    await axios.put(urlPresignada, archivo, {
      headers: { 'Content-Type': 'application/pdf' },
    });
  },
};

export const chatbotService = {
  iniciarChat: async (usuarioId: string): Promise<ConversacionDto> => {
    const response = await api.post('/api/chatbot/conversaciones/chat', { usuarioId });
    return response.data;
  },
  iniciarCuestionario: async (usuarioId: string): Promise<ConversacionDto> => {
    const response = await api.post('/api/chatbot/conversaciones/cuestionario', { usuarioId });
    return response.data;
  },
  listarConversaciones: async (usuarioId: string): Promise<ConversacionDto[]> => {
    const response = await api.get(`/api/chatbot/conversaciones/usuario/${usuarioId}`);
    return response.data;
  },
  enviarMensaje: async (conversacionId: number, contenido: string): Promise<MensajeDto> => {
    const response = await api.post(`/api/chatbot/conversaciones/${conversacionId}/mensajes`, { contenido });
    return response.data;
  },
  responderCuestionario: async (conversacionId: number, contenido: string): Promise<MensajeDto> => {
    const response = await api.post(`/api/chatbot/conversaciones/${conversacionId}/responder`, { contenido });
    return response.data;
  },
  obtenerMensajes: async (conversacionId: number): Promise<MensajeDto[]> => {
    const response = await api.get(`/api/chatbot/conversaciones/${conversacionId}/mensajes`);
    return response.data;
  },
};

export default api;
