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
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
            <section className="py-24 md:py-32 px-6 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-wide mb-6">
                            Conectemos
                        </h1>
                        <p className="text-base md:text-lg text-white/70 font-light tracking-wide leading-relaxed">
                            Cuéntanos sobre tu proyecto, pregunta o inquietud. Responderemos lo antes posible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 md:py-32 px-6 bg-black">
                <div className="max-w-2xl mx-auto">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >
                        {/* Name Field */}
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-sm font-medium text-white/80 tracking-wide">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all duration-300 font-light"
                                placeholder="Tu nombre"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-sm font-medium text-white/80 tracking-wide">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all duration-300 font-light"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-3">
                            <label htmlFor="message" className="text-sm font-medium text-white/80 tracking-wide">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all duration-300 font-light resize-none"
                                placeholder="Cuéntanos más sobre tu proyecto..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 space-y-3">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-3 bg-red-500/10 border border-red-500/30 rounded-sm"
                                >
                                    <p className="text-red-400 font-light tracking-wide">
                                        ✗ {error}
                                    </p>
                                </motion.div>
                            )}
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-3 bg-white/10 rounded-sm"
                                >
                                    <p className="text-white font-light tracking-wide">
                                        ✓ Mensaje recibido. Nos pondremos en contacto pronto.
                                    </p>
                                </motion.div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black py-3 rounded-sm font-medium tracking-wide hover:bg-black hover:text-white border border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <p className="text-xs text-white/40 font-light tracking-wide text-center">
                            Tus datos serán procesados confidencialmente. Consulta nuestra política de privacidad.
                        </p>
                    </motion.form>
                </div>
            </section>

            {/* Alternative Contact Methods */}
            <section className="py-24 md:py-32 px-6 bg-black/50 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-center space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-wide">
                            También puedes contactarnos por
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-white/80 tracking-wide">Email directo</p>
                                <p className="text-base text-white/70 font-light">
                                    soporte@ugreen.com
                                </p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-white/80 tracking-wide">Teléfono</p>
                                <p className="text-base text-white/70 font-light">
                                    +1 (888) 888-8888
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Response Time */}
            <section className="py-12 px-6 bg-black border-t border-white/10 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-xs text-white/40 font-light tracking-wide"
                >
                    Normalmente respondemos dentro de 24–48 horas.
                </motion.p>
            </section>
        </div>
    );
};

export default ContactoPage;
