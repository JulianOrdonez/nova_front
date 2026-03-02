'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useProductBySlug } from '@/hooks/useApi';

interface ProductDetailPageClientProps {
  slug: string;
}

export default function ProductDetailPageClient({ slug }: ProductDetailPageClientProps) {
  const { product, loading, error } = useProductBySlug(slug);

  if (loading) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-bold">Producto no encontrado</h1>
        <p className="text-gray-700 text-lg">{error || 'El producto que buscas no existe'}</p>
        <Link href="/productos">
          <Button label="Volver a productos" variant="outline" size="lg" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-white">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-8"
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="text-gray-400 text-center">
                <p className="text-sm">Imagen no disponible</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                {product.category?.name || 'Producto NØVA'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-black">${Number(product.price ?? 0).toFixed(2)}</span>
                <span className="text-sm text-gray-600">USD</span>
              </div>
            </div>

            <Link href="/contacto">
              <Button label="Solicitar más información" variant="primary" size="lg" className="w-full" />
            </Link>

            <div className="h-px bg-gray-200" />

            <div className="space-y-3 text-sm text-gray-700">
              <p>✓ Producto original UGREEN</p>
              <p>✓ Garantía garantizada</p>
              <p>✓ Envío rápido y seguro</p>
              <p>✓ Disponible en stock</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-8">
              Acerca de este producto
            </h2>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
              {product.description.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6">
              ¿Tienes preguntas sobre este producto?
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-12 leading-relaxed">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta.
            </p>
            <Link href="/contacto">
              <Button label="Contactar soporte" variant="outline" size="lg" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Link href="/productos" className="text-sm text-gray-600 hover:text-black transition-colors duration-300">
            ← Volver a productos
          </Link>
        </div>
      </section>
    </div>
  );
}
