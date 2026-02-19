/**
 * Card Component
 * Componente base para mostrar contenido en tarjetas
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
        bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300
        overflow-hidden group cursor-${onClick ? 'pointer' : 'default'}
        border border-gray-100 hover:border-gray-200
        ${onClick ? 'hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {image && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};
