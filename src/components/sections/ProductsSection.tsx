/**
 * Products Section Component
 * Muestra una lista de productos destacados
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useApi';

export const ProductsSection: React.FC = () => {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Soluciones software de alta calidad diseñadas para potenciar tu negocio
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-700">No fue posible cargar los productos destacados.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card
                  title={product.name}
                  description={product.description}
                  image={product.imageUrl}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black">
                      ${Number(product.price ?? 0).toFixed(2)}
                    </span>
                    <Link href={`/productos/detalle?slug=${encodeURIComponent(product.slug)}`}>
                      <Button
                        label="Ver más"
                        variant="primary"
                        size="sm"
                      />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link href="/productos">
            <Button label="Ver todos los productos" variant="outline" size="lg" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
