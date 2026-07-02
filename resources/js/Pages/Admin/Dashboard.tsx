import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
    creator?: {
        name: string;
    };
}

interface CalEvent {
    id: number;
    title: string;
    description: string;
    start: string;
}

interface OnlineAssistant {
    id: number;
    name: string;
    role: string;
    active_room: string | null;
    is_pj: boolean;
    last_seen_at: string;
}

interface DashboardProps {
    userCount: number;
    asistenCount: number;
    levelCount: number;
    materialCount: number;
    announcementCount: number;
    onlineAssistants: OnlineAssistant[];
    recentAnnouncements: Announcement[];
    upcomingEvents: CalEvent[];
    [key: string]: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
    userCount,
    asistenCount,
    levelCount,
    materialCount,
    announcementCount,
    onlineAssistants,
    recentAnnouncements,
    upcomingEvents
}) => {
    const { auth } = usePage<any>().props;

    const stats = [
        { label: 'Total Asisten', value: asistenCount, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-violet-600/25 to-indigo-600/25' },
        { label: 'Tingkat Praktikum', value: levelCount, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'from-blue-600/25 to-cyan-600/25' },
        { label: 'File Materi', value: materialCount, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'from-teal-600/25 to-emerald-600/25' },
        { label: 'Pengumuman', value: announcementCount, icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', color: 'from-pink-600/25 to-rose-600/25' },
    ];

    const handleTogglePj = () => {
        router.post('/admin/toggle-pj');
    };

    return (
        <GlassAdminLayout>
            <Head title="Dasbor Admin" />

            <div className="space-y-8 animate-fade-in">
                {/* Welcoming Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1">
                            Selamat Datang Kembali, {auth.user.name}!
                        </h1>
                        <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                            Akses Portal: {auth.user.role} • Lepkom Gunadarma J5
                        </p>
                    </div>

                    {/* Quick PJ Toggle Switch in Header */}
                    <button
                        onClick={handleTogglePj}
                        className={`px-4 py-2.5 rounded-xl text-3xs font-black uppercase tracking-wider transition-all duration-200 border ${
                            auth.user.is_pj 
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30' 
                                : 'bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30'
                        }`}
                    >
                        {auth.user.is_pj ? '🔴 Status PJ: Aktif (Matikan)' : '🟢 Aktifkan Status PJ Ruang'}
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <GlassCard key={idx} className="flex items-center gap-4 relative overflow-hidden border-white/5 shadow-md">
                            <div className="absolute right-0 top-0 h-16 w-16 bg-white/3 rounded-bl-full pointer-events-none"></div>
                            
                            <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center shrink-0 border border-white/10`}>
                                <svg className="h-5 w-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-4xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                                <p className="text-lg sm:text-xl font-black text-white leading-none">{stat.value}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Core Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Active Online Assistants & PJs */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard className="border-white/5 shadow-md">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                    <svg className="h-4.5 w-4.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Asisten Online & Penanggung Jawab (PJ)
                                </h2>
                                <span className="text-3xs font-extrabold uppercase bg-teal-500/10 text-teal-300 border border-teal-500/10 px-2 py-0.5 rounded-lg animate-pulse">
                                    {onlineAssistants.length} Aktif
                                </span>
                            </div>

                            {onlineAssistants.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Tidak ada asisten/staff yang terdeteksi aktif saat ini.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2">Nama Pengajar</th>
                                                <th className="pb-3 px-2">Deteksi Lokasi</th>
                                                <th className="pb-3 px-2">Peran PJ</th>
                                                <th className="pb-3 pl-2 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {onlineAssistants.map((ast) => (
                                                <tr key={ast.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-3 pr-2 font-bold">
                                                        <div className="text-slate-200 text-sm leading-snug">{ast.name}</div>
                                                        <div className="text-3xs text-slate-500 font-bold uppercase tracking-wider">{ast.role}</div>
                                                    </td>
                                                    <td className="py-3 px-2 whitespace-nowrap">
                                                        <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wider ${
                                                            ast.active_room 
                                                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/10' 
                                                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                                                        }`}>
                                                            {ast.active_room ? `Lab ${ast.active_room}` : 'Remote / Luar'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 whitespace-nowrap">
                                                        {ast.is_pj ? (
                                                            <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/10 shadow-sm animate-pulse">
                                                                ⭐ PJ AKTIF
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 text-3xs font-bold uppercase">Asisten Biasa</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 pl-2 text-right whitespace-nowrap font-bold">
                                                        <span className="inline-flex items-center gap-1 text-teal-400 text-3xs uppercase tracking-wider">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                                                            Online
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Right Column: Mini Info (Announcements and Upcoming Events) */}
                    <div className="space-y-6">
                        {/* Bulletins */}
                        <GlassCard className="border-white/5 shadow-md">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="h-4 w-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Pengumuman Penting
                            </h3>

                            {recentAnnouncements.length === 0 ? (
                                <p className="text-slate-500 text-xs font-bold text-center py-6">Tidak ada pengumuman baru.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentAnnouncements.map((item) => (
                                        <div key={item.id} className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1 hover:border-white/10 transition">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-extrabold text-slate-200 text-2xs truncate pr-2" title={item.title}>
                                                    {item.title}
                                                </h4>
                                                <span className="text-4xs text-slate-500 font-bold uppercase shrink-0">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-3xs text-slate-400 line-clamp-2 leading-relaxed">
                                                {item.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </GlassCard>

                        {/* Events list */}
                        <GlassCard className="border-white/5 shadow-md">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Jadwal Terdekat
                            </h3>

                            {upcomingEvents.length === 0 ? (
                                <p className="text-slate-500 text-xs font-bold text-center py-6">Belum ada agenda terjadwal.</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1 hover:border-white/10 transition">
                                            <h4 className="font-extrabold text-slate-200 text-2xs truncate" title={event.title}>{event.title}</h4>
                                            <p className="text-4xs text-emerald-400 font-bold">
                                                {new Date(event.start).toLocaleDateString('id-ID', {
                                                    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </GlassCard>
                    </div>

                </div>
            </div>
        </GlassAdminLayout>
    );
};

export default Dashboard;
