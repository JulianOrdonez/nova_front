'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NosotrosPage = () => {
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
                            Sobre NOVA
                        </h1>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            Una marca de tecnología premium enfocada en performance, diseño minimalista y soluciones escalables.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-24 md:py-32 px-6 bg-black">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide mb-6">
                                Quiénes somos
                            </h2>
                            <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed mb-6">
                                NOVA nace de la obsesión por la calidad. Somos un equipo de ingenieros, diseñadores y creadores que creen que la tecnología debe ser hermosa, confiable y accesible.
                            </p>
                            <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                                No construimos productos genéricos. Construimos soluciones que duran, que escalan y que se ven bien. Cada línea de código, cada píxel, cada decisión está pensada con precisión.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-24 md:py-32 px-6 bg-black/50 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-3xl md:text-4xl font-medium text-white tracking-wide mb-12 text-center"
                    >
                        Nuestros pilares
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-medium text-white tracking-wide">Performance</h3>
                                <p className="text-base text-white/70 font-light tracking-wide leading-relaxed">
                                    Velocidad, eficiencia y optimización extrema. Cada milisegundo cuenta. NOVA está diseñado para ser rápido desde el primer byte.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-medium text-white tracking-wide">Diseño</h3>
                                <p className="text-base text-white/70 font-light tracking-wide leading-relaxed">
                                    Minimalismo inteligente. Cada elemento tiene un propósito. Lo que ves es el resultado de decisiones deliberadas, no accidentales.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                        >
                            <div className="space-y-4">
                                <h3 className="text-2xl font-medium text-white tracking-wide">Escalabilidad</h3>
                                <p className="text-base text-white/70 font-light tracking-wide leading-relaxed">
                                    Pensamos en el futuro. Hoy construimos para mañana. NOVA crece contigo, sin comprometer calidad ni performance.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-24 md:py-32 px-6 bg-black border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-center space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide">
                            Visión a futuro
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            NOVA está en constante evolución. Nuestro roadmap incluye la expansión a nuevas categorías de productos premium, el desarrollo de software especializado, servicios de ingeniería de clase mundial, y en última instancia, una experiencia de e-commerce integrada que permita a profesionales y empresas acceder a la tecnología NOVA de manera sencilla.
                        </p>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            Cada paso que damos está diseñado para mantener nuestra promesa: performance extremo, código limpio, diseño atemporal y soluciones que realmente funcionan.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default NosotrosPage;
