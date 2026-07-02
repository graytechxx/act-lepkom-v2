import React from 'react';
import { Head } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';

interface User {
    id: number;
    name: string;
    role: string;
}

interface ActivityLog {
    id: number;
    user_id: number | null;
    action: string;
    entity_type: string | null;
    entity_id: number | null;
    description: string | null;
    ip_address: string | null;
    created_at: string;
    user?: User;
}

interface LogsProps {
    logs: ActivityLog[];
}

export const Index: React.FC<LogsProps> = ({ logs }) => {
    return (
        <GlassAdminLayout>
            <Head title="Log Aktivitas" />

            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-xl font-black text-white">Log Aktivitas Sistem</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider font-semibold">Audit trail sistem merekam riwayat modifikasi data oleh asisten dan admin</p>
                </div>

                <GlassCard className="border-white/5 shadow-md">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Riwayat Aktivitas (Terbaru)</h2>

                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 font-bold text-xs">
                            Belum ada riwayat aktivitas tercatat.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                        <th className="pb-3 pr-2 w-40">Waktu</th>
                                        <th className="pb-3 px-2">Pengguna</th>
                                        <th className="pb-3 px-2">Aksi</th>
                                        <th className="pb-3 px-2">Deskripsi Keterangan</th>
                                        <th className="pb-3 pl-2 w-32">Alamat IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                    {logs.map((log) => {
                                        let actionColor = 'bg-slate-500/10 text-slate-400';
                                        const actionUpper = log.action.toUpperCase();

                                        if (actionUpper.includes('CREATE') || actionUpper.includes('STORE') || actionUpper.includes('TAMBAH')) {
                                            actionColor = 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/10';
                                        } else if (actionUpper.includes('UPDATE') || actionUpper.includes('EDIT') || actionUpper.includes('PERBARUI')) {
                                            actionColor = 'bg-amber-500/10 text-amber-300 border border-amber-500/10';
                                        } else if (actionUpper.includes('DELETE') || actionUpper.includes('DESTROY') || actionUpper.includes('HAPUS')) {
                                            actionColor = 'bg-rose-500/10 text-rose-300 border border-rose-500/10';
                                        } else if (actionUpper.includes('LOGIN') || actionUpper.includes('AUTH')) {
                                            actionColor = 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/10';
                                        }

                                        return (
                                            <tr key={log.id} className="hover:bg-white/2 transition duration-150">
                                                <td className="py-3 pr-2 font-mono text-3xs text-slate-400 whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                    })}
                                                </td>
                                                <td className="py-3 px-2 whitespace-nowrap">
                                                    <div className="font-bold text-slate-200">{log.user?.name || 'Sistem'}</div>
                                                    <div className="text-slate-500 text-4xs font-extrabold uppercase tracking-wider">{log.user?.role || 'Guest'}</div>
                                                </td>
                                                <td className="py-3 px-2 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wider ${actionColor}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-slate-300 max-w-sm truncate" title={log.description || ''}>
                                                    {log.description || '-'}
                                                </td>
                                                <td className="py-3 pl-2 font-mono text-3xs text-slate-400 whitespace-nowrap">{log.ip_address || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </GlassCard>
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
