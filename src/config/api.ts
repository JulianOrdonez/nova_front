/**
 * API Configuration
 * Centralized configuration for external FastAPI backend
 * 
 * Environment variables to set:
 * - NEXT_PUBLIC_API_URL: URL of the FastAPI backend (e.g., http://localhost:8000)
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://alembic-postgres-pruebas.onrender.com';

const NORMALIZED_API_URL = API_URL.replace(/\/+$/, '');

const API_DEFAULT_HEADERS = {
  ...(NORMALIZED_API_URL.includes('ngrok')
    ? { 'ngrok-skip-browser-warning': 'true' }
    : {}),
};

const API_ENDPOINTS = {
  // Products
  products: `${NORMALIZED_API_URL}/products`,
  productBySlug: (slug: string) => `${NORMALIZED_API_URL}/products/${slug}`,

  // Services
  services: `${NORMALIZED_API_URL}/services`,

  // Contact
  contact: `${NORMALIZED_API_URL}/api/contact`,
} as const;

export default API_ENDPOINTS;
export { API_URL, NORMALIZED_API_URL, API_DEFAULT_HEADERS };
