/**
 * API Configuration
 * Centralized configuration for external FastAPI backend
 * 
 * Environment variables to set:
 * - NEXT_PUBLIC_API_URL: URL of the FastAPI backend (e.g., http://localhost:8000)
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const API_ENDPOINTS = {
  // Products
  products: `${API_URL}/api/products`,
  productBySlug: (slug: string) => `${API_URL}/api/products/${slug}`,

  // Services
  services: `${API_URL}/api/services`,

  // Contact
  contact: `${API_URL}/api/contact`,
} as const;

export default API_ENDPOINTS;
export { API_URL };
