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

    // Rules Popup States
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [rules, setRules] = useState<any[]>([]);
    const [loadingRules, setLoadingRules] = useState(false);

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

    // Auto popup rules on first session load
    useEffect(() => {
        const hasSeen = sessionStorage.getItem('tata_tertib_seen');
        if (!hasSeen) {
            sessionStorage.setItem('tata_tertib_seen', 'true');
            window.location.hash = 'tata-tertib';
        }
    }, []);

    // Monitor URL hash to trigger Rules popup
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#tata-tertib') {
                setIsRulesOpen(true);
                if (rules.length === 0) {
                    setLoadingRules(true);
                    fetch('/api/rules')
                        .then(res => res.json())
                        .then(data => {
                            setRules(data);
                            setLoadingRules(false);
                        })
                        .catch(() => setLoadingRules(false));
                }
            } else {
                setIsRulesOpen(false);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // initial check on mount

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [rules.length]);

    const handleOpenRules = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.hash = 'tata-tertib';
    };

    const handleCloseRules = () => {
        setIsRulesOpen(false);
        // Clear hash from URL cleanly
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
    };

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

            {/* Tata Tertib Glassmorphic Modal */}
            {isRulesOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                        onClick={handleCloseRules}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col animate-scale-in">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-200/50 bg-white/20">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base uppercase tracking-wider">Tata Tertib Praktikum</h3>
                                    <p className="text-4xs text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Lepkom Gunadarma J5</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleCloseRules}
                                className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-500 hover:text-slate-700 transition"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/10">
                            {loadingRules ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-2">
                                    <div className="h-8 w-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                    <span className="text-3xs font-extrabold text-indigo-600 uppercase tracking-widest">Memuat Aturan...</span>
                                </div>
                            ) : rules.length === 0 ? (
                                <p className="text-slate-400 font-semibold text-xs text-center py-12">Belum ada data tata tertib praktikum saat ini.</p>
                            ) : (
                                <div className="space-y-4">
                                    {rules.map((rule, idx) => (
                                        <div key={rule.id} className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-md border border-white/40 p-4 shadow-sm hover:shadow-md transition">
                                            {/* Large Number BG decoration */}
                                            <div className="absolute right-4 bottom-[-10px] text-6xl font-black text-slate-100/50 select-none pointer-events-none">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div className="relative z-10 flex gap-3">
                                                <div className="h-6 w-6 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{rule.title}</h4>
                                                    <p className="text-slate-600 text-3xs sm:text-2xs whitespace-pre-line leading-relaxed">
                                                        {rule.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t border-slate-200/50 bg-white/20 flex justify-end">
                            <button
                                onClick={handleCloseRules}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-3xs font-black uppercase tracking-wider hover:bg-indigo-700 transition shadow-md shadow-indigo-600/10 cursor-pointer"
                            >
                                Saya Mengerti & Setuju
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassPublicLayout;
