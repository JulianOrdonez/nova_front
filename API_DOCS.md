# NOVA Backend API Documentation

## Resumen
Backend profesional de NOVA con PostgreSQL, Prisma ORM y Next.js API Routes.

## 🔧 Stack Tecnológico
- **Framework:** Next.js 16.1.6 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma 5.20.0
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS

## 📋 Endpoints Disponibles

### 1. Productos

#### GET `/api/products`
Obtiene todos los productos activos.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": 299.99,
      "imageUrl": "string",
      "categoryId": "string",
      "isActive": true,
      "createdAt": "2026-02-01T...",
      "updatedAt": "2026-02-01T...",
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "count": 3
}
```

#### GET `/api/products/[slug]`
Obtiene un producto específico por slug.

**Parámetros:**
- `slug` (string, requerido): El slug del producto

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "NOVA Pro Wireless",
    "slug": "nova-pro-wireless",
    "description": "Audífonos inalámbricos premium...",
    "price": 299.99,
    "imageUrl": "/products/nova-pro-wireless.jpg",
    "categoryId": "string",
    "isActive": true,
    "createdAt": "2026-02-01T...",
    "updatedAt": "2026-02-01T...",
    "category": {
      "id": "string",
      "name": "Audífonos",
      "slug": "audifonos"
    }
  }
}
```

### 2. Servicios

#### GET `/api/services`
Obtiene todos los servicios activos.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "Garantía Premium",
      "slug": "garantia-premium",
      "description": "Cobertura completa de 2 años...",
      "icon": "shield-check",
      "isActive": true,
      "createdAt": "2026-02-01T..."
    }
  ],
  "count": 4
}
```

### 3. Contacto

#### POST `/api/contact`
Recibe un mensaje de contacto.

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "message": "Me interesa conocer más sobre sus productos"
}
```

**Validación:**
- `name`: string, 1-100 caracteres
- `email`: string válido, 1-100 caracteres
- `message`: string, 1-5000 caracteres

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "message": "Message received successfully"
  }
}
```

**Respuesta error (400):**
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

## 📊 Modelos de Base de Datos

### Product
```
- id (String, @id)
- name (String, @unique)
- slug (String, @unique)
- description (String)
- price (Float, opcional)
- imageUrl (String)
- categoryId (String, FK)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Category
```
- id (String, @id)
- name (String, @unique)
- slug (String, @unique)
- products (Product[])
- createdAt (DateTime)
- updatedAt (DateTime)
```

### Service
```
- id (String, @id)
- title (String, @unique)
- slug (String, @unique)
- description (String)
- icon (String)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### ContactMessage
```
- id (String, @id)
- name (String)
- email (String)
- message (String)
- isRead (Boolean)
- createdAt (DateTime)
```

## 🚀 Comandos Útiles

```bash
# Desarrollar
npm run dev

# Compilar
npm run build

# Iniciar producción
npm start

# Generar Prisma Client
npx prisma generate

# Crear migración
npx prisma migrate dev --name <name>

# Resetear base de datos
npx prisma migrate reset

# Poblar base de datos con datos semilla
npm run prisma:seed

# Abrir Prisma Studio (GUI)
npx prisma studio
```

## 🔐 Configuración

**Archivo `.env`:**
```
DATABASE_URL="postgresql://postgres:1029@localhost:5432/nova_db"
```

## 📈 Próximas Fases

1. ✅ Backend base con modelos
2. ✅ API Routes funcionales
3. ⏳ Autenticación con NextAuth.js
4. ⏳ Dashboard admin
5. ⏳ Integración de pagos (Stripe)
6. ⏳ Sistema de carrito e-commerce
7. ⏳ Órdenes y facturación

## 🎯 Principios de Arquitectura

- **Performance first:** Lazy loading, índices en BD
- **Seguridad:** Validación en servidor, SQL injection prevention
- **Escalabilidad:** Modelos preparados para crecimiento
- **Profesionalismo:** Código limpio, bien documentado
- **Mantenibilidad:** Singleton pattern, error handling consistente

---

**Última actualización:** Febrero 1, 2026
**Versión:** 1.0.0 (Backend Base)
