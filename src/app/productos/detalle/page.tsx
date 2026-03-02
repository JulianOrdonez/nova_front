import { Suspense } from 'react';
import ProductDetailContent from './ProductDetailContent';

export default function ProductDetailStaticPage() {
  return (
    <Suspense fallback={<div className="bg-white text-black min-h-screen" />}>
      <ProductDetailContent />
    </Suspense>
  );
}
