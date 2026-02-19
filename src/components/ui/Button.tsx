/**
 * Button Component
 * Reutilizable para toda la aplicación
 * Paleta: Negro, Blanco, Gris
 */

import React from 'react';
import type { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-black text-white hover:bg-gray-900 focus:ring-gray-800 shadow-lg hover:shadow-xl active:scale-95',
    secondary:
      'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400 shadow-md active:scale-95',
    outline:
      'border-2 border-black text-black hover:bg-black hover:text-white focus:ring-gray-800 active:scale-95',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-lg',
    lg: 'px-7 py-3 text-lg rounded-xl',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Cargando...
        </span>
      ) : (
        label
      )}
    </button>
  );
};
