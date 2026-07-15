import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

interface User {
    id: number;
    name: string;
    role: string;
}

interface AttendanceLog {
    id: number;
    user_id: number;
    date: string;
    type: 'STANDBY J5' | 'TAWK.TO (ONLINE)' | 'MAINTENANCE';
    check_in: string;
    check_out: string | null;
    description: string | null;
    sync_status: 'pending' | 'synced' | 'failed';
    sync_error: string | null;
    user?: User;
}

interface IndexProps {
    activeSession: AttendanceLog | null;
    history: AttendanceLog[];
    scriptUrl: string;
}

export const Index: React.FC<IndexProps> = ({ activeSession, history, scriptUrl }) => {
    const [type, setType] = useState<'STANDBY J5' | 'TAWK.TO (ONLINE)' | 'MAINTENANCE'>('STANDBY J5');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('00:00:00');

    // Timer calculation for active session
    useEffect(() => {
        if (!activeSession) return;

        const calculateDuration = () => {
            const checkInTime = activeSession.check_in; // e.g. "06:30"
            const [hours, minutes] = checkInTime.split(':').map(Number);
            
            const checkInDate = new Date(activeSession.date);
            checkInDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            let diffMs = now.getTime() - checkInDate.getTime();

            if (diffMs < 0) diffMs = 0; // Handle time diff bugs

            const diffSecs = Math.floor(diffMs / 1000);
            const h = Math.floor(diffSecs / 3600);
            const m = Math.floor((diffSecs % 3600) / 60);
            const s = diffSecs % 60;

            const pad = (n: number) => String(n).padStart(2, '0');
            setDuration(`${pad(h)}:${pad(m)}:${pad(s)}`);
        };

        calculateDuration();
        const timer = setInterval(calculateDuration, 1000);
        return () => clearInterval(timer);
    }, [activeSession]);

    const handleCheckIn = () => {
        router.post('/admin/attendance/check-in', { type }, {
            onSuccess: () => {
                setDescription('');
            }
        });
    };

    const handleCheckOut = () => {
        if (activeSession?.type === 'MAINTENANCE' && !description.trim()) {
            alert('Wajib mengisi keterangan pekerjaan perbaikan/maintenance sebelum check-out.');
            return;
        }

        router.post('/admin/attendance/check-out', { description }, {
            onSuccess: () => {
                setDescription('');
            }
        });
    };

    const getStatusBadge = (status: AttendanceLog['sync_status'], errorMsg: string | null) => {
        switch (status) {
            case 'synced':
                return (
                    <span className="inline-flex items-center gap-1 text-5xs font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Synced Sheets
                    </span>
                );
            case 'failed':
                return (
                    <span 
                        title={errorMsg || 'Failed to sync'} 
                        className="inline-flex items-center gap-1 text-5xs font-black tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded cursor-help"
                    >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Failed Sync
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-5xs font-black tracking-wider uppercase bg-slate-500/10 text-slate-400 border border-white/5 px-1.5 py-0.5 rounded animate-pulse">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Standby / Pending
                    </span>
                );
        }
    };

    return (
        <GlassAdminLayout>
            <Head title="Absensi Jaga & Standby" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2">
                        <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Absensi Jaga Asisten
                    </h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Log masuk dan keluar asisten standby J5 yang otomatis sinkron ke Google Spreadsheet
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Action Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {!activeSession ? (
                            // Start session Card
                            <GlassCard className="border-white/5 shadow-md space-y-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Mulai Jaga Asisten</h2>
                                
                                <div className="space-y-3">
                                    <label className="block text-3xs font-extrabold uppercase tracking-widest text-slate-400">Pilih Tipe Jaga</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'STANDBY J5', label: 'Standby di Lab J5' },
                                            { id: 'TAWK.TO (ONLINE)', label: 'Duty Tawk.to (Online)' },
                                            { id: 'MAINTENANCE', label: 'Tugas Perbaikan / Maintenance Lab' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setType(opt.id as any)}
                                                className={`p-3 text-left rounded-xl border text-xs font-bold transition duration-200 ${
                                                    type === opt.id
                                                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                                                        : 'bg-white/1 border-white/5 text-slate-400 hover:bg-white/2 hover:text-slate-300'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <GlassButton
                                    onClick={handleCheckIn}
                                    variant="primary"
                                    className="w-full text-xs font-black uppercase tracking-wider py-3 mt-2"
                                >
                                    Check In Sekarang
                                </GlassButton>
                            </GlassCard>
                        ) : (
                            // Stop session Card
                            <GlassCard className="border-indigo-500/20 bg-indigo-500/5 shadow-lg space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-5xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                                            Status: Jaga Aktif
                                        </span>
                                        <h2 className="text-sm font-black text-white mt-1.5">{activeSession.type}</h2>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-5xs font-bold text-slate-400">Jam Masuk</span>
                                        <p className="text-xs font-bold text-slate-200">{activeSession.check_in}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-center space-y-1">
                                    <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Durasi Jaga Berjalan</span>
                                    <p className="text-2xl font-black text-indigo-300 font-mono tracking-widest">{duration}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-3xs font-extrabold uppercase tracking-widest text-slate-400">
                                        Aktivitas / Laporan Jaga {activeSession.type === 'MAINTENANCE' && '*'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={
                                            activeSession.type === 'MAINTENANCE'
                                                ? "Wajib tulis pekerjaan perbaikan/maintenance yang Anda lakukan..."
                                                : "Opsional: Catat kegiatan tambahan jika ada..."
                                        }
                                        className="w-full bg-slate-950/20 border border-white/10 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 resize-none transition-all"
                                    />
                                </div>

                                <GlassButton
                                    onClick={handleCheckOut}
                                    variant="danger"
                                    className="w-full text-xs font-black uppercase tracking-wider py-3 mt-2 bg-red-600/30 text-red-200 border-red-500/20 hover:bg-red-600/40"
                                >
                                    Selesai Jaga (Check Out)
                                </GlassButton>
                            </GlassCard>
                        )}

                        {/* Integration status Card */}
                        <GlassCard className="border-white/5 shadow-md p-4 space-y-3">
                            <h3 className="text-4xs font-bold uppercase tracking-widest text-slate-400">Integrasi Google Sheets</h3>
                            <div className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${scriptUrl ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-amber-500'}`}></span>
                                <span className="text-xs font-bold text-slate-300">
                                    {scriptUrl ? 'Aktif & Tersinkronisasi' : 'Belum Dikonfigurasi'}
                                </span>
                            </div>
                            <p className="text-4xs text-slate-500 leading-normal font-medium">
                                {scriptUrl 
                                    ? 'Setiap check-out asisten otomatis didaftarkan dan dihitung nomor urutnya ke Google Sheet.' 
                                    : 'Agar otomatis sinkron ke Google Sheet, atur konfigurasi GOOGLE_APPS_SCRIPT_URL di dalam berkas .env server.'}
                            </p>
                        </GlassCard>
                    </div>

                    {/* Logs History Card */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md h-full flex flex-col p-5">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
                                Riwayat Log Jaga Asisten
                            </h2>

                            {history.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 font-bold text-xs">
                                    Belum ada catatan log absensi jaga Anda.
                                </div>
                            ) : (
                                <div className="flex-1 overflow-x-auto rounded-xl border border-white/5 max-h-[550px] scrollbar-light">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="py-3 px-4">Nama</th>
                                                <th className="py-3 px-4">Tanggal</th>
                                                <th className="py-3 px-4">Tipe Jaga</th>
                                                <th className="py-3 px-4 text-center">Waktu</th>
                                                <th className="py-3 px-4">Kegiatan / Perbaikan</th>
                                                <th className="py-3 px-4 text-center">Sync</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {history.map((log) => (
                                                <tr key={log.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-2.5 px-4 font-bold text-slate-300 whitespace-nowrap">
                                                        {log.user?.name || 'Anda'}
                                                    </td>
                                                    <td className="py-2.5 px-4 font-semibold text-slate-400 whitespace-nowrap">
                                                        {new Date(log.date).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="py-2.5 px-4 font-bold text-indigo-300 whitespace-nowrap">
                                                        {log.type === 'TAWK.TO (ONLINE)' ? 'tawkTo' : log.type === 'STANDBY J5' ? 'Teknis Standby J5' : 'Maintenance'}
                                                    </td>
                                                    <td className="py-2.5 px-4 font-semibold text-slate-300 text-center whitespace-nowrap">
                                                        {log.check_in} - {log.check_out || 'Active'}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-slate-400 max-w-[200px] truncate" title={log.description || ''}>
                                                        {log.description || '-'}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                                                        {getStatusBadge(log.sync_status, log.sync_error)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
