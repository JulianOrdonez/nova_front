'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useApi';

const ProductsPage = () => {
    const { products, loading, error } = useProducts();

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Page Header */}
            <section className="bg-black py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-wide mb-4">
                            Productos UGREEN
                        </h1>
                        <p className="text-base md:text-lg text-white/60 font-light tracking-wide">
                            Tecnología premium, durabilidad confiable y diseño elegante
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-block">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                            <p className="text-white/60 mt-4">Cargando productos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-red-400">Error al cargar productos: {error}</p>
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
                                        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                                    >
                                        <div className="group cursor-pointer">
                                            {/* Product Image Container */}
                                            <motion.div
                                                className="relative aspect-square mb-8 overflow-hidden bg-white/5 rounded-sm"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
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
                                                        <h3 className="text-xl md:text-2xl font-medium text-white tracking-wide">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-xs text-white/40 tracking-wide mt-1">
                                                            {product.category.name}
                                                        </p>
                                                    </div>
                                                    {product.price && (
                                                        <span className="text-lg font-semibold text-white/80">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm md:text-base text-white/60 font-light tracking-wide leading-relaxed line-clamp-3">
                                                    {product.description}
                                                </p>
                                            </div>

                                            {/* Divider Line */}
                                            <div className="h-px bg-white/10 mt-6" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black py-24 md:py-32 px-6 border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6">
                            ¿Te interesa algún producto?
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 leading-relaxed">
                            Contáctanos para conocer más detalles, precios especiales y disponibilidad.
                        </p>
                        <Link href="/contacto">
                            <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                                Ir a contacto
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ProductsPage;
