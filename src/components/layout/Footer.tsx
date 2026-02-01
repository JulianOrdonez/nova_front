'use client';

import React from 'react';
import Link from 'next/link';

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
        <footer className="bg-black border-t border-white/10">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-medium text-white tracking-wide">
                            NOVA
                        </h3>
                        <p className="text-sm text-white/60 font-light tracking-wide leading-relaxed">
                            Tecnología pensada para verse bien y funcionar mejor.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <p className="text-xs font-medium text-white/40 tracking-widest uppercase">
                            Explorar
                        </p>
                        <nav className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-white/70 font-light tracking-wide hover:text-white transition-colors duration-300"
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
                <div className="h-px bg-white/10 mb-8" />

                {/* Legal Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-white/40 font-light tracking-wide">
                        © {currentYear} NOVA. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        <Link
                            href="#"
                            className="text-xs text-white/40 font-light tracking-wide hover:text-white/60 transition-colors duration-300"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-white/40 font-light tracking-wide hover:text-white/60 transition-colors duration-300"
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
