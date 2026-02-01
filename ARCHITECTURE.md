# NOVA Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│  (React Components - Frontend NOVA - No modifications)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    NEXT.JS 16.1.6                           │
│                   (App Router)                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (/api/*)                               │  │
│  │  ├── GET  /api/products                            │  │
│  │  ├── GET  /api/products/[slug]                     │  │
│  │  ├── GET  /api/services                            │  │
│  │  └── POST /api/contact                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma Client (Singleton)                         │  │
│  │  src/app/lib/prisma.ts                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TCP/PostgreSQL Protocol
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   POSTGRESQL 15+                            │
│              (localhost:5432/nova_db)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tables:                                              │  │
│  │  • Category       (id, name, slug)                  │  │
│  │  • Product        (id, name, slug, price, ...)      │  │
│  │  • Service        (id, title, slug, icon, ...)      │  │
│  │  • ContactMessage (id, name, email, message, ...)   │  │
│  │                                                      │  │
│  │ Indexes:                                             │  │
│  │  • Product.categoryId, Product.slug                 │  │
│  │  • ContactMessage.email, ContactMessage.createdAt   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### 1. Get Products Flow
```
Client (Browser)
    │
    ├─→ GET /api/products
    │
Next.js API Route
    │
    ├─→ prisma.product.findMany()
    │   ├─ WHERE: isActive = true
    │   ├─ INCLUDE: category relation
    │   └─ ORDER BY: createdAt DESC
    │
PostgreSQL
    │
    ├─→ SELECT * FROM "Product"
    │   WHERE "isActive" = true
    │   ORDER BY "createdAt" DESC
    │
Response
    │
    └─→ { success: true, data: [...], count: N }
```

### 2. Create Contact Message Flow
```
Client (Browser)
    │
    ├─→ POST /api/contact
    │   Body: { name, email, message }
    │
Validation Layer
    │
    ├─ Check name (1-100 chars)
    ├─ Check email (valid format)
    └─ Check message (1-5000 chars)
    │
Prisma ORM
    │
    ├─→ prisma.contactMessage.create()
    │
PostgreSQL
    │
    ├─→ INSERT INTO "ContactMessage"
    │   (name, email, message, isRead, createdAt)
    │   VALUES (...)
    │
Response
    │
    └─→ { success: true, data: { id, message } }
```

## File Structure & Responsibilities

```
nova/
│
├─ prisma/                          # Database Layer
│  ├─ schema.prisma                # Models definition
│  ├─ migrations/                  # Version control for DB
│  ├─ seed.ts                      # Initial data script
│  └─ .prisma/client/              # Generated Prisma Client
│
├─ src/app/
│  ├─ lib/
│  │  └─ prisma.ts                # Database Connection (Singleton)
│  │
│  └─ api/                         # API Endpoints Layer
│     ├─ products/
│     │  ├─ route.ts              # GET /api/products
│     │  └─ [slug]/route.ts       # GET /api/products/[slug]
│     ├─ services/
│     │  └─ route.ts              # GET /api/services
│     └─ contact/
│        └─ route.ts              # POST /api/contact
│
├─ .env                            # Environment Configuration
├─ package.json                    # Dependencies & Scripts
├─ prisma.config.ts               # Prisma Configuration
├─ API_DOCS.md                    # API Documentation
└─ BACKEND_SUMMARY.md             # This file
```

## Component Responsibility

### Prisma Client (src/app/lib/prisma.ts)
- **Responsibility:** Database connection management
- **Pattern:** Singleton
- **Purpose:** Prevent multiple PrismaClient instances
- **Usage:** Import and use in API routes
```typescript
import { prisma } from "@/app/lib/prisma";
```

### API Routes (src/app/api/*/route.ts)
- **Responsibility:** Handle HTTP requests/responses
- **Pattern:** Next.js App Router conventions
- **Purpose:** CRUD operations via REST API
- **Features:**
  - Input validation
  - Error handling
  - Consistent response format

### Schema (prisma/schema.prisma)
- **Responsibility:** Define data models
- **Pattern:** Prisma schema language
- **Purpose:** Single source of truth for DB structure
- **Includes:**
  - Models definition
  - Relationships
  - Field types
  - Constraints (unique, default, etc.)

## Request/Response Format

### Success Response (200, 201)
```json
{
  "success": true,
  "data": { /* entity or array */ },
  "count": 0  // optional, for lists
}
```

### Error Response (400, 404, 500)
```json
{
  "success": false,
  "error": "Error description"
}
```

## Database Schema Relations

