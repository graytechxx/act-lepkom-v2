import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface CalEvent {
    id: number;
    title: string;
    description: string | null;
    start: string;
    end: string | null;
    color: string | null;
    is_public: boolean;
    creator?: string;
}

export const Index: React.FC = () => {
    const [events, setEvents] = useState<CalEvent[]>([]);
    const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        description: '',
        start: '',
        end: '',
        color: '#4f46e5',
        is_public: true,
    });

    const fetchEvents = () => {
        fetch('/api/calendar/events')
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(() => {});
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDateTimeLocal = (dateStr: string | null) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        // Format to YYYY-MM-DDTHH:MM
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/calendar', {
            onSuccess: () => {
                reset();
                fetchEvents();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            patch(`/admin/calendar/${editingEvent.id}`, {
                onSuccess: () => {
                    setEditingEvent(null);
                    reset();
                    fetchEvents();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal kegiatan ini?')) {
            destroy(`/admin/calendar/${id}`, {
                onSuccess: () => {
                    fetchEvents();
                }
            });
        }
    };

    const startEdit = (ev: CalEvent) => {
        setEditingEvent(ev);
        setData({
            title: ev.title,
            description: ev.description || '',
            start: formatDateTimeLocal(ev.start),
            end: ev.end ? formatDateTimeLocal(ev.end) : '',
            color: ev.color || '#4f46e5',
            is_public: !!ev.is_public,
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Kalender Kegiatan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Kalender Kegiatan & Praktikum</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Jadwalkan praktikum, ujian, rapat, atau kegiatan laboratorium lainnya</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingEvent ? 'Perbarui Kegiatan' : 'Tambah Kegiatan Baru'}
                            </h2>

                            <form onSubmit={editingEvent ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Nama Kegiatan"
                                    placeholder="Contoh: Ujian Mandiri Web"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Deskripsi / Lokasi"
                                    isTextArea
                                    placeholder="Detail tambahan..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                />

                                <GlassInput
                                    label="Waktu Mulai"
                                    type="datetime-local"
                                    value={data.start}
                                    onChange={(e) => setData('start', e.target.value)}
                                    error={errors.start}
                                />

                                <GlassInput
                                    label="Waktu Selesai"
                                    type="datetime-local"
                                    value={data.end}
                                    onChange={(e) => setData('end', e.target.value)}
                                    error={errors.end}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <GlassInput
                                        label="Label Warna"
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        error={errors.color}
                                    />

                                    <div className="flex flex-col justify-end pb-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="is_public"
                                                checked={data.is_public}
                                                onChange={(e) => setData('is_public', e.target.checked)}
                                                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
                                            />
                                            <label htmlFor="is_public" className="text-3xs font-extrabold text-slate-300 uppercase tracking-widest select-none cursor-pointer">
                                                Publik
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingEvent ? 'Simpan' : 'Jadwalkan'}
                                    </GlassButton>
                                    
                                    {editingEvent && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingEvent(null);
                                                reset();
                                            }}
                                            className="text-2xs font-bold py-2.5"
                                        >
                                            Batal
                                        </GlassButton>
                                    )}
                                </div>
                            </form>
                        </GlassCard>
                    </div>

                    {/* Right Table/Card List */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Jadwal Terdaftar</h2>

                            {events.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada agenda terdaftar.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {events.map((ev) => (
                                        <div key={ev.id} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: ev.color || '#4f46e5' }}></span>
                                                        <h3 className="font-extrabold text-slate-200 text-sm leading-snug">{ev.title}</h3>
                                                    </div>
                                                    <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                        Oleh: {ev.creator || 'Admin'} • {new Date(ev.start).toLocaleString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                        {ev.end && ` - ` + new Date(ev.end).toLocaleString('id-ID', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide ${
                                                        ev.is_public 
                                                            ? 'bg-teal-500/10 text-teal-300' 
                                                            : 'bg-amber-500/10 text-amber-300'
                                                    }`}>
                                                        {ev.is_public ? 'Publik' : 'Internal'}
                                                    </span>
                                                </div>
                                            </div>

                                            {ev.description && (
                                                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pl-5">
                                                    {ev.description}
                                                </p>
                                            )}

                                            <div className="flex justify-end gap-3 text-2xs font-bold pt-1 border-t border-white/5">
                                                <button
                                                    onClick={() => startEdit(ev)}
                                                    className="text-slate-400 hover:text-indigo-400 transition"
                                                >
                                                    Ubah
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    className="text-rose-500 hover:text-rose-400 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
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

export default Index;
