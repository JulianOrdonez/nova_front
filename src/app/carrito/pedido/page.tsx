'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function OrderConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.replace('/carrito');
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center">Pedido no especificado</h1>
      <p className="text-gray-600 text-center max-w-md">
        Redirigiendo al carrito para que completes el proceso de compra correctamente.
      </p>
      <Link href="/carrito">
        <Button label="Ir al carrito" variant="primary" size="lg" />
      </Link>
    </div>
  );
}
