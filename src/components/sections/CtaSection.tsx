/**
 * CTA (Call to Action) Section
 * Sección para incentivar login o registro
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const CtaSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Animated blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        className="relative container mx-auto max-w-4xl text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          ¿Listo para transformar tu negocio?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Accede a tu cuenta o crea una nueva para disfrutar de todas las ventajas de NØVA
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/login">
            <Button
              label="Iniciar Sesión"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black"
            />
          </Link>
          <Link href="/auth/register">
            <Button
              label="Crear Cuenta Gratis"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            />
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Obtén acceso inmediato a todos nuestros productos y servicios
        </p>
      </motion.div>
    </section>
  );
};
