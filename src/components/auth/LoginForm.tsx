/**
 * Login Form Component
 * Formulario de inicio de sesión con validación
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { LoginCredentials } from '@/types';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Aquí se conectará a FastAPI
      console.log('Login attempt:', credentials);

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Llamar a API de FastAPI
      // const response = await fetch('${API_URL}/api/auth/login', {...})
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-black mb-2">Bienvenido de vuelta</h1>
        <p className="text-gray-700 mb-8">Inicia sesión en tu cuenta de NØVA</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all text-black bg-white placeholder-gray-500"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Contraseña
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-gray-700 hover:text-black font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all text-black bg-white placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-black text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            label="Iniciar Sesión"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          />
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-600">O continúa con</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-black">
            Google
          </button>
          <button className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-black">
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-700 mt-8">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-black hover:text-gray-800 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
