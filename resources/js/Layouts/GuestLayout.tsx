import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import GlassCard from '@/Components/GlassCard';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-mesh px-4 py-8 relative overflow-hidden">
            {/* Ambient Background Decorative Glows */}
            <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none"></div>

            {/* Brand Logo Header */}
            <div className="mb-6 z-10 flex flex-col items-center gap-3">
                <Link href="/" className="group flex flex-col items-center gap-2">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <span className="font-extrabold text-2xl text-white tracking-wide drop-shadow-sm">
                        Lepkom J5
                    </span>
                </Link>
                <p className="text-xs text-slate-400 font-medium tracking-wide text-center">Aktivitas, Modul, & Manajemen Praktikan</p>
            </div>

            {/* Glass Container */}
            <GlassCard className="w-full max-w-md border-white/10 shadow-2xl relative z-10 p-8 sm:p-10">
                {children}
            </GlassCard>
        </div>
    );
}