```
┌─────────────┐              ┌─────────────┐
│  Category   │              │   Product   │
├─────────────┤              ├─────────────┤
│ id (PK)     │◄─────────────│ categoryId  │
│ name        │     1:N      │ (FK)        │
│ slug        │              │ name        │
│ createdAt   │              │ slug        │
│ updatedAt   │              │ description │
└─────────────┘              │ price       │
                             │ imageUrl    │
                             │ isActive    │
                             │ createdAt   │
                             │ updatedAt   │
                             └─────────────┘

┌──────────────────┐         ┌─────────────────┐
│    Service       │         │ ContactMessage  │
├──────────────────┤         ├─────────────────┤
│ id (PK)          │         │ id (PK)         │
│ title            │         │ name            │
│ slug             │         │ email           │
│ description      │         │ message         │
│ icon             │         │ isRead          │
│ isActive         │         │ createdAt       │
│ createdAt        │         └─────────────────┘
│ updatedAt        │
└──────────────────┘
```

## API Endpoint Specifications

### Products Endpoints

#### GET /api/products
```
Method:    GET
Auth:      None
Status:    200
Response:  { success: true, data: Product[], count: number }
Error:     { success: false, error: string }
```

#### GET /api/products/[slug]
```
Method:    GET
Params:    slug (string)
Auth:      None
Status:    200 | 404
Response:  { success: true, data: Product }
Error:     { success: false, error: string }
```

### Services Endpoint

#### GET /api/services
```
Method:    GET
Auth:      None
Status:    200
Response:  { success: true, data: Service[], count: number }
Error:     { success: false, error: string }
```

### Contact Endpoint

#### POST /api/contact
```
Method:    POST
Auth:      None
Status:    201 | 400 | 500
Body:      { name: string, email: string, message: string }
Response:  { success: true, data: { id, message } }
Error:     { success: false, error: string }
```

## Error Handling Strategy

1. **Validation Errors (400)**
   - Invalid input format
   - Missing required fields
   - Invalid slug parameter

2. **Not Found Errors (404)**
   - Product with slug not exists
   - Service not found

3. **Server Errors (500)**
   - Database connection failure
   - Unexpected exceptions
   - ORM query errors

All errors logged to console in development mode.

## Security Considerations

1. **SQL Injection Prevention**
   - Using Prisma ORM (parameterized queries)
   - No raw SQL queries

2. **Input Validation**
   - Server-side validation required
   - Type checking with TypeScript
   - Length and format validation

3. **Environment Secrets**
   - DATABASE_URL in .env
   - Never commit secrets
   - Use .env.local for local overrides

4. **Prepared Statements**
   - Prisma handles automatically
   - No string concatenation in queries

## Performance Optimization

1. **Database Indexes**
   ```sql
   @@index([categoryId])  -- Product queries by category
   @@index([slug])        -- Slug lookups
   @@index([email])       -- Contact message filtering
   ```

2. **Query Optimization**
   - Lazy loading of relations
   - Filtering by isActive before returning

3. **Client Singleton**
   - Prevents new connections per request
   - Reuses connection pool

4. **Pagination Ready**
   - Can add `skip` and `take` params to queries

## Deployment Considerations

### For Vercel
```
Environment Variables:
- DATABASE_URL → PostgreSQL connection string

Build Command:
- npx prisma migrate deploy (before build)
- npm run build

Recommended:
- Use Vercel Postgres or external PostgreSQL
- Set DATABASE_URL in Vercel Environment
```

### For Self-Hosted
```
1. Install PostgreSQL
2. Create nova_db database
3. Set DATABASE_URL in .env
4. Run: npx prisma migrate deploy
5. Run: npm run prisma:seed
6. npm run build
7. npm start
```

## Extensibility Roadmap

### Phase 2: Authentication
```
├─ Add User model
├─ Implement NextAuth.js
├─ Add auth middleware
└─ Protect admin routes
```

### Phase 3: E-commerce
```
├─ Add Cart model
├─ Add Order model
├─ Add OrderItem model
├─ Implement checkout API
└─ Add inventory tracking
```

### Phase 4: Payments
```
├─ Stripe integration
├─ Payment verification
├─ Invoice generation
└─ Refund handling
```

### Phase 5: Admin Dashboard
```
├─ Create /admin routes
├─ CRUD operations for Products
├─ CRUD operations for Services
├─ Contact message management
└─ Analytics & Reports
```

---

**Architecture Version:** 1.0
**Last Updated:** February 1, 2026
**Status:** Production Ready
