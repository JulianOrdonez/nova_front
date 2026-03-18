'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Cart, CartItem, Product } from '@/types';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';
import { useAuth } from './useAuth';
import { ProductModel } from '@/models/ProductModel';

const CART_STORAGE_KEY = 'nova_cart';
const TEMP_CART_ID = 'temp_cart';

interface RemoteCartItem {
  id?: string | number;
  cart_item_id?: string | number;
  cartItemId?: string | number;
  idCartItem?: string | number;
  cart_id?: string | number;
  cartId?: string | number;
  carrito_id?: string | number;
  product_id?: number;
  productId?: number;
  quantity?: number;
  product?: unknown;
}

interface RemoteCart {
  cart_id?: string | number;
  cartId?: string | number;
  idCarrito?: string | number;
  carrito_id?: string | number;
  id?: string | number;
  user_id?: string | number;
  userId?: string | number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface UseCartResult {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  totalPrice: number;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<string>;
}

const CartContext = createContext<UseCartResult | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useProvideCart();
  return React.createElement(CartContext.Provider, { value }, children);
};

export const useCart = (): UseCartResult => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

function useProvideCart(): UseCartResult {
  const { user, token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousUserRef = useRef<string | number | null | undefined>(undefined);

  const buildHeaders = useCallback(
    (options?: { includeJson?: boolean }): Record<string, string> => {
      const headers: Record<string, string> = {
        ...API_DEFAULT_HEADERS,
      };

      if (options?.includeJson) {
        headers['Content-Type'] = 'application/json';
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return headers;
    },
    [token]
  );

  const getErrorMessage = useCallback(async (response: Response): Promise<string> => {
    const fallback = `Request failed: ${response.status}`;

    const normalizeErrorValue = (value: unknown): string | null => {
      if (typeof value === 'string') {
        const text = value.trim();
        return text.length ? text : null;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (Array.isArray(value)) {
        const parts = value
          .map((entry) => normalizeErrorValue(entry))
          .filter((entry): entry is string => Boolean(entry));
        return parts.length ? parts.join(', ') : null;
      }

      if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;

        for (const key of ['detail', 'error', 'message', 'msg']) {
          if (key in record) {
            const normalized = normalizeErrorValue(record[key]);
            if (normalized) {
              return normalized;
            }
          }
        }

        try {
          return JSON.stringify(record);
        } catch {
          return null;
        }
      }

      return null;
    };

    try {
      const errorData = await response.json();
      return normalizeErrorValue(errorData) || fallback;
    } catch {
      return fallback;
    }
  }, []);

  const normalizeCartItem = useCallback((raw: unknown): CartItem | null => {
    const item = (raw ?? {}) as RemoteCartItem;
    const productId = Number(item.product_id ?? item.productId ?? 0);
    const quantity = Number(item.quantity ?? 0);

    if (productId <= 0 || quantity <= 0) {
      return null;
    }

    const normalizedItem: CartItem = {
      cartItemId: item.cart_item_id ?? item.cartItemId ?? item.idCartItem ?? item.id,
      productId,
      quantity,
    };

    if (item.product && typeof item.product === 'object') {
      normalizedItem.product = ProductModel.fromJson(item.product);
    }

    return normalizedItem;
  }, []);

  const normalizeCart = useCallback((raw: unknown, fallbackId: string | number): Cart => {
    const candidate = (raw ?? {}) as RemoteCart;
    return {
      id: candidate.cart_id ?? candidate.cartId ?? candidate.idCarrito ?? candidate.carrito_id ?? candidate.id ?? fallbackId,
      userId: candidate.user_id ? String(candidate.user_id) : candidate.userId ? String(candidate.userId) : undefined,
      items: [],
      createdAt: String(candidate.created_at ?? candidate.createdAt ?? new Date().toISOString()),
      updatedAt: String(candidate.updated_at ?? candidate.updatedAt ?? new Date().toISOString()),
    };
  }, []);

  const normalizeRemoteUserId = useCallback((raw: unknown): string | null => {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const candidate = raw as RemoteCart;
    const userId = candidate.user_id ?? candidate.userId;
    if (userId === undefined || userId === null || userId === '') {
      return null;
    }

    return String(userId);
  }, []);

  const selectCartForCurrentUser = useCallback((raw: unknown): RemoteCart | null => {
    const currentUserId = user?.id ? String(user.id) : null;

    if (Array.isArray(raw)) {
      if (!currentUserId) {
        return (raw[0] as RemoteCart) ?? null;
      }

      const exactMatch = raw.find((entry) => normalizeRemoteUserId(entry) === currentUserId);
      if (exactMatch) {
        return exactMatch as RemoteCart;
      }

      return null;
    }

    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const candidate = raw as RemoteCart;
    const candidateUserId = normalizeRemoteUserId(candidate);

    if (!currentUserId) {
      return candidate;
    }

    if (candidateUserId && candidateUserId !== currentUserId) {
      return null;
    }

    return candidate;
  }, [user?.id, normalizeRemoteUserId]);

  const mergeItemsByProduct = useCallback((items: CartItem[]): CartItem[] => {
    const grouped = new Map<number, CartItem>();

    for (const item of items) {
      if (!item.productId || item.productId <= 0 || item.quantity <= 0) {
        continue;
      }

      const existing = grouped.get(item.productId);
      if (!existing) {
        grouped.set(item.productId, { ...item });
        continue;
      }

      existing.quantity += item.quantity;
      if (!existing.product && item.product) {
        existing.product = item.product;
      }
      if (!existing.cartItemId && item.cartItemId) {
        existing.cartItemId = item.cartItemId;
      }
    }

    return Array.from(grouped.values());
  }, []);

  // Función para cargar productos específicos del carrito por sus IDs
  const loadProductsByIds = useCallback(async (productIds: number[]): Promise<Map<number, Product>> => {
    const productMap = new Map<number, Product>();
    
    if (productIds.length === 0) {
      return productMap;
    }

    try {
      // Cargar cada producto por su ID
      // TODO: Idealmente el backend debería ofrecer GET /products?ids=1,2,3 para batch loading
      const productPromises = productIds.map(async (productId) => {
        try {
          const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
            headers: API_DEFAULT_HEADERS,
          });
          
          if (response.ok) {
            const data = await response.json();
            const product = ProductModel.fromJson(data);
            productMap.set(productId, product);
          }
        } catch (err) {
          console.warn(`Failed to load product ${productId}:`, err);
        }
      });

      await Promise.all(productPromises);
    } catch (err) {
      console.error('Error loading products:', err);
    }

    return productMap;
  }, []);

  const enrichItemsWithProducts = useCallback(async (items: CartItem[]): Promise<CartItem[]> => {
    if (items.length === 0) {
      return [];
    }

    const missingProductIds = Array.from(
      new Set(
        items
          .filter((item) => !item.product && item.productId > 0)
          .map((item) => item.productId)
      )
    );

    if (missingProductIds.length === 0) {
      return items;
    }

    const productsMap = await loadProductsByIds(missingProductIds);
    return items.map((item) => ({
      ...item,
      product: item.product ?? productsMap.get(item.productId),
    }));
  }, [loadProductsByIds]);

  const readLocalCartSnapshot = useCallback(async (): Promise<Cart> => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        return createEmptyCart(TEMP_CART_ID);
      }

      const parsed = JSON.parse(stored) as Cart;
      const normalizedItems = mergeItemsByProduct(
        (Array.isArray(parsed.items) ? parsed.items : [])
          .map((item) => {
            const rawItem = item as unknown as {
              productId?: number;
              product_id?: number;
              quantity?: number;
            };

            const productId = Number(rawItem.productId ?? rawItem.product_id ?? 0);
            const quantity = Number(rawItem.quantity ?? 0);
            if (productId <= 0 || quantity <= 0) {
              return null;
            }

            return {
              productId,
              quantity,
            } as CartItem;
          })
          .filter((item): item is CartItem => item !== null)
      );

      const enrichedItems = await enrichItemsWithProducts(normalizedItems);

      return {
        ...parsed,
        id: parsed.id || TEMP_CART_ID,
        items: enrichedItems,
        createdAt: parsed.createdAt || new Date().toISOString(),
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      return createEmptyCart(TEMP_CART_ID);
    }
  }, [enrichItemsWithProducts, mergeItemsByProduct]);

  const fetchRemoteCartSnapshot = useCallback(async (): Promise<Cart> => {
    if (!user) {
      return createEmptyCart(TEMP_CART_ID);
    }

    const authHeaders = buildHeaders();

    // Prefer querying by user_id when the backend supports filtering.
    let response = await fetch(`${API_ENDPOINTS.carritos}?user_id=${encodeURIComponent(String(user.id))}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      response = await fetch(API_ENDPOINTS.carritos, {
        headers: authHeaders,
      });
    }

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const data = await response.json();
    const cartData = selectCartForCurrentUser(data);

    const remoteCartId = cartData?.cart_id ?? cartData?.cartId ?? cartData?.id;

    if (!remoteCartId) {
      return createEmptyCart(`user_${user.id}`);
    }

    const normalizedCart = normalizeCart(cartData, `user_${user.id}`);

    const snapCartIdStr = String(normalizedCart.id);
    let rawSnapItems: unknown[] = [];

    // Try filtered fetch first; /cart-items has no documented filter param so fall back to all + client-side filter
    const snapFilteredResp = await fetch(`${API_ENDPOINTS.cartItems}?cart_id=${snapCartIdStr}`, {
      headers: authHeaders,
    });

    const snapSourceResp = snapFilteredResp.ok
      ? snapFilteredResp
      : await fetch(API_ENDPOINTS.cartItems, { headers: authHeaders });

    if (snapSourceResp.ok) {
      const itemsData = await snapSourceResp.json();
      const all: unknown[] = Array.isArray(itemsData) ? itemsData : [];
      rawSnapItems = all.filter((item) => {
        const ri = item as RemoteCartItem;
        return String(ri.cart_id ?? ri.carrito_id ?? ri.cartId ?? '') === snapCartIdStr;
      });
    }

    const items = mergeItemsByProduct(
      rawSnapItems
        .map((item) => normalizeCartItem(item))
        .filter((item): item is CartItem => item !== null)
    );

    const enrichedItems = await enrichItemsWithProducts(items);

    return {
      ...normalizedCart,
      userId: String(user.id),
      items: enrichedItems,
    };
  }, [user, buildHeaders, getErrorMessage, normalizeCart, normalizeCartItem, mergeItemsByProduct, enrichItemsWithProducts, selectCartForCurrentUser]);

  const loadCartFromAPI = useCallback(async () => {
    try {
      if (!user) return;
      const remoteCart = await fetchRemoteCartSnapshot();
      setCart(remoteCart);
    } catch (err) {
      console.error('Error loading cart from API:', err);
      setCart(createEmptyCart(user?.id ? `user_${user.id}` : TEMP_CART_ID));
    }
  }, [user, fetchRemoteCartSnapshot]);

  const loadCartFromLocalStorage = useCallback(async () => {
    const localCart = await readLocalCartSnapshot();
    setCart(localCart);
  }, [readLocalCartSnapshot]);

  const saveCartLocally = useCallback((updatedCart: Cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, []);

  const saveCartToAPI = useCallback(
    async (updatedCart: Cart): Promise<Cart> => {
      if (!user) {
        return updatedCart;
      }

      try {
        const authHeaders = buildHeaders();

        // Primero crear/obtener el carrito
        let cartId: string | number | undefined = updatedCart.id;
        const cartUserMismatch =
          updatedCart.userId !== undefined &&
          updatedCart.userId !== null &&
          String(updatedCart.userId) !== String(user.id);

        if (cartUserMismatch) {
          cartId = undefined;
        }

        const normalizedCartId = cartId !== undefined && cartId !== null ? String(cartId) : '';
        const requiresNewCart =
          cartUserMismatch ||
          !normalizedCartId || normalizedCartId === TEMP_CART_ID || normalizedCartId.startsWith('user_');
        if (requiresNewCart) {
          const parsedUserId = Number(user.id);

          // Crear nuevo carrito
          const createResponse = await fetch(API_ENDPOINTS.carritos, {
            method: 'POST',
            headers: buildHeaders({ includeJson: true }),
            body: JSON.stringify({
              user_id: Number.isFinite(parsedUserId) ? parsedUserId : user.id,
            }),
          });

          if (!createResponse.ok) {
            throw new Error(await getErrorMessage(createResponse));
          }

          const cartData = await createResponse.json();
          cartId = cartData.cart_id ?? cartData.cartId ?? cartData.idCarrito ?? cartData.carrito_id ?? cartData.id;

          if (!cartId) {
            throw new Error('No se pudo obtener el cart_id del carrito creado');
          }

          updatedCart.id = cartId;
        }

        const cartIdStr = String(cartId);
        let rawRemoteItems: unknown[] = [];

        // Try filtered fetch first; fall back to all items + client-side filter
        const filteredItemsResp = await fetch(`${API_ENDPOINTS.cartItems}?cart_id=${cartIdStr}`, {
          headers: authHeaders,
        });

        const sourceResp = filteredItemsResp.ok
          ? filteredItemsResp
          : await fetch(API_ENDPOINTS.cartItems, { headers: authHeaders });

        if (sourceResp.ok) {
          const data = await sourceResp.json();
          const all: unknown[] = Array.isArray(data) ? data : [];
          rawRemoteItems = all.filter((item) => {
            const ri = item as RemoteCartItem;
            return String(ri.cart_id ?? ri.carrito_id ?? ri.cartId ?? '') === cartIdStr;
          });
        }

        const remoteItems: RemoteCartItem[] = rawRemoteItems as RemoteCartItem[];

        const remoteByProduct = new Map<number, RemoteCartItem[]>();
        for (const remoteItem of remoteItems) {
          const productId = Number(remoteItem.product_id ?? remoteItem.productId ?? 0);
          const remoteItemId = remoteItem.cart_item_id ?? remoteItem.cartItemId ?? remoteItem.idCartItem ?? remoteItem.id;

          if (productId <= 0 || remoteItemId === undefined || remoteItemId === null) {
            continue;
          }
          const current = remoteByProduct.get(productId) || [];
          current.push(remoteItem);
          remoteByProduct.set(productId, current);
        }

        const itemsWithRemoteId: CartItem[] = [];

        for (const item of updatedCart.items) {
          if (!item.productId || item.productId <= 0) {
            continue;
          }

          const candidates = remoteByProduct.get(item.productId) || [];
          const matchedRemote = candidates.shift();

          if (candidates.length === 0) {
            remoteByProduct.delete(item.productId);
          } else {
            remoteByProduct.set(item.productId, candidates);
          }

          if (matchedRemote) {
            const remoteQuantity = Number(matchedRemote.quantity ?? 1);

            if (remoteQuantity !== item.quantity) {
              const matchedItemId = matchedRemote.cart_item_id ?? matchedRemote.cartItemId ?? matchedRemote.idCartItem ?? matchedRemote.id;
              const updateResponse = await fetch(`${API_ENDPOINTS.cartItems}/${matchedItemId}`, {
                method: 'PUT',
                headers: buildHeaders({ includeJson: true }),
                body: JSON.stringify({
                  cart_id: cartId,
                  product_id: item.productId,
                  quantity: item.quantity,
                }),
              });

              if (!updateResponse.ok) {
                throw new Error(await getErrorMessage(updateResponse));
              }
            }

            itemsWithRemoteId.push({
              ...item,
              cartItemId: matchedRemote.cart_item_id ?? matchedRemote.cartItemId ?? matchedRemote.idCartItem ?? matchedRemote.id,
            });
            continue;
          }

          const createItemResponse = await fetch(API_ENDPOINTS.cartItems, {
            method: 'POST',
            headers: buildHeaders({ includeJson: true }),
            body: JSON.stringify({
              cart_id: cartId,
              product_id: item.productId,
              quantity: item.quantity,
            }),
          });

          if (!createItemResponse.ok) {
            throw new Error(await getErrorMessage(createItemResponse));
          }

          const createdItem = await createItemResponse.json().catch(() => null);
          itemsWithRemoteId.push({
            ...item,
            cartItemId: createdItem?.cart_item_id ?? createdItem?.cartItemId ?? createdItem?.idCartItem ?? createdItem?.id,
          });
        }

        // Eliminar los items remotos que ya no están en el carrito local
        for (const leftovers of remoteByProduct.values()) {
          for (const leftover of leftovers) {
            const leftoverItemId = leftover.cart_item_id ?? leftover.cartItemId ?? leftover.idCartItem ?? leftover.id;

            if (leftoverItemId === undefined || leftoverItemId === null) {
              continue;
            }

            const deleteResponse = await fetch(`${API_ENDPOINTS.cartItems}/${leftoverItemId}`, {
              method: 'DELETE',
              headers: authHeaders,
            });

            if (!deleteResponse.ok) {
              throw new Error(await getErrorMessage(deleteResponse));
            }
          }
        }

        if (cartId === undefined || cartId === null) {
          throw new Error('No se pudo resolver el cart_id del usuario');
        }

        const finalItems = await enrichItemsWithProducts(itemsWithRemoteId);
        const synchronizedCart = { ...updatedCart, id: cartId, userId: String(user.id), items: finalItems };
        setCart(synchronizedCart);
        return synchronizedCart;
      } catch (err) {
        console.error('Error saving cart to API:', err);
        // Still save locally as fallback
        saveCartLocally(updatedCart);
        return updatedCart;
      }
    },
    [user, buildHeaders, saveCartLocally, getErrorMessage, enrichItemsWithProducts]
  );

  const mergeLocalCartIntoRemote = useCallback(async () => {
    if (!user) {
      return;
    }

    const guestCart = await readLocalCartSnapshot();
    if (!guestCart.items.length) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    try {
      const remoteCart = await fetchRemoteCartSnapshot();
      const mergedItems = mergeItemsByProduct([...(remoteCart.items || []), ...guestCart.items]);

      const mergedCart: Cart = {
        ...remoteCart,
        id: remoteCart.id || `user_${user.id}`,
        userId: String(user.id),
        items: mergedItems,
      };

      await saveCartToAPI(mergedCart);
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error('Error merging local cart into remote cart:', err);
    }
  }, [user, readLocalCartSnapshot, fetchRemoteCartSnapshot, mergeItemsByProduct, saveCartToAPI]);

  const addItem = useCallback(
    async (productId: number, quantity: number) => {
      if (!productId || productId <= 0 || quantity <= 0) {
        throw new Error('Producto o cantidad inválidos');
      }

      // Si no hay cart, crear uno vacío primero
      const currentCartBase = cart || createEmptyCart(user?.id ? `user_${user.id}` : TEMP_CART_ID);
      const currentCart = user && currentCartBase.userId && String(currentCartBase.userId) !== String(user.id)
        ? createEmptyCart(`user_${user.id}`)
        : currentCartBase;

      try {
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.productId === productId
        );

        let updatedCart: Cart;
        if (existingItemIndex > -1) {
          // Update existing item
          const updatedItems = [...currentCart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedCart = { ...currentCart, items: updatedItems };
        } else {
          // Add new item
          updatedCart = {
            ...currentCart,
            items: [...currentCart.items, { productId, quantity }],
          };
        }

        updatedCart.items = await enrichItemsWithProducts(mergeItemsByProduct(updatedCart.items));

        if (user) {
          await saveCartToAPI(updatedCart);
        } else {
          saveCartLocally(updatedCart);
        }
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error adding item to cart';
        setError(message);
        throw err;
      }
    },
    [cart, user, saveCartToAPI, saveCartLocally, mergeItemsByProduct, enrichItemsWithProducts]
  );

  const updateItem = useCallback(
    async (productId: number, quantity: number) => {
      if (!cart) return;

      if (!productId || productId <= 0) {
        throw new Error('Producto inválido');
      }

      try {
        const updatedItems = quantity <= 0
          ? cart.items.filter((item) => item.productId !== productId)
          : cart.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            );

        const updatedCart = { ...cart, items: updatedItems };

        if (user) {
          await saveCartToAPI(updatedCart);
        } else {
          saveCartLocally(updatedCart);
        }
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error updating item';
        setError(message);
        throw err;
      }
    },
    [cart, user, saveCartToAPI, saveCartLocally]
  );

  const removeItem = useCallback(
    async (productId: number) => {
      if (!cart) return;

      try {
        const updatedItems = cart.items.filter((item) => item.productId !== productId);
        const updatedCart = { ...cart, items: updatedItems };

        if (user) {
          await saveCartToAPI(updatedCart);
        } else {
          saveCartLocally(updatedCart);
        }
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error removing item';
        setError(message);
        throw err;
      }
    },
    [cart, user, saveCartToAPI, saveCartLocally]
  );

  const clearCart = useCallback(async () => {
    if (!cart) return;

    try {
      const emptyCart = createEmptyCart(user?.id || TEMP_CART_ID);

      if (user) {
        await saveCartToAPI(emptyCart);
      } else {
        saveCartLocally(emptyCart);
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error clearing cart';
      setError(message);
      throw err;
    }
  }, [cart, user, saveCartToAPI, saveCartLocally]);

  const checkout = useCallback(async (): Promise<string> => {
    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    if (!user) {
      throw new Error('Debes iniciar sesión para completar la compra');
    }

    try {
      const enrichedItems = await enrichItemsWithProducts(mergeItemsByProduct(cart.items));
      const purchasableItems = enrichedItems.filter(
        (item) => item.product && typeof item.product.price === 'number' && item.product.price > 0
      );

      if (purchasableItems.length === 0) {
        throw new Error('No hay productos válidos para completar la compra');
      }

      const calculatedTotal = purchasableItems.reduce(
        (total, item) => total + Number(item.product!.price) * item.quantity,
        0
      );

      if (calculatedTotal <= 0) {
        throw new Error('El total del pedido es inválido');
      }

      const orderHeaders = buildHeaders({ includeJson: true });

      const orderBody: Record<string, unknown> = {
        user_id: Number(user.id),
        total: calculatedTotal,
        status: 'pending',
      };

      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: orderHeaders,
        body: JSON.stringify(orderBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.detail || errorData?.error || `Checkout failed: ${response.status}`
        );
      }

      const orderData = await response.json();
      const orderId = orderData.id || orderData.order_id || orderData.idOrder || orderData.id_order;

      if (!orderId) {
        throw new Error('No se pudo obtener el ID de la orden');
      }

      // Crear los items de la orden
      for (const item of purchasableItems) {
        const itemResponse = await fetch(API_ENDPOINTS.orderItems, {
          method: 'POST',
          headers: orderHeaders,
          body: JSON.stringify({
            order_id: orderId,
            product_id: item.productId,
            quantity: item.quantity,
            price: Number(item.product!.price),
          }),
        });

        if (!itemResponse.ok) {
          throw new Error(await getErrorMessage(itemResponse));
        }
      }

      try {
        await fetch(API_ENDPOINTS.payments, {
          method: 'POST',
          headers: orderHeaders,
          body: JSON.stringify({
            order_id: orderId,
            amount: calculatedTotal,
            provider: 'manual',
            status: 'pending',
          }),
        });
      } catch (paymentErr) {
        console.warn('Payment record could not be created:', paymentErr);
      }
      
      // Clear cart after successful checkout
      await clearCart();
      
      setError(null);
      return String(orderId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error during checkout';
      setError(message);
      throw err;
    }
  }, [cart, user, buildHeaders, clearCart, mergeItemsByProduct, enrichItemsWithProducts, getErrorMessage]);

  const calculateTotal = useCallback((): number => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      // Usar el producto del item (ya cargado con las relaciones)
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const totalPrice = calculateTotal();

  // Initialize cart on mount or when user changes
  useEffect(() => {
    const initializeCart = async () => {
      if (authLoading) {
        return;
      }

      const detectedUserId = user?.id || null;
      const previousUserId = previousUserRef.current;
      const isFirstInitialization = previousUserId === undefined;
      
      // Reinicializar en el primer render o si hay un cambio real de usuario
      if (isFirstInitialization || detectedUserId !== previousUserId) {
        previousUserRef.current = detectedUserId;
        
        if (detectedUserId && previousUserId === null) {
          console.log('User logged in, merging local cart and loading API cart');
        } else if (!detectedUserId && previousUserId !== null) {
          // Usuario se acaba de desloguear
          console.log('User logged out');
        }
        
        setLoading(true);
        setError(null);
        try {
          if (user) {
            if (detectedUserId && previousUserId === null) {
              await mergeLocalCartIntoRemote();
            }
            // Usuario autenticado - cargar carrito de la API
            console.log('Loading cart from API for user:', user.id);
            await loadCartFromAPI();
          } else {
            // Usuario no autenticado - cargar de localStorage
            console.log('Loading cart from localStorage for guest');
            await loadCartFromLocalStorage();
          }
        } catch (err) {
          console.error('Error initializing cart:', err);
          setError(err instanceof Error ? err.message : 'Error loading cart');
          setCart(createEmptyCart(user?.id ? `user_${user.id}` : TEMP_CART_ID));
        } finally {
          setLoading(false);
        }
      }
    };

    initializeCart();
  }, [authLoading, user, user?.id, loadCartFromAPI, loadCartFromLocalStorage, mergeLocalCartIntoRemote]);

  return useMemo(() => ({
    cart,
    loading,
    error,
    itemCount,
    totalPrice,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    checkout,
  }), [cart, loading, error, itemCount, totalPrice, addItem, updateItem, removeItem, clearCart, checkout]);
}

function createEmptyCart(cartId: string): Cart {
  return {
    id: cartId,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
