'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useApi';
import { getAuthHeaders, useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateProductModal } from '@/components/products/CreateProductModal';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';

const ProductsPage = () => {
    const { products, loading, error } = useProducts();
    const { isAdmin } = useAuth();
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Handle product selection for batch delete
    const toggleProductSelection = (productId: string) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // Select all products
    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map((p) => p.id));
        }
    };

    // Create new product
    const handleCreateProduct = async (productData: any) => {
        try {
            const response = await fetch(API_ENDPOINTS.products, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...API_DEFAULT_HEADERS,
                },
                credentials: 'include',
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            alert('Producto creado exitosamente');
            window.location.reload();
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    };

    // Delete selected products
    const handleDeleteSelected = async () => {
        if (selectedProducts.length === 0) {
            alert('Selecciona al menos un producto para eliminar');
            return;
        }

        const confirmDelete = confirm(
            `¿Estás seguro de eliminar ${selectedProducts.length} producto(s)?`
        );

        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            // Delete products one by one (or in batch if backend supports it)
            const deletePromises = selectedProducts.map((productId) =>
                fetch(`${API_ENDPOINTS.products}/${productId}`, {
                    method: 'DELETE',
                    headers: API_DEFAULT_HEADERS,
                    credentials: 'include',
                })
            );

            await Promise.all(deletePromises);
            
            alert('Productos eliminados exitosamente');
            setSelectedProducts([]);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting products:', error);
            alert('Error al eliminar productos. Por favor intenta de nuevo.');
        } finally {
            setIsDeleting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
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
        <div className="bg-white text-black min-h-screen">
            {/* Admin Header */}
            {isAdmin && (
                <div className="bg-black text-white py-4 px-6 sticky top-0 z-40 shadow-xl border-b-4 border-yellow-500">
                    <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold text-sm">
                                MODO ADMIN
                            </div>
                            {selectedProducts.length > 0 && (
                                <span className="text-sm text-gray-300">
                                    {selectedProducts.length} seleccionado(s)
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button
                                label="+ Crear producto"
                                variant="primary"
                                size="sm"
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-green-500! text-white! hover:bg-green-600! border-2 border-green-500"
                            />
                            {selectedProducts.length > 0 && (
                                <Button
                                    label={`Eliminar (${selectedProducts.length})`}
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="border-red-500! text-red-500! hover:bg-red-500! hover:text-white!"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <section className="bg-white py-20 md:py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-4">
                            Productos NØVA
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 font-normal">
                            Tecnología profesional, rendimiento confiable y diseño minimalista
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-gray-50 py-24 md:py-32 px-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    {/* Select All (Admin Mode) */}
                    {isAdmin && products.length > 0 && (
                        <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <input
                                type="checkbox"
                                checked={selectedProducts.length === products.length}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <label className="text-sm font-medium text-black cursor-pointer" onClick={toggleSelectAll}>
                                Seleccionar todos los productos
                            </label>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-block">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                            </div>
                            <p className="text-gray-600 mt-4">Cargando productos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-red-600">Error: {error}</p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {products.map((product) => (
                                <motion.div key={product.id} variants={itemVariants} className="relative">
                                    {/* Admin Checkbox */}
                                    {isAdmin && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleProductSelection(product.id)}
                                                className="w-6 h-6 rounded border-gray-300 text-black focus:ring-black cursor-pointer bg-white shadow-lg"
                                            />
                                        </div>
                                    )}
                                    
                                    <Card
                                        title={product.name}
                                        description={product.description}
                                        image={product.imageUrl}
                                    >
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                {product.price !== null ? (
                                                    <span className="text-2xl font-bold text-black">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500 italic">Consultar precio</span>
                                                )}
                                                {product.category && (
                                                    <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
                                                )}
                                            </div>
                                            <Link href={`/productos/${product.slug}`}>
                                                <Button label="Ver detalles" variant="primary" size="sm" />
                                            </Link>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-600 mb-4">No hay productos disponibles</p>
                            {isAdmin && (
                                <Button
                                    label="Crear primer producto"
                                    variant="primary"
                                    size="lg"
                                    onClick={() => setIsCreateModalOpen(true)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-24 md:py-32 px-6 border-t border-gray-200">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6">
                            ¿Te interesa un producto?
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 mb-12 leading-relaxed">
                            Contáctanos para conocer más detalles, precios especiales y disponibilidad.
                        </p>
                        <Link href="/contacto">
                            <Button label="Ir a contacto" variant="outline" size="lg" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Create Product Modal */}
            <CreateProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateProduct}
            />
        </div>
    );
};

export default ProductsPage;
