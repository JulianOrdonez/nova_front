'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';

// Mock product data
const products: Record<string, any> = {
    'nova-pro-x1': {
        id: 'nova-pro-x1',
        name: 'NOVA Pro X1',
        tagline: 'Rendimiento profesional sin compromiso',
        description: `NOVA Pro X1 está diseñado para profesionales que exigen lo mejor. Combina tecnología de punta con un diseño minimalista que se integra perfecto en cualquier espacio.

Cada componente fue seleccionado y optimizado para ofrecer un rendimiento excepcional, confiabilidad sin igual y una experiencia de usuario que supera todas las expectativas.`,
        features: [
            {
                title: 'Rendimiento máximo',
                description: 'Potencia computacional optimizada para tareas profesionales exigentes'
            },
            {
                title: 'Diseño premium',
                description: 'Materiales de alta calidad con acabado refinado y minimalista'
            },
            {
                title: 'Confiabilidad probada',
                description: 'Componentes seleccionados y testeados para durabilidad extrema'
            },
            {
                title: 'Eficiencia energética',
                description: 'Consumo optimizado sin sacrificar potencia ni rendimiento'
            }
        ],
        image: '/images/products/nova-pro-x1.png',
        alt: 'NOVA Pro X1 - Dispositivo profesional premium'
    },
    'nova-air': {
        id: 'nova-air',
        name: 'NOVA Air',
        tagline: 'Portabilidad y elegancia en diseño refinado',
        description: `NOVA Air es la elección perfecta para quienes valoran la movilidad sin sacrificar calidad. Ultra delgado, increíblemente ligero, pero con capacidades que rivalizan con dispositivos más robustos.

Diseñado para profesionales en movimiento que necesitan confiabilidad en cualquier lugar. Cada detalle ha sido optimizado para portabilidad, sin comprometer la calidad o el rendimiento.`,
        features: [
            {
                title: 'Ultra portátil',
                description: 'Peso ligero y tamaño compacto, perfecto para viajes y trabajo móvil'
            },
            {
                title: 'Batería extendida',
                description: 'Duración de batería optimizada para jornadas de trabajo completas'
            },
            {
                title: 'Construcción premium',
                description: 'Aluminio de aeronáutica con resistencia y elegancia garantizadas'
            },
            {
                title: 'Conectividad total',
                description: 'Todas las conexiones que necesitas en un formato ultra delgado'
            }
        ],
        image: '/images/products/nova-air.png',
        alt: 'NOVA Air - Dispositivo portátil minimalista'
    },
    'nova-studio': {
        id: 'nova-studio',
        name: 'NOVA Studio',
        tagline: 'Creatividad sin límites para profesionales',
        description: `NOVA Studio es la estación de trabajo definitiva para creativos. Potencia sin precedentes, pantalla de precisión absoluta y herramientas diseñadas específicamente para creadores de contenido.

Desde diseño gráfico hasta edición de video, NOVA Studio maneja cualquier tarea creativa con soltura. Su ecosistema integrado garantiza flujos de trabajo perfectos.`,
        features: [
            {
                title: 'Pantalla de precisión',
                description: 'Fidelidad de color absoluta para trabajo profesional de nivel mundial'
            },
            {
                title: 'GPU especializada',
                description: 'Aceleración de hardware para renderizado, edición y diseño'
            },
            {
                title: 'Almacenamiento ultra rápido',
                description: 'Velocidades de transferencia extremas para archivos de gran tamaño'
            },
            {
                title: 'Refrigeración activa',
                description: 'Sistema de enfriamiento silencioso para sesiones de trabajo prolongadas'
            }
        ],
        image: '/images/products/nova-studio.png',
        alt: 'NOVA Studio - Estación de trabajo creativa'
    }
};

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = React.use(params);
    const product = products[slug];

    if (!product) {
        notFound();
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
                        className="relative aspect-square lg:aspect-auto lg:h-screen flex items-center justify-center"
                    >
                        <Image
                            src={product.image}
                            alt={product.alt}
                            width={500}
                            height={500}
                            className="object-contain w-full h-auto"
                            priority
                        />
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
                            <p className="text-lg md:text-xl text-white/70 font-light tracking-wide">
                                {product.tagline}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                            Más información
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-white/10" />

                        {/* Quick Benefits */}
                        <div className="space-y-3 text-sm text-white/60 font-light">
                            <p>✓ Diseño premium y minimalista</p>
                            <p>✓ Calidad garantizada</p>
                            <p>✓ Envío rápido y seguro</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-24 md:py-32 px-6 bg-black">
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

            {/* Features Section */}
            <section className="py-24 md:py-32 px-6 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide mb-12">
                            Características principales
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {product.features.map((feature: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                                    className="space-y-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">✓</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white tracking-wide mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 md:py-32 px-6 bg-black border-t border-white/10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-wide mb-6">
                            ¿Quieres saber si este producto es para ti?
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 leading-relaxed">
                            Nuestro equipo está disponible para responder todas tus preguntas y ayudarte a tomar la mejor decisión.
                        </p>
                        <Link href="/contacto">
                            <button className="inline-block bg-white text-black px-8 py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300">
                                Consultar disponibilidad
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
