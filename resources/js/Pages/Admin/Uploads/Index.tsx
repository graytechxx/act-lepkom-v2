import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';

interface Level {
    id: number;
    name: string;
}

interface Course {
    id: number;
    name: string;
    level_id: number;
}

interface User {
    id: number;
    name: string;
}

interface Upload {
    id: number;
    user_id: number | null;
    student_name: string | null;
    student_npm: string | null;
    level_id: number | null;
    course_id: number | null;
    original_name: string;
    stored_path: string;
    mime_type: string;
    size: number;
    room_name: string | null;
    created_at: string;
    user: User | null;
    level: Level | null;
    course: Course | null;
}

interface UploadsProps {
    uploads: Upload[];
    levels: Level[];
}

export const Index: React.FC<UploadsProps> = ({ uploads, levels }) => {
    const [selectedLevelId, setSelectedLevelId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Polling and notification states
    const [notifications, setNotifications] = useState<{ id: number; student: string; filename: string }[]>([]);
    const knownIdsRef = useRef<number[]>(uploads.map(u => u.id));

    // Auto refresh: Poll for new uploads using Inertia reload
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['uploads'] });
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Listen to uploads changes and spawn notification bubbles for newly added items
    useEffect(() => {
        const newUploads = uploads.filter(u => !knownIdsRef.current.includes(u.id));
        if (newUploads.length > 0) {
            const newNotifs = newUploads.map(u => ({
                id: u.id,
                student: u.student_name || u.user?.name || 'Guest',
                filename: u.original_name
            }));
            setNotifications(prev => [...prev, ...newNotifs]);

            // Auto-clear notification bubble after 4 seconds
            newNotifs.forEach(n => {
                setTimeout(() => {
                    setNotifications(prev => prev.filter(x => x.id !== n.id));
                }, 4000);
            });
            knownIdsRef.current = uploads.map(u => u.id);
        } else {
            knownIdsRef.current = uploads.map(u => u.id);
        }
    }, [uploads]);

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berkas laporan tugas ini?')) {
            router.delete(`/admin/uploads/${id}`);
        }
    };

    const formatBytes = (bytes: number) => {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Filter uploads based on Level, Course, or Date selection
    const filteredUploads = uploads.filter((up) => {
        if (selectedLevelId && up.level_id?.toString() !== selectedLevelId) return false;
        if (selectedCourseId && up.course_id?.toString() !== selectedCourseId) return false;
        
        if (selectedDate) {
            const dateObj = new Date(up.created_at);
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const localDateStr = `${yyyy}-${mm}-${dd}`;
            if (localDateStr !== selectedDate) return false;
        }

        return true;
    });

    const activeLevelObj = levels.find(l => l.id.toString() === selectedLevelId);
    // Cast levels properly to access courses if available
    const relatedCourses = (activeLevelObj as any)?.courses || [];

    return (
        <GlassAdminLayout>
            <Head title="Monitoring Pengumpulan Tugas" />

            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white">Monitoring Berkas ACT Praktikan</h1>
                        <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Pantau dan unduh berkas laporan tugas praktikum yang telah dikumpulkan praktikan</p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-white/5 border border-white/10 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20 [color-scheme:dark]"
                                title="Filter Tanggal Upload"
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate('')}
                                    className="text-3xs font-extrabold text-rose-400 hover:text-rose-300 uppercase tracking-widest shrink-0"
                                    title="Reset filter tanggal"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <select
                            value={selectedLevelId}
                            onChange={(e) => {
                                setSelectedLevelId(e.target.value);
                                setSelectedCourseId('');
                            }}
                            className="bg-white/5 border border-white/10 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                        >
                            <option value="" className="bg-slate-900">Semua Tingkat</option>
                            {levels.map((lvl) => (
                                <option key={lvl.id} value={lvl.id} className="bg-slate-900">{lvl.name}</option>
                            ))}
                        </select>

                        {selectedLevelId && relatedCourses.length > 0 && (
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="bg-white/5 border border-white/10 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                            >
                                <option value="" className="bg-slate-900">Semua Praktikum</option>
                                {relatedCourses.map((crs: any) => (
                                    <option key={crs.id} value={crs.id} className="bg-slate-900">{crs.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Uploads List full-width panel */}
                <GlassCard className="border-white/5 shadow-md">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                        Daftar Laporan Terkumpul ({filteredUploads.length} File)
                    </h2>

                    {filteredUploads.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 font-bold text-xs">
                            Belum ada laporan praktikan dikumpulkan untuk filter ini.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                        <th className="pb-3 pr-2">Praktikan / NPM</th>
                                        <th className="pb-3 px-2">Nama Berkas</th>
                                        <th className="pb-3 px-2">Info Praktikum</th>
                                        <th className="pb-3 px-2">Deteksi Ruang</th>
                                        <th className="pb-3 px-2">Ukuran / Waktu</th>
                                        <th className="pb-3 pl-2 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                    {filteredUploads.map((up) => {
                                        const isGuest = up.user_id === null;
                                        const displayName = isGuest ? up.student_name : up.user?.name;
                                        const displayId = isGuest ? `NPM: ${up.student_npm}` : 'ASISTEN';

                                        return (
                                            <tr key={up.id} className="hover:bg-white/2 transition duration-150">
                                                <td className="py-3 pr-2">
                                                    <div className="font-bold text-slate-200 text-sm leading-snug">{displayName || '-'}</div>
                                                    <div className="text-3xs text-indigo-400 font-extrabold uppercase mt-0.5 tracking-wider">
                                                        {displayId}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 font-bold text-slate-300">
                                                    <div className="max-w-xs truncate" title={up.original_name}>
                                                        {up.original_name}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 space-y-0.5 whitespace-nowrap">
                                                    <div className="text-3xs font-extrabold text-indigo-300 uppercase tracking-wide">
                                                        {up.level?.name || '-'}
                                                    </div>
                                                    <div className="text-slate-500 text-3xs font-bold uppercase">
                                                        {up.course?.name || '-'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wider ${
                                                        up.room_name 
                                                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/10' 
                                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                                                    }`}>
                                                        {up.room_name ? `Lab ${up.room_name}` : 'Remote / Luar'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 whitespace-nowrap">
                                                    <div className="font-mono text-slate-400 text-3xs">{formatBytes(up.size)}</div>
                                                    <div className="text-slate-500 text-4xs font-bold uppercase mt-0.5">
                                                        {new Date(up.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-3 pl-2 text-right space-x-2.5 whitespace-nowrap font-bold">
                                                    <a
                                                        href={`/admin/uploads/${up.id}/download`}
                                                        className="text-indigo-400 hover:text-indigo-300 transition"
                                                    >
                                                        Unduh
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(up.id)}
                                                        className="text-rose-500 hover:text-rose-400 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* Floating Notification Bubbles Stack */}
            <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
                {notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className="pointer-events-auto p-4 rounded-xl border bg-slate-900/90 border-teal-500/30 text-slate-100 backdrop-blur-md shadow-lg shadow-teal-500/5 flex items-start gap-3 animate-fade-in relative overflow-hidden"
                    >
                        {/* Pulse Background */}
                        <div className="absolute inset-0 bg-teal-500/[0.02] animate-pulse pointer-events-none" />

                        <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 shrink-0 relative z-10">
                            <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1 relative z-10">
                            <p className="text-3xs font-extrabold uppercase tracking-widest text-teal-400">Berkas Baru Masuk</p>
                            <p className="text-xs font-bold text-slate-200 mt-0.5 truncate">{notif.student}</p>
                            <p className="text-4xs text-slate-400 truncate mt-0.5">{notif.filename}</p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
