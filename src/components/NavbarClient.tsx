'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarClient: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="flex items-center space-x-4">
            <Link
                href="/create"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/create'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
            >
                Create Event
            </Link>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors">
                Login
            </button>
        </div>
    );
};

export default NavbarClient; 