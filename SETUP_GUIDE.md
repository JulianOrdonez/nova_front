# NOVA Backend - Setup & Running Guide

## 🔧 Prerequisites

Asegúrate de tener instalados:

- **Node.js** 18.17+ o 20+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** 14+ ([Descargar](https://www.postgresql.org/download/))
- **npm** 9+ (viene con Node.js)

Verificar versiones:
```bash
node --version
npm --version
psql --version
```

## 📦 Installation & Setup

### 1. Instalar Dependencias

```bash
cd c:\Users\julio\Desktop\NOVA\NOVA_PAGE\nova
npm install
```

### 2. Crear Base de Datos en PostgreSQL

Abrir PostgreSQL CLI (psql):

```bash
psql -U postgres
```

Crear la base de datos:

```sql
CREATE DATABASE nova_db;
```

Verificar:
```sql
\l
```

Salir:
```sql
\q
```

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado:

```env
DATABASE_URL="postgresql://postgres:1029@localhost:5432/nova_db"
```

**Si tu contraseña de PostgreSQL es diferente, actualizar:**

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/nova_db"
```

### 4. Ejecutar Migraciones

```bash
npx prisma migrate deploy
```

O si estás en desarrollo:

```bash
npx prisma migrate dev
```

### 5. Poblar Base de Datos (Opcional)

Cargar datos de ejemplo:

```bash
npm run prisma:seed
```

Esto creará:
- 3 categorías
- 3 productos
- 4 servicios

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

El servidor estará disponible en:
- Local: `http://localhost:3000`
- Network: `http://192.168.56.1:3000`

### Production Build

```bash
npm run build
npm start
```

## 📋 Available Scripts

```bash
# Desarrollo
npm run dev                    # Inicia servidor en puerto 3000

# Production
npm run build                  # Compila para producción
npm start                     # Inicia servidor producción

# Prisma Commands
npx prisma generate          # Genera Prisma Client
npx prisma migrate dev       # Crea migración en desarrollo
npx prisma migrate deploy    # Aplica migraciones a producción
npx prisma studio           # Abre interfaz gráfica de BD
npm run prisma:seed         # Carga datos semilla
npx prisma db reset         # Resetea BD (borra datos)

# Linting
npm run lint                # Ejecuta ESLint
```

## 🔍 Testing APIs

### Option 1: PowerShell Script

```bash
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

### Option 2: Manual with curl

```bash
# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/nova-pro-wireless

# Get services
curl http://localhost:3000/api/services

# Send contact message
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "message": "Mensaje de prueba"
  }'
```

### Option 3: Using Insomnia/Postman

Import the following requests:

**GET /api/products**
```
URL: http://localhost:3000/api/products
Method: GET
```

**GET /api/products/[slug]**
```
URL: http://localhost:3000/api/products/nova-pro-wireless
Method: GET
```

**GET /api/services**
```
URL: http://localhost:3000/api/services
Method: GET
```

**POST /api/contact**
```
URL: http://localhost:3000/api/contact
Method: POST
Headers: Content-Type: application/json
Body (JSON):
{
  "name": "Tu Nombre",
  "email": "tu@email.com",
  "message": "Tu mensaje aquí"
}
```

## 🗄️ Database Management

### View Data with Prisma Studio

```bash
npx prisma studio
```

Abre interfaz visual en `http://localhost:5555`

### Manual SQL Queries

```bash
psql -U postgres -d nova_db
```

Ejemplos:

```sql
-- Ver todos los productos
SELECT * FROM "Product";

-- Ver categorías
SELECT * FROM "Category";

-- Ver mensajes de contacto
SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC;

-- Contar productos por categoría
SELECT c.name, COUNT(p.id) as count
FROM "Category" c
LEFT JOIN "Product" p ON c.id = p."categoryId"
GROUP BY c.name;
```

## ⚠️ Common Issues & Solutions

### Issue: Database connection refused

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
# En Windows, verificar en Services (Servicios)
# O iniciar manualmente:

# Mac/Linux
brew services start postgresql

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Verificar conexión
psql -U postgres -d nova_db
```

### Issue: "Column does not exist" error

**Solución:**
```bash
# Ejecutar migraciones pendientes
npx prisma migrate deploy

# O resetear en desarrollo
npx prisma migrate reset
npm run prisma:seed
```

### Issue: Port 3000 already in use

**Solución:**
```bash
# Usar puerto diferente
npm run dev -- -p 3001

# O matar el proceso que lo usa
# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: "MODULE_NOT_FOUND: @prisma/client"

**Solución:**
```bash
# Reinstalar dependencias
rm -r node_modules
npm install

# Generar Prisma Client
npx prisma generate
```

## 📚 Project Structure

```
nova/
├── prisma/
│   ├── schema.prisma          # 📐 Modelos de BD
│   ├── migrations/            # 📜 Historial de cambios
│   └── seed.ts               # 🌱 Datos iniciales
├── src/
│   └── app/
│       ├── lib/
│       │   └── prisma.ts      # 🔌 Conexión a BD
│       ├── api/
│       │   ├── products/      # 🛍️ Endpoints de productos
│       │   ├── services/      # 🔧 Endpoints de servicios
│       │   └── contact/       # 📧 Endpoint de contacto
│       ├── page.tsx          # 🏠 Home (no modificar)
│       ├── layout.tsx        # 🎨 Layout global
│       └── globals.css       # 🎨 Estilos globales
├── public/                    # 📁 Assets estáticos
├── .env                      # 🔐 Variables de entorno
├── package.json             # 📦 Dependencias
├── tsconfig.json            # ⚙️ TypeScript config
├── next.config.ts           # ⚙️ Next.js config
├── tailwind.config.ts       # 🎨 Tailwind config
├── API_DOCS.md             # 📖 Documentación API
├── ARCHITECTURE.md         # 🏗️ Diagrama de arquitectura
├── BACKEND_SUMMARY.md      # 📋 Resumen del backend
└── README.md               # 📝 Readme del proyecto
```

## 🔐 Environment Variables

Disponibles en `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Next.js
NODE_ENV="development"  # o "production"

# Agrega según necesites:
# NEXT_PUBLIC_API_URL="http://localhost:3000"
# STRIPE_PUBLIC_KEY=""
# STRIPE_SECRET_KEY=""
```

## 🚢 Deployment

### Deploy to Vercel

1. Push código a GitHub
2. Conectar GitHub a Vercel
3. En Vercel Settings, añadir:
   ```
   DATABASE_URL → Tu PostgreSQL connection string
   ```
4. Deploy automático en cada push

### Self-Hosted

```bash
# 1. Construir
npm run build

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. Iniciar servidor
npm start
```

## 📞 Support & Documentation

Archivos de documentación incluidos:

- **[API_DOCS.md](./API_DOCS.md)** - Documentación completa de endpoints
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Diagrama de arquitectura y flujos
- **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** - Resumen de implementación
- **[README.md](./README.md)** - Readme del proyecto original

## ✅ Checklist Initial Setup

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] `npm install` ejecutado
- [ ] Base de datos `nova_db` creada
- [ ] `.env` configurado
- [ ] `npx prisma migrate deploy` ejecutado
- [ ] `npm run prisma:seed` ejecutado (opcional)
- [ ] `npm run dev` funcionando
- [ ] APIs responden correctamente

## 🎯 Next Steps

1. **Revisar** `API_DOCS.md` para usar los endpoints
2. **Conectar** frontend a las APIs
3. **Extender** con autenticación (NextAuth.js)
4. **Agregar** dashboard admin
5. **Integrar** pagos (Stripe)

---

**Última actualización:** 1 de Febrero de 2026
**Version:** 1.0.0 (Backend Base)
**Status:** Production Ready ✅
