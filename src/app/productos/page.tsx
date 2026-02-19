'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';

const ProductsPage = () => {
    const { products, loading, error } = useProducts();

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Page Header */}
            <section className="bg-white py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-4">
                            Productos NØVA
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 font-normal">
                            Tecnología profesional, rendimiento confiable y diseño minimalista
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-gray-50 py-24 md:py-32 px-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-block">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                            </div>
                            <p className="text-gray-600 mt-4">Cargando productos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-gray-700">Error al cargar productos: {error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                            {products.map((product, index) => (
                                <Link
                                    key={product.id}
                                    href={`/productos/${product.slug}`}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                                            {/* Product Image Container */}
                                            <motion.div
                                                className="relative aspect-square mb-6 overflow-hidden bg-gray-50 rounded-lg border border-gray-200"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-8 group-hover:brightness-110 transition-all duration-300"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            </motion.div>

                                            {/* Product Info */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-semibold text-black tracking-tight">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {product.category?.name || 'Sin categoría'}
                                                        </p>
                                                    </div>
                                                    {product.price && (
                                                        <span className="text-lg font-semibold text-black">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {/* Divider Line */}
                                            <div className="h-px bg-gray-200 mt-6" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-24 md:py-32 px-6 border-t border-gray-200">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6">
                            ¿Te interesa un producto?
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-12 leading-relaxed">
                            Contáctanos para conocer más detalles, precios especiales y disponibilidad.
                        </p>
                        <Link href="/contacto">
                            <Button label="Ir a contacto" variant="outline" size="lg" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ProductsPage;
