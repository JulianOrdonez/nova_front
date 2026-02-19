'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NosotrosPage = () => {
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
                            Sobre NØVA
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            Una marca de tecnología premium enfocada en performance, diseño minimalista y soluciones escalables.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">
                                Quiénes somos
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                                NØVA nace de la obsesión por la calidad. Somos un equipo de ingenieros, diseñadores y creadores que creen que la tecnología debe ser hermosa, confiable y accesible.
                            </p>
                            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                                No construimos productos genéricos. Construimos soluciones que duran, que escalan y que se ven bien. Cada línea de código, cada píxel, cada decisión está pensada con precisión.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-12 text-center"
                    >
                        Nuestros pilares
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-2xl font-semibold text-black tracking-tight">Performance</h3>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Velocidad, eficiencia y optimización extrema. Cada milisegundo cuenta. NØVA está diseñado para ser rápido desde el primer byte.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-2xl font-semibold text-black tracking-tight">Diseño</h3>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Minimalismo inteligente. Cada elemento tiene un propósito. Lo que ves es el resultado de decisiones deliberadas, no accidentales.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-2xl font-semibold text-black tracking-tight">Escalabilidad</h3>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Pensamos en el futuro. Hoy construimos para mañana. NØVA crece contigo, sin comprometer calidad ni performance.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                            Visión a futuro
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            NØVA está en constante evolución. Nuestro roadmap incluye la expansión a nuevas categorías de productos premium, el desarrollo de software especializado, servicios de ingeniería de clase mundial, y en última instancia, una experiencia de e-commerce integrada que permita a profesionales y empresas acceder a la tecnología NØVA de manera sencilla.
                        </p>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            Cada paso que damos está diseñado para mantener nuestra promesa: performance extremo, código limpio, diseño atemporal y soluciones que realmente funcionan.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default NosotrosPage;
