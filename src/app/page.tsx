'use client';

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { CtaSection } from '@/components/sections/CtaSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Products Section */}
      <ProductsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* CTA Section */}
      <CtaSection />
    </div>
  );
};

export default HomePage;
