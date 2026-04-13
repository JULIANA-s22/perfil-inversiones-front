# Proyeccion Front

Aplicacion web frontend construida con React, TypeScript y Vite. Sistema de autenticacion con area protegida que ofrece herramientas de calculo, valoracion e historial.

## Descripcion del Proyecto

Proyeccion Front es una aplicacion moderna que proporciona a los usuarios acceso a herramientas de analisis y calculo. El sistema implementa autenticacion segura y separa el contenido publico del contenido privado mediante rutas protegidas.

### Funcionalidades Principales

- Autenticacion de usuarios (Login y Registro)
- Dashboard protegido con menu de navegacion
- Calculadora interactiva
- Modulo de valoracion y analisis
- Historial de operaciones
- Generacion de reportes en PDF
- Visualizacion de datos con graficos
- API REST integration

## Estructura del Proyecto

```
front-perfiles/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx      # Layout principal del dashboard
│   │   └── DashboardLayout.css      # Estilos del layout
│   ├── context/
│   │   └── AuthContext.tsx          # Contexto de autenticacion
│   ├── pages/
│   │   ├── Landing.tsx              # Pagina de inicio
│   │   ├── Login.tsx                # Pagina de login
│   │   ├── Registro.tsx             # Pagina de registro
│   │   ├── Calculadora.tsx          # Pagina calculadora
│   │   ├── Valora.tsx               # Pagina de valoracion
│   │   ├── Historial.tsx            # Pagina de historial
│   │   └── *.css                    # Estilos de cada pagina
│   ├── services/
│   │   └── api.ts                   # Configuracion de llamadas API
│   ├── assets/                      # Recursos estaticos
│   ├── App.tsx                      # Componente principal
│   ├── main.tsx                     # Punto de entrada
│   ├── App.css                      # Estilos globales
│   └── index.css                    # Estilos base
├── public/                          # Archivos publicos
├── package.json                     # Dependencias y scripts
├── vite.config.ts                   # Configuracion de Vite
├── tsconfig.json                    # Configuracion TypeScript
├── eslint.config.js                 # Configuracion ESLint
└── index.html                       # HTML principal

```

## Requisitos Previos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior

## Instalacion

1. Clonar el repositorio:

```bash
git clone <url-repositorio>
cd front-perfiles
```

2. Navegar a la carpeta del proyecto:

```bash
cd front-perfiles
```

3. Instalar dependencias:

```bash
npm install
```

## Configuracion

### Variables de Entorno

Crear un archivo `.env.local` en la raiz del proyecto (dentro de la carpeta `front-perfiles`):

```
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

### Configuracion de la API

El archivo `src/services/api.ts` contiene la configuracion de Axios para las llamadas a la API. Asegurate de que la URL base coincida con tu servidor backend.

## Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo con Vite en `http://localhost:5173`

## Autenticacion

El sistema de autenticacion se gestiona mediante:

- **AuthContext.tsx**: Provee el estado de autenticacion a toda la aplicacion
- **RutaProtegida**: Componente wrapper que valida si el usuario esta autenticado
- **Token Storage**: Los tokens se almacenan en localStorage

### Flujo de Autenticacion

1. Usuario accede a `/login` o `/registro`
2. Credenciales se envian al backend via API
3. Backend retorna un token JWT
4. Token se almacena en localStorage
5. Usuario obtiene acceso a rutas protegidas
