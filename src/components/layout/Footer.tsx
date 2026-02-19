'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Footer Component
 * Footer con estilos minimalista en blanco, negro y gris
 * Paleta: Negro, Blanco, Gris
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/productos', label: 'Productos' },
        { href: '/servicios', label: 'Servicios' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/contacto', label: 'Contacto' }
    ];

    return (
        <footer className="bg-black border-t border-gray-800">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                            NØVA
                        </h3>
                        <p className="text-sm text-gray-400 font-normal leading-relaxed">
                            Soluciones de software profesionales y minimalistas
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <p className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                            Explorar
                        </p>
                        <nav className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-400 font-normal hover:text-white transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Empty Columns for Balance */}
                    <div />
                    <div />
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-800 mb-8" />

                {/* Legal Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-gray-500 font-normal">
                        © {currentYear} NØVA. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        <Link
                            href="#"
                            className="text-xs text-gray-500 font-normal hover:text-gray-300 transition-colors duration-300"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-gray-500 font-normal hover:text-gray-300 transition-colors duration-300"
                        >
                            Términos
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
