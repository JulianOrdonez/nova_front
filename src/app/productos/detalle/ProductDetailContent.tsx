'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import ProductDetailPageClient from '@/components/products/ProductDetailPageClient';

export default function ProductDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  if (!slug) {
    return (
      <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-bold">Producto no especificado</h1>
        <p className="text-gray-700 text-lg">Falta el parámetro de producto en la URL.</p>
        <Link href="/productos">
          <Button label="Volver a productos" variant="outline" size="lg" />
        </Link>
      </div>
    );
  }

  return <ProductDetailPageClient slug={slug} />;
}
