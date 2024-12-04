import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Update login status based on token presence
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token on logout
        setIsLoggedIn(false);
    };

    return (
        <header className="bg-[#1d2e38] shadow-md">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to={'/'} className="block text-teal-600">
                        <img src="/logo.png" className='h-[60px]' alt="" />
                    </Link>
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">
                            <li><Link className="text-white text-[20px] hover:text-gray-500/75" to="/">Home</Link></li>
                            <li><Link className="text-white text-[20px] hover:text-gray-500/75" to="/about">About</Link></li>
                            {/* Add more links if needed */}
                        </ul>
                    </nav>
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <Link to={'/create-issue'} className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Raise Issue
                                </Link>
                                <button onClick={handleLogout} className="rounded-md bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Logout
                                </button>
                                <div className="rounded-full bg-gray-200 p-2">
                                    {/* Placeholder for user avatar */}
                                    <span className="text-gray-600 font-bold">U</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to={'/login'} className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow">
                                    Login
                                </Link>
                                <Link to={'/signup'} className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 shadow">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
