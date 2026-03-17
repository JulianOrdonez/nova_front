'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

const Navbar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAdmin, isAuthenticated, loading: authLoading, logout } = useAuth();
    const { itemCount } = useCart();

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

    const handleLogout = () => {
        logout();
        closeMenu();
        router.replace('/');
        router.refresh();
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
                            <Link href="/carrito" className="relative p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100" aria-label="Carrito de compras">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-0.5 rounded-full bg-black text-white text-[10px] font-bold leading-4.5 text-center">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </Link>
                            {authLoading ? (
                                <span className="px-4 py-2 text-sm font-medium text-gray-500">Cargando...</span>
                            ) : isAuthenticated ? (
                                <>
                                    <Link href="/mi-cuenta" className="relative p-2 text-gray-700 hover:text-black transition-colors rounded-lg hover:bg-gray-100" aria-label="Ir a mi cuenta">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275" />
                                        </svg>
                                        {isAdmin && (
                                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-500 border border-white"></span>
                                        )}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
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
                                <Link
                                    href="/carrito"
                                    onClick={closeMenu}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    Carrito {itemCount > 0 ? `(${itemCount})` : ''}
                                </Link>
                                {authLoading ? (
                                    <div className="px-4 text-sm font-medium text-gray-500">Cargando...</div>
                                ) : isAuthenticated ? (
                                    <>
                                        <Link href="/mi-cuenta" onClick={closeMenu} className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors text-left">
                                            Mi cuenta {isAdmin ? '(Admin)' : ''}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors text-left"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </>
    );
};

export default Navbar;
