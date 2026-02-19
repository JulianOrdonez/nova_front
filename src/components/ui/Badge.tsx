/**
 * Badge Component
 * Para mostrar etiquetas, estados, etc
 * Paleta: Negro, Blanco, Gris
 */

import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'md' }) => {
  const variantStyles = {
    primary: 'bg-black text-white',
    success: 'bg-gray-200 text-gray-900',
    warning: 'bg-gray-300 text-gray-900',
    danger: 'bg-gray-400 text-white',
    secondary: 'bg-gray-100 text-gray-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs rounded-full font-medium',
    md: 'px-3 py-1.5 text-sm rounded-full font-medium',
  };

  return (
    <span className={`${variantStyles[variant]} ${sizeStyles[size]}`}>
      {label}
    </span>
  );
};
