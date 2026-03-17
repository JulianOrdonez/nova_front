'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';
import { useAuth } from '@/hooks/useAuth';

interface UserOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
}

interface UserOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: UserOrderItem[];
}

type AccountTab = 'perfil' | 'pedidos';

function normalizeNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

export default function AccountPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading, logout } = useAuth();
  const [tab, setTab] = useState<AccountTab>('pedidos');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const buildHeaders = useMemo(() => {
    const headers: Record<string, string> = {
      ...API_DEFAULT_HEADERS,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }, [token]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login?next=/mi-cuenta');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        return;
      }

      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const [ordersResponse, orderItemsResponse, productsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.orders, { headers: buildHeaders }),
          fetch(API_ENDPOINTS.orderItems, { headers: buildHeaders }),
          fetch(API_ENDPOINTS.products, { headers: API_DEFAULT_HEADERS }),
        ]);

        if (!ordersResponse.ok) {
          throw new Error('No se pudieron cargar tus pedidos.');
        }

        const allOrdersRaw = await ordersResponse.json();
        const allOrders = Array.isArray(allOrdersRaw) ? allOrdersRaw : [];

        const currentUserOrders = allOrders.filter((entry) => {
          const candidate = (entry ?? {}) as Record<string, unknown>;
          return normalizeString(candidate.user_id ?? candidate.userId) === String(user.id);
        });

        let orderItemsRaw: unknown[] = [];
        if (orderItemsResponse.ok) {
          const parsed = await orderItemsResponse.json();
          orderItemsRaw = Array.isArray(parsed) ? parsed : [];
        }

        let productsRaw: unknown[] = [];
        if (productsResponse.ok) {
          const parsed = await productsResponse.json();
          productsRaw = Array.isArray(parsed) ? parsed : [];
        }

        const productNameById = new Map<string, string>();
        for (const item of productsRaw) {
          const candidate = (item ?? {}) as Record<string, unknown>;
          const productId = normalizeString(candidate.id);
          if (!productId) continue;
          productNameById.set(productId, normalizeString(candidate.name) || `Producto #${productId}`);
        }

        const mappedOrders: UserOrder[] = currentUserOrders
          .map((entry) => {
            const candidate = (entry ?? {}) as Record<string, unknown>;
            const orderId = normalizeString(candidate.id ?? candidate.idOrder ?? candidate.order_id);

            const items = orderItemsRaw
              .filter((item) => {
                const row = (item ?? {}) as Record<string, unknown>;
                return normalizeString(row.order_id ?? row.orderId) === orderId;
              })
              .map((item) => {
                const row = (item ?? {}) as Record<string, unknown>;
                const productId = normalizeString(row.product_id ?? row.productId);
                return {
                  id: normalizeString(row.id ?? row.idOrderItem),
                  productId,
                  quantity: normalizeNumber(row.quantity),
                  price: normalizeNumber(row.price),
                  productName: productNameById.get(productId) || `Producto #${productId}`,
                };
              });

            return {
              id: orderId,
              status: normalizeString(candidate.status) || 'pending',
              total: normalizeNumber(candidate.total),
              createdAt: normalizeString(candidate.created_at ?? candidate.createdAt) || new Date().toISOString(),
              items,
            };
          })
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

        setOrders(mappedOrders);
      } catch (error) {
        setOrdersError(error instanceof Error ? error.message : 'No fue posible cargar tus pedidos.');
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user, buildHeaders]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 space-y-5 sticky top-24">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cuenta NOVA</p>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setTab('pedidos')}
                className={`w-full text-left px-3 py-2 rounded-lg border ${tab === 'pedidos' ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
              >
                Mis pedidos
              </button>
              <button
                type="button"
                onClick={() => setTab('perfil')}
                className={`w-full text-left px-3 py-2 rounded-lg border ${tab === 'perfil' ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}
              >
                Perfil
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace('/');
              }}
              className="w-full px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
            >
              Cerrar sesion
            </button>
          </div>
        </aside>

        <section className="lg:col-span-3">
          {tab === 'perfil' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-gray-200 p-8 bg-white">
              <h3 className="text-2xl font-bold mb-6">Perfil</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-500">Nombre</p>
                  <p className="font-semibold text-base">{user.name}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-500">Correo</p>
                  <p className="font-semibold text-base">{user.email}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-500">Tipo de usuario</p>
                  <p className="font-semibold text-base capitalize">{user.role}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-500">ID de cuenta</p>
                  <p className="font-semibold text-base">{user.id}</p>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'pedidos' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-gray-200 p-8 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Mis pedidos</h3>
                <Link href="/productos" className="text-sm underline text-gray-700 hover:text-black">
                  Seguir comprando
                </Link>
              </div>

              {ordersLoading && <p className="text-gray-600">Cargando pedidos...</p>}
              {ordersError && <p className="text-red-600">{ordersError}</p>}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                  Aun no tienes pedidos registrados.
                </div>
              )}

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString('es-CO')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">{order.status}</span>
                        <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {order.items.length === 0 ? (
                        <p className="text-sm text-gray-500">Sin items detallados.</p>
                      ) : (
                        order.items.map((item) => (
                          <div key={item.id || `${order.id}-${item.productId}`} className="flex items-center justify-between text-sm">
                            <p>{item.productName}</p>
                            <p className="text-gray-600">x{item.quantity} · ${item.price.toFixed(2)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
