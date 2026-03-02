/**
 * Card Component
 * Componente base para mostrar contenido en tarjetas con efectos 3D
 * Paleta: Negro, Blanco, Gris
 */

import React from 'react';
import type { CardProps } from '@/types';

export const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500
        overflow-hidden group cursor-${onClick ? 'pointer' : 'default'}
        border border-gray-200 hover:border-gray-300
        transform hover:-translate-y-2 hover:scale-[1.02]
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onClick={onClick}
    >
      {image && (
        <div className="h-56 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/500x500?text=NOVA';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};
