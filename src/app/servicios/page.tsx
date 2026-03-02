'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useApi';
import { getIcon } from '@/utils/iconMapper';
import { Button } from '@/components/ui/Button';

const ServiciosPage = () => {
    const { services, loading, error } = useServices();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Hero Section */}
            <section className="py-24 md:py-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-6">
                            Servicios NØVA
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            Servicios profesionales diseñados para optimizar tu experiencia y brindar la mejor atención.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border border-gray-300 border-t-black"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <p className="text-red-600">Error: {error}</p>
                        </div>
                    ) : services.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {services.map((service) => (
                                <motion.div
                                    key={service.id}
                                    variants={itemVariants}
                                    className="group bg-white rounded-xl border-2 border-gray-200 hover:border-black p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {getIcon(service.icon)}
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-3">
                                        {service.title}
                                    </h3>
                                    {service.shortDescription && (
                                        <p className="text-sm text-gray-700 font-medium mb-3">
                                            {service.shortDescription}
                                        </p>
                                    )}
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {service.description}
                                    </p>
                                    {service.features && service.features.length > 0 && (
                                        <div className="mb-4 space-y-1">
                                            {service.features.slice(0, 4).map((feature, idx) => (
                                                <div key={idx} className="flex items-start text-xs text-gray-600">
                                                    <span className="text-black mr-1.5">✓</span>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {service.features.length > 4 && (
                                                <p className="text-xs text-gray-500 italic pl-4">
                                                    +{service.features.length - 4} más
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {service.priceRange && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-sm font-bold text-black">{service.priceRange}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-600">No hay servicios disponibles</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight">
                            Por qué elegir NØVA
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            En NØVA entendemos que cada proyecto es único. Nos enfocamos en tres pilares: <strong>performance extremo</strong>, <strong>código escalable</strong> y <strong>diseño minimalista</strong>. No hacemos soluciones genéricas. Hacemos soluciones que duran.
                        </p>
                        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-2xl font-semibold text-black mb-2">99%</p>
                                <p className="text-sm text-gray-600">Uptime garantizado</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-black mb-2">2–8 sem.</p>
                                <p className="text-sm text-gray-600">Tiempo de entrega</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-black mb-2">∞</p>
                                <p className="text-sm text-gray-600">Escalabilidad</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6">
                            ¿Tienes un proyecto en mente?
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-12 leading-relaxed">
                            Hablemos sobre cómo NØVA puede ayudarte a llevar tu visión a la realidad.
                        </p>
                        <a href="/contacto">
                            <Button label="Iniciar conversación" variant="outline" size="lg" />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServiciosPage;
