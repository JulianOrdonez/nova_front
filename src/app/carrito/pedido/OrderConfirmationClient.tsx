'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';
import { useAuth } from '@/hooks/useAuth';

const CHECKOUT_PROFILE_STORAGE_KEY = 'nova_last_checkout_profile';

interface CheckoutProfile {
  orderId?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
  };
  payment?: {
    methodLabel?: string;
    cardLast4?: string;
  };
}

interface OrderDetail {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    productName?: string;
  }>;
}

function getString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function getNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOrder(raw: unknown): OrderDetail {
  const candidate = (raw ?? {}) as Record<string, unknown>;

  return {
    id: getString(candidate.id ?? candidate.order_id ?? candidate.idOrder ?? candidate.id_order),
    userId: getString(candidate.user_id ?? candidate.userId),
    status: getString(candidate.status, 'pending'),
    total: getNumber(candidate.total, 0),
    createdAt: getString(candidate.created_at ?? candidate.createdAt, new Date().toISOString()),
    items: [],
  };
}

function normalizeOrderItems(rawItems: unknown[]): OrderDetail['items'] {
  return rawItems
    .map((item) => {
      const candidate = (item ?? {}) as Record<string, unknown>;
      const product = (candidate.product ?? {}) as Record<string, unknown>;

      return {
        productId: getString(candidate.product_id ?? candidate.productId),
        quantity: getNumber(candidate.quantity, 0),
        price: getNumber(candidate.price, 0),
        productName: typeof product.name === 'string' ? product.name : undefined,
      };
    })
    .filter((item) => item.productId && item.quantity > 0);
}

export const OrderConfirmationClient: React.FC = () => {
  const params = useParams();
  const { token } = useAuth();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [checkoutProfile, setCheckoutProfile] = useState<CheckoutProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(CHECKOUT_PROFILE_STORAGE_KEY);
      if (!storedProfile) {
        return;
      }

      const parsed = JSON.parse(storedProfile) as CheckoutProfile;
      if (parsed?.orderId && String(parsed.orderId) !== String(orderId)) {
        return;
      }

      setCheckoutProfile(parsed);
    } catch {
      setCheckoutProfile(null);
    }
  }, [orderId]);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No se encontró información del pedido');
        setLoading(false);
        return;
      }

      try {
        const authHeaders: Record<string, string> = {
          ...API_DEFAULT_HEADERS,
        };

        if (token) {
          authHeaders.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_ENDPOINTS.orders}/${orderId}`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el pedido');
        }

        const data = await response.json();
        
        // Los items vienen de otro endpoint
        let itemsData: unknown[] = [];
        try {
          const itemsResponse = await fetch(`${API_ENDPOINTS.orderItems}?order_id=${orderId}`, {
            headers: authHeaders,
          });
          
          if (itemsResponse.ok) {
            const rawItems = await itemsResponse.json();
            const allItems: unknown[] = Array.isArray(rawItems) ? rawItems : [];
            itemsData = allItems.filter((entry) => {
              const candidate = (entry ?? {}) as Record<string, unknown>;
              return getString(candidate.order_id ?? candidate.orderId) === String(orderId);
            });
          }
        } catch (err) {
          console.error('Error loading order items:', err);
        }

        const normalizedOrder = normalizeOrder(data);
        const normalizedItems = normalizeOrderItems(Array.isArray(itemsData) ? itemsData : []);

        const orderWithItems: OrderDetail = {
          ...normalizedOrder,
          items: normalizedItems,
        };

        setOrder(orderWithItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-bold">Error</h1>
        <p className="text-gray-600 text-lg">{error || 'Pedido no encontrado'}</p>
        <Link href="/productos">
          <Button label="Volver a productos" variant="primary" size="lg" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 text-lg">
            Tu pedido ha sido recibido y será procesado en breve
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Detalles del Pedido</h2>

          <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Número de Pedido:</span>
              <span className="font-bold text-lg"># {order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estado:</span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                {order.status === 'pending' ? 'Pendiente' : order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Artículos ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium">{item.productName || `Producto #${item.productId}`}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-black text-white px-6 py-4 rounded-xl flex justify-between items-center">
            <span className="text-lg font-semibold">Total: </span>
            <span className="text-3xl font-bold">${order.total.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 text-blue-900">Próximos Pasos</h3>
          <ul className="space-y-3 text-blue-900">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <p>Recibirás un correo de confirmación con los detalles de tu pedido</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <p>Te notificaremos cuando tu pedido sea procesado y enviado</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <p>Recibirás información de seguimiento del envío</p>
            </li>
          </ul>
        </motion.div>

        {checkoutProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-xl font-bold mb-5">Información de entrega y pago</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="text-gray-500 font-semibold uppercase tracking-wide">Cliente</p>
                <p className="text-gray-900">{checkoutProfile.customer?.fullName || 'No especificado'}</p>
                <p className="text-gray-700">{checkoutProfile.customer?.email || 'No especificado'}</p>
                <p className="text-gray-700">{checkoutProfile.customer?.phone || 'No especificado'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-500 font-semibold uppercase tracking-wide">Pago</p>
                <p className="text-gray-900">{checkoutProfile.payment?.methodLabel || 'No especificado'}</p>
                {checkoutProfile.payment?.cardLast4 && (
                  <p className="text-gray-700">Tarjeta terminada en •••• {checkoutProfile.payment.cardLast4}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <p className="text-gray-500 font-semibold uppercase tracking-wide">Dirección de envío</p>
                <p className="text-gray-900">{checkoutProfile.shipping?.addressLine1 || 'No especificado'}</p>
                {checkoutProfile.shipping?.addressLine2 && (
                  <p className="text-gray-700">{checkoutProfile.shipping.addressLine2}</p>
                )}
                <p className="text-gray-700">
                  {checkoutProfile.shipping?.city || ''}
                  {checkoutProfile.shipping?.city && checkoutProfile.shipping?.state ? ', ' : ''}
                  {checkoutProfile.shipping?.state || ''}
                  {(checkoutProfile.shipping?.city || checkoutProfile.shipping?.state) && checkoutProfile.shipping?.postalCode ? ' - ' : ''}
                  {checkoutProfile.shipping?.postalCode || ''}
                </p>
                <p className="text-gray-700">{checkoutProfile.shipping?.country || ''}</p>
                {checkoutProfile.shipping?.notes && (
                  <p className="text-gray-700">Notas: {checkoutProfile.shipping.notes}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/productos" className="flex-1">
            <Button label="Continuar Comprando" variant="outline" size="lg" className="w-full" />
          </Link>
          <Link href="/" className="flex-1">
            <Button label="Ir al Inicio" variant="primary" size="lg" className="w-full" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
