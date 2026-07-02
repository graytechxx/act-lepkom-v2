import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    [key: string]: any;
}

interface GlassPublicLayoutProps {
    children: React.ReactNode;
}

export const GlassPublicLayout: React.FC<GlassPublicLayoutProps> = ({ children }) => {
    const { auth } = usePage<any>().props;
    const [pastebinCode, setPastebinCode] = useState('');

    const [roomInfo, setRoomInfo] = useState<{ room: string | null; detected: boolean }>({
        room: null,
        detected: false
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fetch IP and Room mappings on mount
    useEffect(() => {
        fetch('/api/ip-mapping')
            .then(res => res.json())
            .then(data => {
                setRoomInfo({
                    room: data.room,
                    detected: data.detected
                });
            })
            .catch(() => {});
    }, []);

    const handleSearchPastebin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pastebinCode.trim()) {
            window.location.href = `/p/${pastebinCode.trim()}`;
        }
    };

    return (
        <div className="min-h-screen bg-mesh-light text-slate-800 font-sans selection:bg-indigo-500/25 transition-all duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/45 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-all duration-300">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                                Lepkom J5
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Beranda
                            </Link>
                            <Link href="/materi" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Materi
                            </Link>
                            <Link href="/tata-tertib" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                                Tata Tertib
                            </Link>
                        </nav>

                        {/* Search and Room status */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Pastebin Quick Find */}
                            <form onSubmit={handleSearchPastebin} className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari Pastebin..."
                                    value={pastebinCode}
                                    onChange={(e) => setPastebinCode(e.target.value)}
                                    className="w-40 xl:w-48 px-3 py-1.5 pl-8 rounded-lg text-xs border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all"
                                />
                                <svg className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </form>

                            {/* Room Detector */}
                            <div className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                roomInfo.detected 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                                <span className={`h-1.5 w-1.5 rounded-full mr-2 ${roomInfo.detected ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                                Lab: {roomInfo.room || 'Tidak Terdeteksi'}
                            </div>

                            {/* Auth Actions */}
                            {auth.user ? (
                                <Link 
                                    href="/dashboard" 
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm hover:shadow"
                                >
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="px-4 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition text-slate-600 bg-white"
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>

                        {/* Hamburger Button (Mobile) */}
                        <div className="flex md:hidden items-center gap-3">
                            <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                                roomInfo.detected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500'
                            }`}>
                                Lab: {roomInfo.room || 'N/A'}
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 pt-3 pb-4 space-y-3">
                        <Link href="/" className="block py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                            Beranda
                        </Link>
                        <Link href="/materi" className="block py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                            Materi
                        </Link>
                        <Link href="/tata-tertib" className="block py-2 text-sm font-semibold text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                            Tata Tertib
                        </Link>

                        <form onSubmit={handleSearchPastebin} className="relative">
                            <input
                                type="text"
                                placeholder="Cari Pastebin..."
                                value={pastebinCode}
                                onChange={(e) => setPastebinCode(e.target.value)}
                                className="w-full px-3 py-2 pl-9 rounded-lg text-xs border border-slate-200 bg-slate-50"
                            />
                            <svg className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>

                        {auth.user ? (
                            <Link 
                                href="/dashboard" 
                                className="block w-full text-center px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard Admin
                            </Link>
                        ) : (
                            <Link 
                                href="/login" 
                                className="block w-full text-center px-4 py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 bg-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default GlassPublicLayout;
