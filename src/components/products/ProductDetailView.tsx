'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Mock additional images for gallery (in production, these would come from the product)
  const images = [
    product.imageUrl,
    product.imageUrl, // Placeholder - in production, add more images
  ];

  const features = [
    { icon: '✓', text: 'Producto original certificado' },
    { icon: '🚀', text: 'Envío express 24-48h' },
    { icon: '🛡️', text: 'Garantía oficial del fabricante' },
    { icon: '💎', text: 'Calidad premium garantizada' },
  ];

  const specifications = [
    { label: 'Categoría', value: product.category?.name || 'N/A' },
    { label: 'Stock', value: product.stok !== null ? product.stok : 'N/A' },
    { label: 'Disponibilidad', value: product.isActive ? 'En Stock' : 'Agotado' },
    { label: 'Última actualización', value: new Date(product.updatedAt).toLocaleDateString('es-ES') },
  ];

  return (
    <div className="bg-linear-to-b from-white via-gray-50 to-white text-black">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 -right-20 w-96 h-96 bg-linear-to-br from-gray-200/30 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-linear-to-tr from-gray-300/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Hero Section with 3D Product */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Product Image Gallery with 3D Effect */}
          <motion.div
            style={{ y, scale }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main Image Container with 3D Transform */}
            <motion.div
              className="relative aspect-square bg-linear-to-br from-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
              animate={{
                rotateX: isImageHovered ? 5 : 0,
                rotateY: isImageHovered ? 5 : 0,
                scale: isImageHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
            >
              {/* Glowing Border Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-gray-400 via-white to-gray-400 opacity-0 blur-xl"
                animate={{ opacity: isImageHovered ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Product Image */}
              <motion.div
                className="relative w-full h-full flex items-center justify-center p-12"
                animate={{ z: isImageHovered ? 50 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage] || '/images/products/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Floating Badge */}
              {product.isActive && (
                <motion.div
                  className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  Disponible
                </motion.div>
              )}
            </motion.div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <motion.div
                className="flex gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === idx
                        ? 'border-black shadow-lg scale-105'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                {product.category?.name || 'Producto'}
              </span>
            </motion.div>

            {/* Product Name */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {product.name}
            </motion.h1>

            {/* Price Section with Animated Counter */}
            <motion.div
              className="flex items-baseline gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <span className="text-5xl md:text-6xl font-bold bg-linear-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                ${product.price !== null ? product.price.toFixed(2) : 'N/A'}
              </span>
              {product.price !== null && (
                <span className="text-xl text-gray-600">USD</span>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/contacto" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    label="Solicitar información"
                    variant="primary"
                    size="lg"
                    className="w-full shadow-2xl hover:shadow-black/20"
                  />
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  label="Cotizar"
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('/contacto', '_blank')}
                />
              </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Description Section with Glassmorphism */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 md:p-16 shadow-2xl border border-gray-200"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Descripción del producto
            </motion.h2>
            
            <motion.div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {product.description.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-32 px-6 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-black mb-12 text-center tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Especificaciones técnicas
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {specifications.map((spec, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <dt className="text-sm font-medium text-gray-600 mb-2">{spec.label}</dt>
                <dd className="text-xl font-bold text-black">{spec.value}</dd>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA with 3D Effect */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #fff, #e5e5e5, #fff)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ¿Listo para adquirir este producto?
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Contáctanos ahora y obtén asesoría personalizada para tu compra
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/contacto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    label="Contactar ahora"
                    variant="primary"
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 shadow-2xl border-2 border-white"
                  />
                </motion.div>
              </Link>
              
              <Link href="/productos">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    label="Ver más productos"
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black"
                  />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Back Navigation */}
      <section className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Link href="/productos">
            <motion.span
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300 font-medium"
              whileHover={{ x: -5 }}
            >
              <span>←</span>
              <span>Volver a productos</span>
            </motion.span>
          </Link>
        </div>
      </section>
    </div>
  );
};
