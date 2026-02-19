/**
 * Services Section Component
 * Muestra los servicios ofrecidos
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import type { Service } from '@/types';

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder para cuando conectemos a FastAPI
    const mockServices: Service[] = [
      {
        id: '1',
        title: 'Consultoría Técnica',
        slug: 'consultoria-tecnica',
        description: 'Asesoramiento experto para arquitectura de sistemas y soluciones tecnológicas',
        icon: '🎯',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Soporte 24/7',
        slug: 'soporte-24-7',
        description: 'Equipo profesional disponible las 24 horas para resolver cualquier incidencia',
        icon: '🛡️',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Integración API',
        slug: 'integracion-api',
        description: 'Conectamos tus sistemas con nuestras soluciones de forma rápida y segura',
        icon: '🔗',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Capacitación',
        slug: 'capacitacion',
        description: 'Programas de entrenamiento personalizados para tu equipo técnico',
        icon: '📚',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Servicios profesionales para maximizar el valor de nuestras soluciones
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group p-8 rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700">
                  {service.description}
                </p>
                <Badge label="Disponible" variant="success" size="sm" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
