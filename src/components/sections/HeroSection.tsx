/**
 * Hero Section Component
 * Sección principal del home con call-to-action
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Bienvenido a NØVA
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight tracking-tight"
        >
          Soluciones de Software{' '}
          <span className="text-gray-600">
            Profesionales
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Descubre nuestros productos y servicios de software diseñados para transformar tu negocio.
          Escalabilidad, confiabilidad y excelencia en cada solución.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/productos">
            <Button
              label="Explorar Productos"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            />
          </Link>
          <Link href="/servicios">
            <Button
              label="Ver Servicios"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            />
          </Link>
        </motion.div>

        {/* Auth Links */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-6 text-gray-600"
        >
          <span className="text-sm">¿Ya tienes cuenta?</span>
          <Link href="/auth/login">
            <span className="text-black font-medium hover:text-gray-700 transition-colors cursor-pointer">
              Iniciar Sesión
            </span>
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/auth/register">
            <span className="text-black font-medium hover:text-gray-700 transition-colors cursor-pointer">
              Crear Cuenta
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border border-gray-200 rounded-lg animate-float"
        animate={{ y: [0, -20, 0], rotate: [0, 90, 180] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 right-10 w-28 h-28 border-2 border-gray-300 rounded-full animate-float"
        animate={{ y: [0, 20, 0], rotate: [180, 270, 360] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />
    </section>
  );
};
