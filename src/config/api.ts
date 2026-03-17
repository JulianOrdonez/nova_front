/**
 * API Configuration
 * Centralized configuration for external FastAPI backend
 * 
 * Environment variables to set:
 * - NEXT_PUBLIC_API_URL: URL of the FastAPI backend (e.g., http://localhost:8000)
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://interlineal-toreutic-lyn.ngrok-free.dev';

const API_DEFAULT_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
} as const;

const API_ENDPOINTS = {
  // Products
  products: `${API_URL}/products`,
  productBySlug: (slug: string) => `${API_URL}/products/${slug}`,

  // Services
  services: `${API_URL}/services`,

  // Auth
  authLogin: `${API_URL}/login`,
  authRegister: `${API_URL}/users`,

  // Cart
  carritos: `${API_URL}/carritos`,
  cartItems: `${API_URL}/cart-items`,

  // Orders
  orders: `${API_URL}/orders`,
  orderItems: `${API_URL}/order-items`,
  payments: `${API_URL}/payments`,

  // Contact
  contact: `${API_URL}/api/contact`,
  // Temporary compatibility alias while callers migrate to `cartItems`
  CartItems: `${API_URL}/cart-items`,
} as const;

export default API_ENDPOINTS;
export { API_URL, API_DEFAULT_HEADERS };
