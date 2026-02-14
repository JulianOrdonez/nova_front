'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const router = useRouter();
    const { slug } = React.use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${slug}`);
                if (!response.ok) {
                    setError('Producto no encontrado');
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setProduct(data.data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error cargando el producto');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-6 px-6">
                <h1 className="text-4xl font-medium">Producto no encontrado</h1>
                <p className="text-white/60 text-lg">{error || 'El producto que buscas no existe'}</p>
                <Link
                    href="/productos"
                    className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300"
                >
                    Volver a productos
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center px-6 py-24">
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="relative aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center bg-white/5 rounded-sm p-8"
                    >
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-white/30 text-center">
                                <p className="text-sm">Imagen no disponible</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="space-y-6 lg:space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-wide mb-4">
                                {product.name}
                            </h1>
                            <p className="text-sm md:text-base text-white/60 font-light tracking-wide mb-4">
                                {product.category?.name || 'Producto UGREEN'}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-medium text-white">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-white/60 font-light">USD</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link href="/contacto">
                            <button className="w-full bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                                Solicitar más información
                            </button>
                        </Link>

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Quick Benefits */}
                        <div className="space-y-3 text-sm text-white/60 font-light">
                            <p>✓ Producto original UGREEN</p>
                            <p>✓ Garantía garantizada</p>
                            <p>✓ Envío rápido y seguro</p>
                            <p>✓ Disponible en stock</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-24 md:py-32 px-6 bg-black border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide mb-8">
                            Acerca de este producto
                        </h2>
                        <div className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed space-y-6">
                            {product.description.split('\n\n').map((paragraph: string, index: number) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-black/50 border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6">
                            ¿Tienes preguntas sobre este producto?
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 leading-relaxed">
                            Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta.
                        </p>
                        <Link href="/contacto">
                            <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                                Contactar soporte
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Back to Products */}
            <section className="py-12 px-6 bg-black border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/productos"
                        className="text-sm text-white/60 font-light tracking-wide hover:text-white transition-colors duration-300"
                    >
                        ← Volver a productos
                    </Link>
                </div>
            </section>
        </div>
    );
}
