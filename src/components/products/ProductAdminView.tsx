'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductAdminViewProps {
  product: Product;
  onUpdate?: (updatedProduct: Partial<Product>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const ProductAdminView: React.FC<ProductAdminViewProps> = ({
  product,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price !== null ? product.price.toString() : '',
    stok: product.stok !== null ? product.stok.toString() : '',
    imageUrl: product.imageUrl,
    isActive: product.isActive,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    if (formData.stok && isNaN(Number(formData.stok))) {
      newErrors.stok = 'El stock debe ser un número válido';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        stok: formData.stok.trim() !== '' ? parseInt(formData.stok, 10) : null,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      };

      await onUpdate?.(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price !== null ? product.price.toString() : '',
      stok: product.stok !== null ? product.stok.toString() : '',
      imageUrl: product.imageUrl,
      isActive: product.isActive,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto. Por favor intenta de nuevo.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-white via-gray-50 to-white text-black min-h-screen">
      {/* Admin Header */}
      <div className="bg-linear-to-r from-black via-gray-900 to-black text-white py-4 px-6 sticky top-0 z-50 shadow-xl border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold text-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              MODO ADMIN
            </motion.div>
            <span className="text-sm text-gray-300">Editando producto</span>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label="Editar producto"
                    variant="primary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-white! text-black! hover:bg-gray-200! border-2 border-gray-300"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label="Eliminar"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  />
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label={isSaving ? "Guardando..." : "Guardar"}
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-500 text-white hover:bg-green-600"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label="Cancelar"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="border-white text-white hover:bg-white hover:text-black"
                  />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <h3 className="text-2xl font-bold text-black mb-4">
                  ¿Eliminar producto?
                </h3>
                <p className="text-gray-700 mb-6">
                  Esta acción no se puede deshacer. El producto &quot;{product.name}&quot; será
                  eliminado permanentemente.
                </p>
                <div className="flex gap-4">
                  <Button
                    label={isDeleting ? "Eliminando..." : "Eliminar"}
                    variant="primary"
                    size="md"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  />
                  <Button
                    label="Cancelar"
                    variant="outline"
                    size="md"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isEditing ? (
              // Edit Mode
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Image Preview */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black">Vista previa</h2>
                  <motion.div
                    className="relative aspect-square bg-linear-to-br from-white to-gray-100 rounded-3xl overflow-hidden shadow-xl border border-gray-300 flex items-center justify-center p-12"
                    whileHover={{ scale: 1.02 }}
                  >
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt={formData.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <p className="text-sm">No hay imagen</p>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Status Preview */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-black mb-3">Estado del producto</h3>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          formData.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-gray-700">
                        {formData.isActive ? 'Activo y visible' : 'Inactivo y oculto'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-black">Editar información</h2>
                  
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Nombre del producto
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Ej: Cable USB-C Premium"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Descripción detallada del producto..."
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-2">{errors.description}</p>
                      )}
                    </div>

                    {/* Price Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Precio (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                          $
                        </span>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`w-full pl-8 pr-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                            errors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="29.99"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-2">{errors.price}</p>
                      )}
                    </div>

                    {/* Stock Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Stock
                      </label>
                      <input
                        type="text"
                        name="stok"
                        value={formData.stok}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                          errors.stok ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="50"
                      />
                      {errors.stok && (
                        <p className="text-red-500 text-sm mt-2">{errors.stok}</p>
                      )}
                    </div>

                    {/* Image URL Field */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        URL de la imagen
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                          errors.imageUrl ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.imageUrl && (
                        <p className="text-red-500 text-sm mt-2">{errors.imageUrl}</p>
                      )}
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-black">
                          Producto activo y visible
                        </span>
                      </label>
                    </div>

                    {/* Product Info */}
                    <div className="pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">ID:</span> {product.id}
                      </p>
                      <p>
                        <span className="font-semibold">Stock:</span>{' '}
                        {product.stok !== null ? product.stok : 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Categoría:</span>{' '}
                        {product.category?.name || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Creado:</span>{' '}
                        {new Date(product.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // View Mode
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Product Image */}
                <div className="space-y-6">
                  <div className="relative aspect-square bg-linear-to-br from-white to-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex items-center justify-center p-12">
                    {product.imageUrl ? (
                      <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <p className="text-sm">No hay imagen</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-semibold shadow-xl ${
                        product.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                  <div>
                    <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      {product.category?.name || 'Sin categoría'}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight mb-6">
                      {product.name}
                    </h1>
                    <div className="flex items-baseline gap-3 mb-8">
                      <span className="text-5xl font-bold text-black">
                        ${product.price !== null ? product.price.toFixed(2) : 'N/A'}
                      </span>
                      {product.price !== null && (
                        <span className="text-xl text-gray-600">USD</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-black mb-4">Descripción</h2>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {product.description.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Admin Info */}
                  <div className="bg-linear-to-r from-gray-900 to-black text-white rounded-2xl shadow-lg p-6 space-y-3">
                    <h3 className="font-bold text-lg mb-3">Información administrativa</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-400">ID:</span> {product.id}
                      </p>
                      <p>
                        <span className="text-gray-400">Stock:</span>{' '}
                        {product.stok !== null ? product.stok : 'N/A'}
                      </p>
                      <p>
                        <span className="text-gray-400">Slug:</span> {product.slug}
                      </p>
                      <p>
                        <span className="text-gray-400">Creado:</span>{' '}
                        {new Date(product.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <span className="text-gray-400">Última actualización:</span>{' '}
                        {new Date(product.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Back Navigation */}
      <section className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/productos">
            <motion.span
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300 font-medium"
              whileHover={{ x: -5 }}
            >
              <span>←</span>
              <span>Volver a productos</span>
            </motion.span>
          </Link>
          
          <div className="text-sm text-gray-500">
            Modo administrador activo
          </div>
        </div>
      </section>
    </div>
  );
};
