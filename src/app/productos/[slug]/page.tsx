'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { ProductAdminView } from '@/components/products/ProductAdminView';
import { useProducts } from '@/hooks/useApi';
import { getAuthHeaders, useAuth } from '@/hooks/useAuth';
import API_ENDPOINTS, { API_DEFAULT_HEADERS } from '@/config/api';
import type { Product } from '@/types';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const router = useRouter();
    const { slug } = React.use(params);
    const { products, loading, error } = useProducts();
    const { isAdmin } = useAuth();

    // Buscar producto por slug en la lista cargada
    const product = useMemo(() => {
        return products.find(p => p.slug === slug) || null;
    }, [products, slug]);

    // Handle product update (for admin mode)
    const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
        if (!product) return;

        try {
            // Convertir a formato snake_case para el backend
            const backendData: any = {
                name: updatedProduct.name,
                slug: product.slug, // Mantener el slug original
                description: updatedProduct.description,
                price: updatedProduct.price,
                stok: updatedProduct.stok,
                image_url: updatedProduct.imageUrl,
                category_id: product.category?.id || 1, // Asegurar que tenga categoría
                is_active: updatedProduct.isActive !== undefined ? updatedProduct.isActive : true,
            };

            console.log('Sending update data:', backendData);

            const response = await fetch(`${API_ENDPOINTS.products}/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...API_DEFAULT_HEADERS,
                },
                credentials: 'include',
                body: JSON.stringify(backendData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                throw new Error('Error al actualizar el producto');
            }

            alert('Producto actualizado exitosamente');
            window.location.reload();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    // Handle product deletion (for admin mode)
    const handleDeleteProduct = async () => {
        if (!product) return;

        try {
            const response = await fetch(`${API_ENDPOINTS.products}/${product.id}`, {
                method: 'DELETE',
                headers: API_DEFAULT_HEADERS,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            alert('Producto eliminado exitosamente');
            router.push('/productos');
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="bg-white text-black min-h-screen flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mb-4"></div>
                    <p className="text-gray-600">Cargando producto...</p>
                </motion.div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="bg-white text-black min-h-screen flex items-center justify-center px-6">
                <motion.div
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-6xl mb-6">😕</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Producto no encontrado
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {error || 'El producto que buscas no existe'}
                    </p>
                    <Link href="/productos">
                        <Button label="Ver todos los productos" variant="primary" size="lg" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {isAdmin ? (
                <ProductAdminView
                    product={product}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                />
            ) : (
                <ProductDetailView product={product} />
            )}
        </>
    );
}
