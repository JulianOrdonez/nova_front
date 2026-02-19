/**
 * Register Form Component
 * Formulario de registro con validación
 * Paleta: Negro, Blanco, Gris
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { RegisterCredentials } from '@/types';

export const RegisterForm: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      setError('Completa todos los campos');
      return false;
    }
    if (credentials.password !== credentials.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (credentials.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (!agreeTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Aquí se conectará a FastAPI
      console.log('Register attempt:', { ...credentials, confirmPassword: '***' });

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Llamar a API de FastAPI
      // const response = await fetch('${API_URL}/api/auth/register', {...})
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.');
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
        <h1 className="text-3xl font-bold text-black mb-2">Crea tu cuenta</h1>
        <p className="text-gray-700 mb-8">Únete a NØVA y accede a nuestros servicios</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all text-black bg-white placeholder-gray-500"
              placeholder="Tu nombre completo"
            />
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all text-black bg-white placeholder-gray-500"
              placeholder="Mínimo 8 caracteres"
            />
            <p className="text-xs text-gray-600 mt-1">Usa mayúsculas, minúsculas y números</p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all text-black bg-white placeholder-gray-500"
              placeholder="Repite tu contraseña"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-black rounded focus:ring-2 focus:ring-gray-400 accent-black"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Acepto los{' '}
              <Link href="/terms" className="text-black hover:text-gray-800 font-medium">
                términos de servicio
              </Link>{' '}
              y la{' '}
              <Link href="/privacy" className="text-black hover:text-gray-800 font-medium">
                política de privacidad
              </Link>
            </label>
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
            label="Crear Cuenta"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          />
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-600">O regístrate con</span>
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

        {/* Sign In Link */}
        <p className="text-center text-gray-700 mt-8">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-black hover:text-gray-800 font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
