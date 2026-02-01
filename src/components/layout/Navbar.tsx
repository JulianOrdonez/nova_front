'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-medium text-white tracking-wide hover:text-white/80 transition-colors duration-300">
                            NOVA
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-white/70 font-light tracking-wide hover:text-white transition-colors duration-300 relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-white/50 group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center"
                            aria-label="Toggle menu"
                        >
                            <span className={`w-6 h-px bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-6 h-px bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-6 h-px bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/90 z-40 top-16"
                        onClick={closeMenu}
                    />

                    {/* Mobile Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-md z-40 border-b border-white/10"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="text-base text-white/80 font-light tracking-wide hover:text-white transition-colors duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
};

export default Navbar;
