import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Creator {
    id: number;
    name: string;
}

interface Announcement {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    created_at: string;
    creator?: Creator;
}

interface AnnouncementsProps {
    announcements: Announcement[];
}

export const Index: React.FC<AnnouncementsProps> = ({ announcements }) => {
    const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
        is_published: true,
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAnn) {
            patch(`/admin/announcements/${editingAnn.id}`, {
                onSuccess: () => {
                    setEditingAnn(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            destroy(`/admin/announcements/${id}`);
        }
    };

    const startEdit = (ann: Announcement) => {
        setEditingAnn(ann);
        setData({
            title: ann.title,
            content: ann.content,
            is_published: !!ann.is_published,
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Pengumuman" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Pengumuman & Informasi</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Sebarkan pengumuman terbaru kepada praktikan dan asisten</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingAnn ? 'Perbarui Pengumuman' : 'Buat Pengumuman Baru'}
                            </h2>

                            <form onSubmit={editingAnn ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Judul Pengumuman"
                                    placeholder="Contoh: Jadwal Ujian ACT"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Isi Pengumuman"
                                    isTextArea
                                    placeholder="Tuliskan isi detail pengumuman..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={errors.content}
                                />

                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
                                    />
                                    <label htmlFor="is_published" className="text-2xs font-bold text-slate-300 uppercase tracking-wider select-none cursor-pointer">
                                        Terbitkan Langsung
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingAnn ? 'Simpan Perubahan' : 'Sebarkan Pengumuman'}
                                    </GlassButton>
                                    
                                    {editingAnn && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingAnn(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Riwayat Pengumuman</h2>

                            {announcements.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data pengumuman yang diterbitkan.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map((ann) => (
                                        <div key={ann.id} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-extrabold text-slate-200 text-sm leading-snug">{ann.title}</h3>
                                                    <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                        Oleh: {ann.creator?.name || 'Admin'} • {new Date(ann.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide ${
                                                        ann.is_published 
                                                            ? 'bg-emerald-500/10 text-emerald-300' 
                                                            : 'bg-slate-500/10 text-slate-400'
                                                    }`}>
                                                        {ann.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                                                {ann.content}
                                            </p>

                                            <div className="flex justify-end gap-3 text-2xs font-bold pt-1 border-t border-white/5">
                                                <button
                                                    onClick={() => startEdit(ann)}
                                                    className="text-slate-400 hover:text-indigo-400 transition"
                                                >
                                                    Ubah
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ann.id)}
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
