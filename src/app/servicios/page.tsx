'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useApi';

const ServiciosPage = () => {
    const { services, loading, error } = useServices();

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
            <section className="py-24 md:py-32 px-6 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-wide mb-6">
                            Servicios UGREEN
                        </h1>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            Servicios premium diseñados para optimizar tu experiencia con nuestros productos y brindarte la mejor atención.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 md:py-32 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-24">
                            <p className="text-white/60 text-lg">No pudimos cargar los servicios. Por favor intenta más tarde.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                            {services.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                                    className="group"
                                >
                                    <div className="space-y-4 p-8 rounded-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-xs font-medium text-white">✓</span>
                                        </div>
                                        <h3 className="text-xl font-medium text-white tracking-wide">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed flex-grow">
                                            {service.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 md:py-32 px-6 bg-black/50 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-center space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide">
                            Por qué elegir UGREEN
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            En NOVA entendemos que cada proyecto es único. Nos enfocamos en tres pilares: <strong>performance extremo</strong>, <strong>código escalable</strong> y <strong>diseño minimalista</strong>. No hacemos soluciones genéricas. Hacemos soluciones que duran.
                        </p>
                        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-2xl font-medium text-white mb-2">99%</p>
                                <p className="text-sm text-white/60 font-light">Uptime garantizado</p>
                            </div>
                            <div>
                                <p className="text-2xl font-medium text-white mb-2">2–8 sem.</p>
                                <p className="text-sm text-white/60 font-light">Tiempo de entrega</p>
                            </div>
                            <div>
                                <p className="text-2xl font-medium text-white mb-2">∞</p>
                                <p className="text-sm text-white/60 font-light">Escalabilidad</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-black border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6">
                            ¿Tienes un proyecto en mente?
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 leading-relaxed">
                            Hablemos sobre cómo NOVA puede ayudarte a llevar tu visión a la realidad.
                        </p>
                        <a href="/contacto">
                            <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                                Iniciar conversación
                            </button>
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServiciosPage;
