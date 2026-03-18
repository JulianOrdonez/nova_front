'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { COLOMBIA_DEPARTMENTS, getCitiesByDepartment } from '@/constants/colombiaLocations';
import { mapCartItemsToEmailItems } from '@/utils/orderEmailTemplates';
import { notifyOrderByEmail } from '@/utils/orderNotifications';

const CHECKOUT_PROFILE_STORAGE_KEY = 'nova_last_checkout_profile';

type PaymentMethod = 'card' | 'transfer' | 'cash_on_delivery';

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  notes: string;
}

function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatCardNumber(value: string): string {
  const digits = sanitizeDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatCardExpiry(value: string): string {
  const digits = sanitizeDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function maskCardForPreview(value: string): string {
  const digits = sanitizeDigits(value);
  if (!digits) return '•••• •••• •••• ••••';
  const padded = `${digits}${'•'.repeat(Math.max(0, 16 - digits.length))}`;
  return padded.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function validateCheckoutForm(form: CheckoutFormData): string[] {
  const errors: string[] = [];

  if (!form.fullName.trim()) errors.push('El nombre completo es obligatorio.');
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Ingresa un correo válido.');
  }
  if (!form.phone.trim() || sanitizeDigits(form.phone).length < 8) {
    errors.push('Ingresa un teléfono válido.');
  }
  if (!form.addressLine1.trim()) errors.push('La dirección es obligatoria.');
  if (!form.city.trim()) errors.push('La ciudad es obligatoria.');
  if (!form.state.trim()) errors.push('El estado/provincia es obligatorio.');
  if (!form.postalCode.trim()) errors.push('El código postal es obligatorio.');
  if (!form.country.trim()) errors.push('El país es obligatorio.');

  if (form.paymentMethod === 'card') {
    if (!form.cardName.trim()) errors.push('El nombre en la tarjeta es obligatorio.');
    if (sanitizeDigits(form.cardNumber).length < 16) errors.push('El número de tarjeta debe tener 16 dígitos.');
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) errors.push('La expiración debe tener formato MM/YY.');
    if (sanitizeDigits(form.cardCvc).length < 3) errors.push('El CVC debe tener al menos 3 dígitos.');
  }

  return errors;
}

export const CartPageClient: React.FC = () => {
  const router = useRouter();
  const { cart, loading, itemCount, totalPrice, updateItem, removeItem, checkout } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutValidationErrors, setCheckoutValidationErrors] = useState<string[]>([]);

  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Colombia',
    paymentMethod: 'card',
    cardName: user?.name || '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    notes: '',
  });

  const paymentMethodLabel = useMemo(() => {
    if (checkoutForm.paymentMethod === 'card') return 'Tarjeta';
    if (checkoutForm.paymentMethod === 'transfer') return 'Transferencia';
    return 'Pago contra entrega';
  }, [checkoutForm.paymentMethod]);

  const citiesForDepartment = useMemo(
    () => getCitiesByDepartment(checkoutForm.state),
    [checkoutForm.state]
  );

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQuantity);
    }
  };

  const runCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const currentItems = cart?.items || [];
      const orderDateISO = new Date().toISOString();
      const orderId = await checkout();

      const cardLast4 = sanitizeDigits(checkoutForm.cardNumber).slice(-4);
      localStorage.setItem(
        CHECKOUT_PROFILE_STORAGE_KEY,
        JSON.stringify({
          orderId,
          customer: {
            fullName: checkoutForm.fullName,
            email: checkoutForm.email,
            phone: checkoutForm.phone,
          },
          shipping: {
            addressLine1: checkoutForm.addressLine1,
            addressLine2: checkoutForm.addressLine2,
            city: checkoutForm.city,
            state: checkoutForm.state,
            postalCode: checkoutForm.postalCode,
            country: checkoutForm.country,
            notes: checkoutForm.notes,
          },
          payment: {
            method: checkoutForm.paymentMethod,
            methodLabel: paymentMethodLabel,
            cardLast4: cardLast4 || undefined,
          },
          createdAt: new Date().toISOString(),
        })
      );

      try {
        const shippingAddress = [
          checkoutForm.addressLine1,
          checkoutForm.addressLine2,
          `${checkoutForm.city}, ${checkoutForm.state}`,
          checkoutForm.postalCode,
          checkoutForm.country,
        ]
          .filter(Boolean)
          .join(', ');

        await notifyOrderByEmail({
          orderId: String(orderId),
          orderDateISO,
          customerName: checkoutForm.fullName,
          customerEmail: checkoutForm.email,
          customerPhone: checkoutForm.phone,
          shippingAddress,
          paymentMethodLabel,
          total: totalPrice,
          items: mapCartItemsToEmailItems(currentItems),
          notes: checkoutForm.notes,
        });
      } catch (emailErr) {
        console.warn('Order email notification failed:', emailErr);
      }

      router.push(`/carrito/pedido/${orderId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error durante el checkout';
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?next=/carrito');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCloseModal = () => {
    if (isCheckingOut) {
      return;
    }

    setShowCheckoutModal(false);
    setCheckoutValidationErrors([]);
  };

  const handleFormChange = (field: keyof CheckoutFormData, value: string) => {
    if (field === 'cardNumber') {
      setCheckoutForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
      return;
    }

    if (field === 'cardExpiry') {
      setCheckoutForm((prev) => ({ ...prev, cardExpiry: formatCardExpiry(value) }));
      return;
    }

    if (field === 'cardCvc') {
      setCheckoutForm((prev) => ({ ...prev, cardCvc: sanitizeDigits(value).slice(0, 4) }));
      return;
    }

    if (field === 'state') {
      setCheckoutForm((prev) => ({ ...prev, state: value, city: '' }));
      return;
    }

    setCheckoutForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCheckoutForm = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors = validateCheckoutForm(checkoutForm);
    if (errors.length > 0) {
      setCheckoutValidationErrors(errors);
      return;
    }

    setCheckoutValidationErrors([]);
    await runCheckout();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-gray-300 border-t-black"></div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold">Tu carrito está vacío</h1>
        <p className="text-gray-600 text-lg">Explora nuestros productos y agrégalos al carrito</p>
        <Link href="/productos">
          <Button label="Ver productos" variant="primary" size="lg" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">Tu Carrito</h1>
          <p className="text-gray-600 text-lg">
            {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'} en tu carrito
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                {cart.items.filter(item => item.productId && item.productId > 0).map((item) => (
                  <motion.div
                    key={`cart-item-${item.productId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 bg-white shrink-0 flex items-center justify-center">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="grow">
                        <h3 className="text-xl font-bold mb-1">{item.product?.name || `Producto #${item.productId}`}</h3>
                        {item.product?.category && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{item.product.category.name}</span>
                        )}
                        <p className="text-lg font-bold text-black mt-2">
                          ${(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <motion.button
                          onClick={() => removeItem(item.productId)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </motion.button>

                        <div className="flex items-center gap-1 bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                          <motion.button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                          >
                            −
                          </motion.button>
                          <span className="px-3 py-1.5 font-semibold min-w-8 text-center">{item.quantity}</span>
                          <motion.button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                          >
                            +
                          </motion.button>
                        </div>

                        <p className="text-lg font-bold">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold">Resumen del Pedido</h2>

              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-300">
                <span className="text-gray-600">Artículos ({itemCount})</span>
                <span className="font-semibold">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-300">
                <span className="text-gray-600">Envío estimado</span>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>

              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-2xl">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Error Message */}
              {checkoutError && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700">
                  <p className="font-semibold text-sm">Error en el pedido</p>
                  <p className="text-sm mt-1">{checkoutError}</p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-yellow-900">
                  <p className="font-semibold text-sm">Inicia sesión para completar tu compra</p>
                  <p className="text-sm mt-1">Tu carrito se mantiene guardado y se sincronizará con tu cuenta.</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCheckingOut ? 'Procesando...' : 'Proceder al Pago'}
              </motion.button>

              {/* Continue Shopping */}
              <Link href="/productos" className="block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black border-2 border-black py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Seguir comprando
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showCheckoutModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />
            <motion.div
              className="fixed inset-0 z-[70] overflow-y-auto p-4 sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
            >
              <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-gray-200 shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Finalizar compra</h2>
                    <p className="text-sm text-gray-600">Completa la información para procesar tu pedido.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-600"
                    aria-label="Cerrar formulario de checkout"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitCheckoutForm} className="p-6 space-y-6">
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold">Datos del cliente</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={checkoutForm.fullName}
                        onChange={(e) => handleFormChange('fullName', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={checkoutForm.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={checkoutForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold">Dirección de envío</h3>
                    <input
                      type="text"
                      placeholder="Dirección principal"
                      value={checkoutForm.addressLine1}
                      onChange={(e) => handleFormChange('addressLine1', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="Apartamento, oficina, referencia (opcional)"
                      value={checkoutForm.addressLine2}
                      onChange={(e) => handleFormChange('addressLine2', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Ciudad"
                        list="checkout-cities"
                        value={checkoutForm.city}
                        onChange={(e) => handleFormChange('city', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                      <datalist id="checkout-cities">
                        {citiesForDepartment.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                      <input
                        type="text"
                        placeholder="Departamento"
                        list="checkout-departments"
                        value={checkoutForm.state}
                        onChange={(e) => handleFormChange('state', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                      <datalist id="checkout-departments">
                        {COLOMBIA_DEPARTMENTS.map((department) => (
                          <option key={department} value={department} />
                        ))}
                      </datalist>
                      <input
                        type="text"
                        placeholder="Código postal"
                        value={checkoutForm.postalCode}
                        onChange={(e) => handleFormChange('postalCode', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        placeholder="País"
                        value={checkoutForm.country}
                        onChange={(e) => handleFormChange('country', e.target.value)}
                        className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                    <textarea
                      placeholder="Notas para entrega (opcional)"
                      value={checkoutForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold">Método de pago</h3>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl overflow-hidden border border-gray-200"
                    >
                      <div className="relative bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 text-white p-5 min-h-40">
                        <motion.div
                          className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10"
                          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                          className="absolute bottom-3 right-4 text-xs text-white/70"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          Secure Checkout
                        </motion.div>
                        <div className="relative z-10 space-y-5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs tracking-[0.35em] text-white/80">NOVA PAY</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/15 border border-white/20">{paymentMethodLabel}</span>
                          </div>
                          <p className="text-xl sm:text-2xl tracking-[0.18em] font-semibold">
                            {maskCardForPreview(checkoutForm.cardNumber)}
                          </p>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[10px] text-white/70 uppercase">Titular</p>
                              <p className="text-sm font-medium">{checkoutForm.cardName || checkoutForm.fullName || 'NOMBRE DEL TITULAR'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-white/70 uppercase">Expira</p>
                              <p className="text-sm font-medium">{checkoutForm.cardExpiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'card', label: 'Tarjeta' },
                        { value: 'transfer', label: 'Transferencia' },
                        { value: 'cash_on_delivery', label: 'Contra entrega' },
                      ].map((option) => {
                        const isSelected = checkoutForm.paymentMethod === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFormChange('paymentMethod', option.value)}
                            className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                              isSelected
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    {checkoutForm.paymentMethod === 'card' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre en la tarjeta"
                          value={checkoutForm.cardName}
                          onChange={(e) => handleFormChange('cardName', e.target.value)}
                          className="sm:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          placeholder="Número de tarjeta"
                          value={checkoutForm.cardNumber}
                          onChange={(e) => handleFormChange('cardNumber', e.target.value)}
                          className="sm:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={checkoutForm.cardExpiry}
                          onChange={(e) => handleFormChange('cardExpiry', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          value={checkoutForm.cardCvc}
                          onChange={(e) => handleFormChange('cardCvc', e.target.value)}
                          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                    )}
                  </section>

                  {checkoutValidationErrors.length > 0 && (
                    <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-700 mb-2">Corrige estos campos:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {checkoutValidationErrors.map((entry) => (
                          <li key={entry}>• {entry}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {checkoutError && (
                    <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700">
                      {checkoutError}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Total a pagar</span>
                      <span className="text-xl text-black font-bold">${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        disabled={isCheckingOut}
                        className="sm:flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-black transition-colors disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isCheckingOut}
                        className="sm:flex-1 px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                      >
                        {isCheckingOut ? 'Procesando pedido...' : 'Confirmar y pagar'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
