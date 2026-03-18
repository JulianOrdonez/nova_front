'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  onSuccess?: () => void;
  className?: string;
  /** 'full' = full-width primary button (default), 'compact' = small icon+text, 'icon' = icon only */
  variant?: 'full' | 'compact' | 'icon';
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  onSuccess,
  className = '',
  variant = 'full',
}) => {
  const { addItem, loading } = useCart();
  const [status, setStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'adding' || loading) return;

    setStatus('adding');
    setErrorMsg('');
    try {
      await addItem(productId, quantity);
      setStatus('success');
      onSuccess?.();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al agregar');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isAdding = status === 'adding';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  const cartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );

  const checkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );

  const spinIcon = (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
  );

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        title={isSuccess ? '¡Agregado!' : isError ? errorMsg : 'Agregar al carrito'}
        className={`
          relative p-2 rounded-xl transition-all duration-200 active:scale-95
          ${isSuccess
            ? 'bg-green-500 text-white'
            : isError
            ? 'bg-red-500 text-white'
            : 'bg-black text-white hover:bg-gray-800'}
          disabled:opacity-60 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isAdding ? spinIcon : isSuccess ? checkIcon : cartIcon}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95
          ${isSuccess
            ? 'bg-green-500 text-white'
            : isError
            ? 'bg-red-500 text-white'
            : 'bg-black text-white hover:bg-gray-800'}
          disabled:opacity-60 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isAdding ? spinIcon : isSuccess ? checkIcon : cartIcon}
        <span>{isAdding ? 'Agregando...' : isSuccess ? '¡Agregado!' : isError ? 'Error' : 'Agregar'}</span>
      </button>
    );
  }

  // full variant
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all duration-200 active:scale-[0.98] shadow-lg
          ${isSuccess
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
            : isError
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-black hover:bg-gray-800 text-white hover:shadow-xl'}
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {isAdding ? spinIcon : isSuccess ? checkIcon : cartIcon}
        <span>{isAdding ? 'Agregando...' : isSuccess ? '¡Agregado al carrito!' : isError ? 'Error al agregar' : 'Agregar al carrito'}</span>
      </button>
      {isError && errorMsg && (
        <p className="text-xs text-red-500 text-center">{errorMsg}</p>
      )}
    </div>
  );
};
