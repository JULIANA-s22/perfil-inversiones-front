# Prompts de Desarrollo

Colección de prompts estructurados para las funcionalidades principales del proyecto Proyección.

---

## [1] Landing Page - Diseño Fintech Premium

**Status**: [HECHO] Implementado

> Estoy diseñando una landing page para mi proyecto de simulación de pensiones voluntarias "Proyección". Quiero un hero con CTA hacia /registro, una sección explicativa del valor de la plataforma, tarjetas para las dos funcionalidades principales (calculadora y chatbot IA), y una barra de estadísticas al fondo. Estoy usando navy #0b1a30 y champagne #c9b87c como paleta. ¿Cómo quedaría bien estructurado en React + TypeScript con CSS puro? Necesito que sea responsivo y tipo fintech elegante.

**Tecnologías**: React + TypeScript + CSS Puro  
**Componente**: `src/pages/Landing.tsx`  
**Estilos**: `src/pages/Landing.css`  
**Paleta**: Navy `#0b1a30` | Champagne `#c9b87c`

---

## [2] Login - Split Layout

> Necesito hacer un login con layout split: branding a la izquierda y formulario a la derecha. Ya tengo un authService.login() que recibe correo y contraseña y devuelve un JWT. ¿Cómo puedo conectar el formulario para que guarde el token y redirija a /app/calculadora? También quiero mostrar errores inline si las credenciales fallan. Estoy usando React + TypeScript

**Tecnologías**: React + TypeScript + AuthContext  
**Componente**: `src/pages/Login.tsx`  
**Estilos**: `src/pages/Auth.css`  
**Funcionalidades**:

- [x] Layout split (60/40 responsive)
- [x] Almacenamiento de JWT en localStorage
- [x] Redirección automática a `/app/calculadora`
- [x] Manejo de errores inline
- [x] Validación de formulario

---

## [3] Registro - Validaciones Avanzadas

> Tengo el login listo y ahora quiero hacer el registro con el layout invertido (form a la izquierda, branding a la derecha). Los campos son nombre completo, correo, contraseña y confirmar contraseña. Ya tengo authService.register({nombreCompleto, correo, contrasena}). ¿Me ayudás con las validaciones? Necesito que verifique formato de correo, mínimo 6 caracteres en contraseña y que las contraseñas coincidan. Misma paleta navy + champagne.

**Tecnologías**: React + TypeScript + Validación  
**Componente**: `src/pages/Registro.tsx`  
**Estilos**: `src/pages/Auth.css`  
**Validaciones**:

- [x] Email válido (regex)
- [x] Contraseña mínimo 6 caracteres
- [x] Confirmación de contraseña
- [x] Nombre completo requerido
- [x] Feedback visual en tiempo real

---

## [4] Enrutamiento y Protección

> Tengo dudas con el enrutamiento. Quiero rutas públicas (landing, login, registro) y protegidas bajo /app (calculadora, valora, historial). Estoy usando React Router v6. ¿Cómo hago el componente RutaProtegida que verifique si hay token? También en el AuthContext necesito decodificar el JWT para sacar el usuarioId. ¿Uso jwt-decode o puedo hacerlo con atob? Y para el api.ts, quiero que la base URL sea configurable con variable de entorno de Vite para poder cambiarla al desplegar. ¿Cómo se hace eso?

**Tecnologías**: React Router v7 + TypeScript + JWT  
**Componentes**:

- `src/context/AuthContext.tsx` - Estado global
- `src/services/api.ts` - Cliente Axios con interceptors
- `App.tsx` - Configuración de rutas

**Características**:

- [x] Rutas públicas vs protegidas
- [x] RutaProtegida wrapper component
- [x] JWT decode con atob (sin dependencias extra)
- [x] Variables de entorno Vite (`VITE_API_URL`)
- [x] Interceptors automáticos (Bearer token)
- [x] Redirección en 401

---

## [5] Calculadora de Inversión

> Estoy haciendo la calculadora de inversión. El backend recibe capitalActual, aporteMensual y tiempoAnios y devuelve 3 perfiles (conservador 3%, moderado 7%, agresivo 11%) cada uno con proyección anual. Quiero mostrar los resultados en tarjetas, una gráfica del perfil seleccionado y otra comparativa con los 3 perfiles. Estoy usando Recharts. También necesito un botón para exportar a PDF con html2canvas + jsPDF y otro para enviar al correo que mande un query param enviarCorreo=true. ¿Cómo lo estructuro? Los valores son en COP y necesitan formato de miles

**Tecnologías**: React + TypeScript + Recharts + PDF  
**Página**: `src/pages/Calculadora.tsx`  
**Estilos**: `src/pages/Calculadora.css`

**Funcionalidades**:

- [x] Inputs: capitalActual, aporteMensual, tiempoAnios
- [x] 3 Perfiles (Conservador 3% | Moderado 7% | Agresivo 11%)
- [x] Tarjetas resultado por perfil
- [x] Gráfica del perfil seleccionado (LineChart Recharts)
- [x] Gráfica comparativa 3 perfiles (BarChart)
- [x] Formato COP con separador de miles
- [x] Botón Exportar PDF (html2canvas + jsPDF)
- [x] Botón Enviar por email (query param `enviarCorreo=true`)
- [x] Guardado automático en historial

---

## [6] Historial de Simulaciones

> Tengo un endpoint GET /api/historial que devuelve las simulaciones guardadas del usuario con capitalActual, aporteMensual, tiempoAnios y los valores de cada perfil. Quiero mostrarlo en un grid de tarjetas con la fecha, los parámetros y los 3 resultados por perfil con colores distintos (azul, champagne, rojo). ¿Cuál sería una buena estructura para las tarjetas? Quiero que sea responsivo con auto-fill. React + TypeScript + CSS puro

**Tecnologías**: React + TypeScript + CSS Grid  
**Página**: `src/pages/Historial.tsx`  
**Estilos**: `src/pages/Historial.css`

**Estructura de Tarjeta**:

```
┌─────────────────────────────┐
│ Fecha: 12/04/2026           │
├─────────────────────────────┤
│ Capital: $1.000.000         │
│ Aporte: $10.000/mes         │
│ Plazo: 20 años              │
├─────────────────────────────┤
│ [AZUL] Conservador: $2.450.000  │
│ [CHAMPAGNE] Moderado: $3.120.000     │
│ [ROJO] Agresivo: $4.890.000     │
└─────────────────────────────┘
```

**Funcionalidades**:

- [x] Grid responsivo (auto-fill, minmax 300px)
- [x] Tarjetas con fecha y parámetros
- [x] 3 resultados con colores (azul, champagne, rojo)
- [x] Formato COP
- [x] Breakpoint responsive 900px
- [x] Hover effects elegantes
