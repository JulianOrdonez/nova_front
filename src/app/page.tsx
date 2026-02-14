'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useApi';

const HomePage = () => {
    const { products } = useProducts();
    
    // Obtener solo los primeros 3 productos
    const featuredProducts = products.slice(0, 3);
    
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/backgrounds/hero-nova.jpg')" }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70" />
                
                {/* Content Layer */}
                <div className="relative z-10 flex items-center justify-center h-full px-6">
                    <div className="text-center">
                        <motion.h1 
                            className="text-5xl md:text-6xl lg:text-8xl font-semibold text-white tracking-wide leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            Bienvenido a NOVA
                        </motion.h1>
                        <motion.p
                            className="mt-6 text-lg md:text-xl text-white/70 font-light tracking-wide"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                            Tecnología premium para el futuro
                        </motion.p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
                    animate={{ y: [0, 12, 0], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-px h-16 bg-white/40" />
                </motion.div>
            </section>

            {/* Intro Section */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        Diseño y rendimiento unidos
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-white/60 font-light tracking-wide leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    >
                        Cada producto NOVA está pensado para ofrecer una experiencia excepcional, donde la tecnología avanzada se encuentra con el minimalismo elegante.
                    </motion.p>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-4">
                            Productos destacados
                        </h2>
                        <p className="text-base md:text-lg text-white/60 font-light tracking-wide">
                            Una selección de tecnología excepcional
                        </p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                        {featuredProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                href={`/productos/${product.slug}`}
                            >
                                <motion.div
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                >
                                    <div className="relative aspect-square mb-6 overflow-hidden bg-white/5 rounded-sm">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-8 group-hover:brightness-110 transition-all duration-300"
                                        />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-medium text-white tracking-wide mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm md:text-base text-white/60 font-light tracking-wide line-clamp-2">
                                        {product.description}
                                    </p>
                                    {product.price && (
                                        <p className="text-lg font-semibold text-white/80 mt-2">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beneficios Section */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-4">
                            Beneficios
                        </h2>
                        <p className="text-base md:text-lg text-white/60 font-light tracking-wide">
                            Tecnología, diseño y confiabilidad en cada detalle
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {/* Benefit 1 */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="flex justify-center mb-4">
                                <svg 
                                    className="w-8 h-8 text-white/70" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" 
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-wide mb-2">
                                Diseño que perdura
                            </h3>
                            <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed">
                                Minimalismo funcional pensado para verse bien hoy y mañana.
                            </p>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        >
                            <div className="flex justify-center mb-4">
                                <svg 
                                    className="w-8 h-8 text-white/70" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" 
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-wide mb-2">
                                Rendimiento confiable
                            </h3>
                            <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed">
                                Tecnología seleccionada para un uso real, diario y profesional.
                            </p>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="flex justify-center mb-4">
                                <svg 
                                    className="w-8 h-8 text-white/70" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" 
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-medium text-white tracking-wide mb-2">
                                Selección curada
                            </h3>
                            <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed">
                                Cada producto NOVA cumple estándares de diseño, calidad y utilidad.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonios Section */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-4">
                            Testimonios
                        </h2>
                        <p className="text-base md:text-lg text-white/60 font-light tracking-wide">
                            Experiencias reales de usuarios NOVA
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {/* Testimonial 1 */}
                        <div className="text-center">
                            <p className="text-base md:text-lg text-white/80 font-light tracking-wide mb-6 leading-relaxed">
                                "Cada detalle está pensado. Desde que lo desempaques hasta usarlo, todo funciona perfecto."
                            </p>
                            <div>
                                <p className="text-sm md:text-base font-medium text-white tracking-wide">
                                    Martín R.
                                </p>
                                <p className="text-xs md:text-sm text-white/50 font-light tracking-wide">
                                    Profesional creativo
                                </p>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="text-center">
                            <p className="text-base md:text-lg text-white/80 font-light tracking-wide mb-6 leading-relaxed">
                                "La calidad es evidente. No es solo tecnología, es una experiencia completa."
                            </p>
                            <div>
                                <p className="text-sm md:text-base font-medium text-white tracking-wide">
                                    Laura G.
                                </p>
                                <p className="text-xs md:text-sm text-white/50 font-light tracking-wide">
                                    Diseñadora
                                </p>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="text-center">
                            <p className="text-base md:text-lg text-white/80 font-light tracking-wide mb-6 leading-relaxed">
                                "Recomiendo NOVA sin dudarlo. Confiabilidad y elegancia en un solo lugar."
                            </p>
                            <div>
                                <p className="text-sm md:text-base font-medium text-white tracking-wide">
                                    Carlos A.
                                </p>
                                <p className="text-xs md:text-sm text-white/50 font-light tracking-wide">
                                    Emprendedor
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black py-24 md:py-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    {/* CTA Content */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6">
                        Descubre el estándar NOVA
                    </h2>
                    <p className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 leading-relaxed">
                        Productos diseñados para quienes buscan calidad, diseño y confiabilidad en cada detalle.
                    </p>

                    {/* CTA Button */}
                    <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                        Explorar colección
                    </button>

                    {/* Secondary Text */}
                    <p className="text-xs md:text-sm text-white/40 font-light tracking-wide mt-8">
                        Envío rápido y garantía de satisfacción
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
