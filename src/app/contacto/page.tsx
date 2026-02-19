'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactMessage } from '@/hooks/useApi';

const ContactoPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            await submitContactMessage(formData.name, formData.email, formData.message);
            
            // Mostrar confirmación
            setIsSubmitted(true);
            
            // Resetear formulario después de 3 segundos
            setTimeout(() => {
                setFormData({ name: '', email: '', message: '' });
                setIsSubmitted(false);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Hero Section */}
            <section className="py-24 md:py-32 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-6">
                            Conectemos
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            Cuéntanos sobre tu proyecto, pregunta o inquietud. Responderemos lo antes posible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onSubmit={handleSubmit}
                        className="space-y-8 bg-white border border-gray-200 rounded-xl p-8"
                    >
                        {/* Name Field */}
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-sm font-medium text-black">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all"
                                placeholder="Tu nombre"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-sm font-medium text-black">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-3">
                            <label htmlFor="message" className="text-sm font-medium text-black">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-300 transition-all resize-none"
                                placeholder="Cuéntanos más sobre tu proyecto..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 space-y-3">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-3 bg-gray-100 border border-gray-300 rounded-lg"
                                >
                                    <p className="text-black font-medium">
                                        {error}
                                    </p>
                                </motion.div>
                            )}
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-3 bg-gray-100 rounded-lg"
                                >
                                    <p className="text-black font-medium">
                                        Mensaje recibido. Nos pondremos en contacto pronto.
                                    </p>
                                </motion.div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border border-current border-t-transparent"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar mensaje'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Info Note */}
                        <p className="text-xs text-gray-500 text-center">
                            Tus datos serán procesados confidencialmente. Consulta nuestra política de privacidad.
                        </p>
                    </motion.form>
                </div>
            </section>

            {/* Alternative Contact Methods */}
            <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                            También puedes contactarnos por
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-black">Email directo</p>
                                <p className="text-base text-gray-700">
                                    soporte@ugreen.com
                                </p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-black">Teléfono</p>
                                <p className="text-base text-gray-700">
                                    +1 (888) 888-8888
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Response Time */}
            <section className="py-12 px-6 bg-gray-50 border-t border-gray-200 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs text-gray-500"
                >
                    Normalmente respondemos dentro de 24–48 horas.
                </motion.p>
            </section>
        </div>
    );
};

export default ContactoPage;
