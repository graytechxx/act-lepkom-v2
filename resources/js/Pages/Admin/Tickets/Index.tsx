import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface User {
    id: number;
    name: string;
    role: string;
    tag?: string | null;
}

interface Ticket {
    id: number;
    user_id: number;
    title: string;
    description: string;
    target: 'TEKNIS' | 'ADMIN';
    status: 'open' | 'progress' | 'resolved';
    created_at: string;
    user?: User;
}

interface TicketsProps {
    tickets: Ticket[];
}

interface ToastNotification {
    id: string;
    message: string;
}

export const Index: React.FC<TicketsProps> = ({ tickets }) => {
    const { auth } = usePage<any>().props;
    const [notifications, setNotifications] = useState<ToastNotification[]>([]);

    const prevTicketsRef = useRef<Ticket[]>(tickets);
    const isUpdatingRef = useRef(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        target: 'TEKNIS' as 'TEKNIS' | 'ADMIN',
    });

    // 1. Auto Refresh: Poll and reload tickets every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['tickets'] });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 2. Track changes and trigger notifications
    useEffect(() => {
        const prevTickets = prevTicketsRef.current;
        const newNotifications: ToastNotification[] = [];

        if (!isUpdatingRef.current) {
            tickets.forEach((ticket) => {
                const prev = prevTickets.find((t) => t.id === ticket.id);
                if (prev) {
                    if (prev.status !== ticket.status) {
                        const statusLabels = { open: 'Terbuka', progress: 'Diproses', resolved: 'Selesai' };
                        newNotifications.push({
                            id: `${ticket.id}-${Date.now()}-status`,
                            message: `Tiket #${ticket.id} "${ticket.title}" status diperbarui menjadi: ${statusLabels[ticket.status]}`,
                        });
                    }
                } else {
                    // New ticket from another user
                    if (ticket.user_id !== auth.user.id) {
                        newNotifications.push({
                            id: `${ticket.id}-${Date.now()}-new`,
                            message: `Tiket baru #${ticket.id} dari ${ticket.user?.name || 'Asisten'}: "${ticket.title}"`,
                        });
                    }
                }
            });
        }

        if (newNotifications.length > 0) {
            setNotifications((prev) => {
                // Filter out duplicate messages to prevent double toasts
                const filteredNew = newNotifications.filter(
                    (n) => !prev.some((p) => p.message === n.message)
                );

                // Set timeout to dismiss only the newly added unique notifications
                filteredNew.forEach((n) => {
                    setTimeout(() => {
                        setNotifications((current) => current.filter((x) => x.id !== n.id));
                    }, 5000);
                });

                return [...prev, ...filteredNew];
            });
        }

        prevTicketsRef.current = tickets;
    }, [tickets, auth.user.id]);

    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((x) => x.id !== id));
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tickets/store', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateStatus = (ticketId: number, status: 'open' | 'progress' | 'resolved') => {
        isUpdatingRef.current = true;
        router.post(`/admin/tickets/${ticketId}/status`, { status }, {
            onFinish: () => {
                setTimeout(() => {
                    isUpdatingRef.current = false;
                }, 100);
            }
        });
    };

    const canUpdateStatus = (ticket: Ticket) => {
        return auth.user.role === 'superadmin' ||
            (auth.user.tag === 'TEKNIS' && ticket.target === 'TEKNIS') ||
            (auth.user.tag === 'ADMIN' && ticket.target === 'ADMIN');
    };

    const getStatusBadge = (status: Ticket['status']) => {
        switch (status) {
            case 'open':
                return (
                    <span className="text-4xs font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded-lg">
                        Terbuka
                    </span>
                );
            case 'progress':
                return (
                    <span className="text-4xs font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/10 px-2 py-0.5 rounded-lg">
                        Diproses
                    </span>
                );
            case 'resolved':
                return (
                    <span className="text-4xs font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-lg">
                        Selesai
                    </span>
                );
        }
    };

    const getTargetBadge = (target: Ticket['target']) => {
        if (target === 'TEKNIS') {
            return (
                <span className="text-5xs font-black tracking-wider uppercase bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded">
                    TEKNIS
                </span>
            );
        }
        return (
            <span className="text-5xs font-black tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded">
                ADMIN
            </span>
        );
    };

    return (
        <GlassAdminLayout>
            <Head title="Tiket Keluhan & Kendala" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Tiket Kendala & Keluhan</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Laporkan kendala teknis atau kebutuhan administrasi laboratorium Lepkom
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Create Ticket */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                Laporkan Masalah Baru
                            </h2>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Judul Kendala"
                                    placeholder="Contoh: AC Lab J5 Mati / Error"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Tujuan Laporan"
                                    value={data.target}
                                    onChange={(e) => setData('target', e.target.value as 'TEKNIS' | 'ADMIN')}
                                    options={[
                                        { value: 'TEKNIS', label: 'TEKNIS (Kendala Hardware, Software, Jaringan)' },
                                        { value: 'ADMIN', label: 'ADMIN (Administrasi, ATK, Kelengkapan Kelas)' },
                                    ]}
                                    error={errors.target}
                                />

                                <GlassInput
                                    label="Rincian / Deskripsi"
                                    isTextArea
                                    placeholder="Jelaskan masalah secara rinci, lokasi lab, dan kronologinya..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                />

                                <div className="pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-2xs font-bold py-2.5"
                                        disabled={processing}
                                    >
                                        Kirim Tiket
                                    </GlassButton>
                                </div>
                            </form>
                        </GlassCard>
                    </div>

                    {/* Right Column: Tickets List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                            Daftar Laporan Kendala
                        </h2>

                        {tickets.length === 0 ? (
                            <div className="bg-white/1 border border-white/5 rounded-2xl p-8 text-center text-slate-500 font-bold text-xs shadow-md">
                                Belum ada laporan kendala yang terdaftar.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 scrollbar-light">
                                {tickets.map((ticket) => {
                                    const allowedToUpdate = canUpdateStatus(ticket);

                                    return (
                                        <GlassCard key={ticket.id} className="border-white/5 shadow-md relative p-5 space-y-3 hover:bg-white/3 transition-all duration-350">
                                            {/* Top info row */}
                                            <div className="flex flex-wrap justify-between items-center gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {getStatusBadge(ticket.status)}
                                                    {getTargetBadge(ticket.target)}
                                                </div>
                                                <div className="text-5xs font-bold text-slate-500 uppercase tracking-widest">
                                                    {new Date(ticket.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-white leading-snug">{ticket.title}</h3>
                                                <p className="text-xs font-medium text-slate-400 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                                            </div>

                                            {/* Footer row */}
                                            <div className="flex justify-between items-center pt-2 border-t border-white/5 flex-wrap gap-3">
                                                <div className="text-4xs text-slate-500 font-extrabold uppercase tracking-wide">
                                                    Pelapor: <span className="text-slate-300">{ticket.user?.name || 'Anonim'}</span>
                                                </div>

                                                {/* Action buttons if authorized */}
                                                {allowedToUpdate && (
                                                    <div className="flex gap-1.5 items-center shrink-0">
                                                        {ticket.status !== 'open' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(ticket.id, 'open')}
                                                                className="text-5xs font-extrabold uppercase bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Buka Kembali
                                                            </button>
                                                        )}
                                                        {ticket.status === 'open' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(ticket.id, 'progress')}
                                                                className="text-5xs font-extrabold uppercase bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Proses
                                                            </button>
                                                        )}
                                                        {ticket.status !== 'resolved' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                                                                className="text-5xs font-extrabold uppercase bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded transition-colors"
                                                            >
                                                                Selesaikan
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notifications Overlay */}
            <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full">
                {notifications.map(n => (
                    <div key={n.id} className="pointer-events-auto bg-slate-900/95 border border-indigo-500/30 text-slate-100 rounded-xl p-4 shadow-xl flex items-start gap-3 backdrop-blur-md animate-slide-in">
                        <svg className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className="grow">
                            <p className="text-4xs font-black uppercase text-indigo-400 tracking-widest">Notifikasi Sistem</p>
                            <p className="text-xs font-semibold mt-1.5 leading-relaxed">{n.message}</p>
                        </div>
                        <button onClick={() => dismissNotification(n.id)} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
