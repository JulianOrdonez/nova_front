# Despliegue en Firebase Hosting (capa gratuita) - Cambios aplicados

## Contexto
Este proyecto se desplegó en **Firebase Hosting Spark (gratis)**, que sirve contenido estático (archivos HTML/CSS/JS/imagenes) y no ejecuta SSR de Next.js por sí solo.

El síntoma inicial era que el dominio mostraba la pantalla de bienvenida de Firebase en lugar de la aplicación.

---

## Objetivo de los cambios
1. Publicar la app real en Firebase (en lugar del `index.html` de plantilla).
2. Mantener el despliegue dentro de la capa gratuita.
3. Evitar cambios grandes en la lógica de negocio.
4. Mantener consumo del backend externo (otro repo) desde frontend.

---

## Cambios realizados

### 1) Next.js configurado para exportación estática
**Archivo:** `next.config.ts`

Se agregaron estas opciones:
- `output: 'export'`
- `images.unoptimized: true`

**Por qué:**
- `output: 'export'` genera una salida estática en carpeta `out` compatible con Firebase Hosting clásico.
- `images.unoptimized: true` evita depender del optimizador de imágenes en servidor de Next, que no existe en hosting estático.

**Implicación:**
- Se pierde optimización de imágenes on-the-fly del servidor Next. Las imágenes se sirven tal cual.

---

### 2) Firebase ahora publica `out` (no `public`)
**Archivo:** `firebase.json`

Cambios principales:
- `hosting.public` pasó de `public` a `out`.
- Se removió rewrite genérico a `/index.html`.

**Por qué:**
- `public` contenía la plantilla default de Firebase (`public/index.html`).
- La salida real de Next exportado vive en `out`.

**Implicación:**
- El archivo `public/index.html` deja de afectar el sitio en producción.

---

### 3) Eliminación de ruta dinámica incompatible con export estático
**Archivo eliminado:** `src/app/productos/[slug]/page.tsx`

**Por qué:**
- Con `output: 'export'`, el segmento dinámico `[slug]` en este setup generó error de build y no exportaba correctamente.

**Implicación:**
- Ya no existe la ruta ` /productos/:slug ` en forma de segmento dinámico de App Router.

---

### 4) Nueva ruta estática de detalle por query string
**Nuevos archivos:**
- `src/app/productos/detalle/page.tsx`
- `src/app/productos/detalle/ProductDetailContent.tsx`
- `src/components/products/ProductDetailPageClient.tsx`

**Qué hace ahora:**
- El detalle se abre como ` /productos/detalle?slug=mi-slug `.
- Se lee el `slug` por query param y se consulta backend externo para cargar el producto.

**Por qué:**
- Es compatible con hosting estático.
- Reutiliza casi toda la experiencia de detalle sin requerir SSR.

**Implicaciones:**
- Cambia el formato de URL del detalle.
- Si falta el parámetro `slug`, se muestra pantalla de error amigable.

---

### 5) Actualización de enlaces a detalle
**Archivos modificados:**
- `src/app/productos/page.tsx`
- `src/components/sections/ProductsSection.tsx`

**Cambio:**
- Antes: enlaces a ` /productos/${product.slug} `
- Ahora: enlaces a ` /productos/detalle?slug=${encodeURIComponent(product.slug)} `

**Por qué:**
- Mantener navegación funcional en sitio 100% estático.

---

## Validación ejecutada
Se validó localmente y en deploy:
1. `npm run build` exitoso con todas las rutas estáticas.
2. `firebase deploy` exitoso.
3. Sitio publicado sin pantalla default de Firebase.

---

## Impacto en funcionamiento

### Lo que se mantiene
- UI general del sitio.
- Consumo del backend externo para productos/servicios/contacto.
- Flujo de navegación principal.

### Lo que cambia
- URL de detalle de producto (ahora por query string).
- Sin SSR en el frontend desplegado en Firebase Spark.
- Sin optimización de imágenes por servidor Next.

### Riesgos/consideraciones
- SEO de páginas de detalle puede ser menor frente a ruta SSR + contenido server-side.
- Si el backend externo falla o tiene CORS incorrecto, el detalle/listados podrían fallar en cliente.
- Al depender de query param, enlaces externos deberían usar el nuevo formato.

---

## Recomendaciones para Frontend

1. **Revisar enlaces hardcodeados**
   - Verificar que cualquier link manual a detalle use formato ` /productos/detalle?slug=... `.

2. **CORS del backend**
   - Confirmar que dominio de Firebase (`*.web.app` / `*.firebaseapp.com`) esté permitido en backend.

3. **Variables de entorno**
   - Confirmar valor de `NEXT_PUBLIC_API_URL` en entornos donde aplique.

4. **Monitoreo de errores en cliente**
   - Recomendada integración con logging/observabilidad para errores de fetch.

5. **Si el equipo quiere volver a URL bonita tipo `/productos/slug`**
   - Opción A (gratis pero más trabajo): estrategia estática adicional de rutas pre-generadas.
   - Opción B (más flexible): migrar a despliegue con SSR (Hosting + backend serverless / App Hosting / otra plataforma).

---

## Cómo desplegar de ahora en adelante
Desde raíz del proyecto:
1. `npm run build`
2. `firebase deploy`

> Nota: el deploy toma contenido de `out` según `firebase.json`.

---

## Resumen ejecutivo
Se adaptó el frontend para ejecutarse como **sitio estático puro** en Firebase Hosting gratuito, minimizando cambios funcionales y conservando integración con backend externo. El principal ajuste técnico fue reemplazar la ruta dinámica de detalle por una ruta estática con query param para cumplir restricciones de `output: 'export'`.
