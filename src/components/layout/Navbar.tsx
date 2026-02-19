'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Inicio' },
        { href: '/productos', label: 'Productos' },
        { href: '/servicios', label: 'Servicios' },
        { href: '/nosotros', label: 'Nosotros' },
        { href: '/contacto', label: 'Contacto' }
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="font-bold text-2xl text-black hover:text-gray-700 transition-colors duration-300 tracking-tight"
                        >
                            NØVA
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-600 font-medium hover:text-black transition-colors duration-300 relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/auth/login">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                                    Iniciar Sesión
                                </button>
                            </Link>
                            <Link href="/auth/register">
                                <Button
                                    label="Registrarse"
                                    variant="primary"
                                    size="sm"
                                />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
                            aria-label="Toggle menu"
                        >
                            <span className={`w-6 h-px bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-6 h-px bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-6 h-px bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 top-16"
                        onClick={closeMenu}
                    />

                    {/* Mobile Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-16 left-0 right-0 bg-white z-40 border-b border-gray-100"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="text-base text-gray-700 font-medium hover:text-black transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            {/* Mobile Auth Section */}
                            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                                <Link href="/auth/login" onClick={closeMenu}>
                                    <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors text-left">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link href="/auth/register" onClick={closeMenu}>
                                    <Button
                                        label="Registrarse"
                                        variant="primary"
                                        size="sm"
                                        className="w-full"
                                    />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
};

export default Navbar;
