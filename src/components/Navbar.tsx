'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarClient from './NavbarClient';

const Navbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        let lastScrollY = 0;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 64) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 transition-transform duration-300 ${mounted && !isVisible ? '-translate-y-full' : 'translate-y-0'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link href="/home" className="flex items-center">
                        <span className="text-xl font-light tracking-wide text-white">
                            when4meet
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <NavbarClient />
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 