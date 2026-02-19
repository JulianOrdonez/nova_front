import { useState, useEffect } from 'react';
import type {
  Product,
  Service,
  UseProductsResult,
  UseServicesResult,
  UseProductBySlugResult,
} from '@/types';
import API_ENDPOINTS from '@/config/api';

/**
 * Hook: Fetch all active products from FastAPI backend
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.products);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

/**
 * Hook: Fetch all active services from FastAPI backend
 */
export function useServices(): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.services);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setServices(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch services');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
}

/**
 * Hook: Fetch a product by slug from FastAPI backend
 */
export function useProductBySlug(slug: string): UseProductBySlugResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.productBySlug(slug));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProduct(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Failed to fetch product');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
}

/**
 * Function: Submit contact message to FastAPI backend
 */
export async function submitContactMessage(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.contact, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      throw new Error(data.error || 'Failed to submit contact message');
    }
  } catch (err) {
    console.error('Error submitting contact message:', err);
    return false;
  }
}
