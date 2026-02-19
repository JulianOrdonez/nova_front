# NOVA Frontend - Estructura del Proyecto

## 📊 Nueva estructura después de la limpieza

```
nova/
├── public/                    # Assets estáticos (imágenes, iconos)
│   └── images/
│       ├── backgrounds/
│       └── products/
│
├── src/
│   ├── app/                   # Rutas y layout de Next.js
│   │   ├── layout.tsx         # Layout global
│   │   ├── page.tsx           # Página principal
│   │   ├── globals.css        # Estilos globales
│   │   ├── contacto/          # Página de contacto
│   │   ├── nosotros/          # Página "Acerca de"
│   │   ├── productos/         # Página de productos
│   │   │   └── [slug]/        # Detalle de producto
│   │   └── servicios/         # Página de servicios
│   │
│   ├── components/            # Componentes React reutilizables
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/          # Componentes de secciones (VACÍO)
│   │   └── ui/                # Componentes UI básicos (VACÍO)
│   │
│   ├── hooks/                 # Hooks personalizados
│   │   └── useApi.ts          # Hook para conectar con FastAPI
│   │
│   ├── config/                # Configuración de la aplicación
│   │   └── api.ts             # URLs y endpoints de API
│   │
│   ├── constants/             # Constantes globales (VACÍO)
│   │
│   ├── types/                 # Tipos e interfaces de TypeScript
│   │   └── index.ts           # Todos los tipos centralizados
│   │
│   └── utils/                 # Funciones utilitarias (VACÍO)
│
├── .env.example               # Ejemplo de variables de entorno
├── next.config.ts             # Configuración de Next.js
├── tsconfig.json              # Configuración de TypeScript
├── tailwind.config.ts         # Configuración de Tailwind CSS
├── postcss.config.mjs         # Configuración de PostCSS
├── package.json               # Dependencias del proyecto
└── package-lock.json
```

## 🧹 Cambios realizados

### ✅ Eliminado
- `src/app/api/` - Rutas API de Next.js (backend)
- `src/app/lib/prisma.ts` - Cliente de Prisma
- `prisma/` - Configuración y migraciones de Prisma
- `prisma.config.ts` - Archivo de configuración de Prisma
- `test-api.ps1` - Script de testing del API
- `BACKEND_SUMMARY.md` y `API_DOCS.md` - Documentación backend
- Dependencias: `@prisma/client`, `prisma`, `tsx`

### ✨ Añadido
- `src/config/api.ts` - Configuración centralizada para la API FastAPI
- `src/types/index.ts` - Tipos e interfaces centralizados
- `src/constants/` - Carpeta para constantes globales
- `src/utils/` - Carpeta para funciones utilitarias
- `.env.example` - Archivo de ejemplo para configuración

### 🔄 Actualizado
- `src/hooks/useApi.ts` - Ahora se conecta a FastAPI externo
- `package.json` - Eliminadas dependencias de backend

## 🚀 Cómo usar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar .env.local y establecer la URL de FastAPI
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Iniciar desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📡 Arquitectura Frontend - FastAPI

```
Browser (Frontend)
    ↓
Next.js + React + TypeScript
    ↓ (HTTP/REST)
FastAPI Backend
    ↓
PostgreSQL Database
```

### Endpoints disponibles en FastAPI

El frontend espera los siguientes endpoints en FastAPI:

- `GET /api/products` - Listar productos
- `GET /api/products/{slug}` - Obtener producto por slug
- `GET /api/services` - Listar servicios  
- `POST /api/contact` - Enviar mensaje de contacto

### Formato de respuestas esperadas

```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

## 📝 Stack del Frontend

- **Next.js 16** - Framework React
- **React 19** - Librería UI
- **TypeScript 5** - Tipado seguro
- **Tailwind CSS 4** - Estilos
- **Framer Motion** - Animaciones
- **ESLint** - Linting

## 🗂️ Organización de tipos

Todos los tipos están centralizados en `src/types/index.ts`:

```typescript
// Importar tipos en cualquier archivo
import type { Product, Service, ApiResponse } from '@/types';
```

## 🌐 Configuración de API

La configuración de endpoints está centralizada en `src/config/api.ts`:

```typescript
import API_ENDPOINTS from '@/config/api';

// Usar en componentes
const response = await fetch(API_ENDPOINTS.products);
```

## 📚 Carpetas vacías (para futuro)

- `src/constants/` - Para constantes globales
- `src/utils/` - Para funciones reutilizables
- `src/components/sections/` - Para secciones de páginas
- `src/components/ui/` - Para componentes UI customizados

Estas carpetas están listas para que agregues componentes y utilidades conforme los necesites.

---

**Frontend listo para conectar con FastAPI** 🎉
