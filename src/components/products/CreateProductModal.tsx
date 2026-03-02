'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<void>;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stok: '',
    imageUrl: '',
    categoryId: 1, // Default category
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Clear error
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

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.slug.trim()) newErrors.slug = 'El slug es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }
    if (formData.stok && isNaN(Number(formData.stok))) {
      newErrors.stok = 'El stock debe ser un número válido';
    }
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'La URL de la imagen es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        stok: formData.stok.trim() !== '' ? parseInt(formData.stok, 10) : null,
        image_url: formData.imageUrl,
        category_id: formData.categoryId,
        is_active: formData.isActive,
      };

      await onSubmit(productData);
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        stok: '',
        imageUrl: '',
        categoryId: 1,
        isActive: true,
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 px-8 py-6">
                <h2 className="text-3xl font-bold text-black">Crear nuevo producto</h2>
                <p className="text-gray-600 mt-2">Completa la información del producto</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Nombre del producto *
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
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                {/* Slug (auto-generated but editable) */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                      errors.slug ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="cable-usb-c-premium"
                  />
                  {errors.slug && <p className="text-red-500 text-sm mt-2">{errors.slug}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Descripción detallada del producto..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-2">{errors.description}</p>
                  )}
                </div>

                {/* Price */}
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
                  {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
                </div>

                {/* Stock */}
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
                  {errors.stok && <p className="text-red-500 text-sm mt-2">{errors.stok}</p>}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    URL de la imagen *
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
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <label className="text-sm font-semibold text-black cursor-pointer">
                    Producto activo y visible
                  </label>
                </div>

                {/* Footer Buttons inside form */}
                <div className="border-t border-gray-200 pt-6 mt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black text-white hover:bg-gray-900 px-7 py-3 text-lg rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creando...' : 'Crear producto'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white px-7 py-3 text-lg rounded-xl font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
