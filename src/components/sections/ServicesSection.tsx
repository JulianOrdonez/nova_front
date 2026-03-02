/**
 * Services Section Component
 * Muestra los servicios ofrecidos
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useApi';
import { getIcon } from '@/utils/iconMapper';

export const ServicesSection: React.FC = () => {
  const { services, loading, error } = useServices();

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
            Soluciones completas para llevar tu negocio al siguiente nivel
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Error: {error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay servicios disponibles</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-black p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Icon */}
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {getIcon(service.icon)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h3>

                {/* Short Description */}
                {service.shortDescription && (
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    {service.shortDescription}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start text-xs text-gray-600">
                        <span className="text-black mr-1.5">✓</span>
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-xs text-gray-500 italic pl-4">
                        +{service.features.length - 3} más
                      </p>
                    )}
                  </div>
                )}

                {/* Price Range */}
                {service.priceRange && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-bold text-black">{service.priceRange}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
