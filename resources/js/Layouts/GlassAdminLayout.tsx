import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

interface GlassAdminLayoutProps {
    children: React.ReactNode;
}

export const GlassAdminLayout: React.FC<GlassAdminLayoutProps> = ({ children }) => {
    const { auth, flash } = usePage<PageProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Watch for flash notifications
    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: 'success' });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash.error) {
            setToast({ message: flash.error, type: 'error' });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleLogout = () => {
        router.post('/logout');
    };

    const currentPath = window.location.pathname;

    const navItems = [
        { label: 'Dasbor', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { label: 'Materi & Modul', path: '/admin/materials', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { label: 'File Upload', path: '/admin/uploads', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
        { label: 'Catatan Pribadi', path: '/admin/notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { label: 'Pastebin Saya', path: '/admin/pastebins', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'Ruang Chat', path: '/admin/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ];

    // Master Data links (Superadmin / Staff only)
    const masterItems = [
        { label: 'Tingkat Studi', path: '/admin/levels', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { label: 'Mata Praktikum', path: '/admin/courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253' },
        { label: 'Pengumuman', path: '/admin/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
        { label: 'Tata Tertib', path: '/admin/rules', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { label: 'Kalender Lab', path: '/admin/calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'Kelola Jadwal', path: '/admin/schedules', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { label: 'Mapping IP Ruang', path: '/admin/ip-mappings', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
        { label: 'Log Aktivitas', path: '/admin/activity-logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    ];

    const superadminItems = [
        { label: 'Kelola Asisten', path: '/admin/assistants', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
    ];

    const isPrivileged = auth.user.role === 'superadmin' || auth.user.role === 'staff';

    return (
        <div className="min-h-screen bg-mesh text-slate-100 font-sans relative selection:bg-indigo-500/25 overflow-x-hidden">
            {/* Ambient Background Decorative Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]"></div>
                <div className="absolute bottom-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]"></div>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-white/5 backdrop-blur-lg lg:flex flex-col">
                <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10 shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <span className="font-extrabold text-base bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Lepkom J5 Admin
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-light">
                    {/* Navigation Menu */}
                    <div className="space-y-1.5">
                        <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Aktivitas</p>
                        {navItems.map((item) => {
                            const active = currentPath === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                        active
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                                >
                                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Master Data Menu */}
                    {isPrivileged && (
                        <div className="space-y-1.5">
                            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Master Data & Log</p>
                            {masterItems.map((item) => {
                                const active = currentPath === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                            active
                                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                        }`}
                                    >
                                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Superadmin Menu */}
                    {auth.user.role === 'superadmin' && (
                        <div className="space-y-1.5">
                            <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Administrasi</p>
                            {superadminItems.map((item) => {
                                const active = currentPath === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                            active
                                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10'
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                        }`}
                                    >
                                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Profile card bottom */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <Link href="/profile" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition duration-200 group">
                        <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-extrabold text-xs">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{auth.user.name}</p>
                            <p className="text-3xs font-extrabold uppercase text-indigo-400 tracking-wider mt-0.5">{auth.user.role}</p>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Pane */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Header (Top Nav) */}
                <header className="h-16 border-b border-white/10 bg-white/3 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center px-4 sm:px-6 lg:px-8">
                    {/* Hamburg menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div></div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-2xs font-bold text-slate-400 hover:text-slate-200 transition"
                        >
                            Lihat Halaman Publik
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-3.5 py-1.5 rounded-lg text-2xs font-extrabold uppercase tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition"
                        >
                            Keluar
                        </button>
                    </div>
                </header>

                {/* Content wrapper */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>

                    {/* Content */}
                    <div className="relative w-64 bg-slate-900 border-r border-white/10 flex flex-col z-10 p-5">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-extrabold text-sm text-slate-200">Menu Navigasi</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/5 text-slate-400"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6">
                            {/* Nav */}
                            <div className="space-y-1">
                                {navItems.map((item) => {
                                    const active = currentPath === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                                                active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                            </svg>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Privileged */}
                            {isPrivileged && (
                                <div className="space-y-1">
                                    <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Master Data</p>
                                    {masterItems.map((item) => {
                                        const active = currentPath === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                                                    active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                                </svg>
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Mobile Superadmin Menu */}
                            {auth.user.role === 'superadmin' && (
                                <div className="space-y-1">
                                    <p className="text-4xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Administrasi</p>
                                    {superadminItems.map((item) => {
                                        const active = currentPath === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                                                    active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                                                }`}
                                            >
                                                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                                </svg>
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Frosted Slide-In Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-slide-in max-w-sm flex items-start gap-3 bg-white/10 border-white/20">
                    <div className={`p-1.5 rounded-lg ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {toast.type === 'success' ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">Notifikasi</p>
                        <p className="text-xs text-slate-200 mt-0.5 leading-snug">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassAdminLayout;
