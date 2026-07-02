import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Note {
    id: number;
    title: string;
    content: string | null;
    created_at: string;
}

interface NotesProps {
    notes: Note[];
}

export const Index: React.FC<NotesProps> = ({ notes }) => {
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/notes', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingNote) {
            patch(`/admin/notes/${editingNote.id}`, {
                onSuccess: () => {
                    setEditingNote(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus catatan pribadi ini?')) {
            destroy(`/admin/notes/${id}`);
        }
    };

    const startEdit = (note: Note) => {
        setEditingNote(note);
        setData({
            title: note.title,
            content: note.content || '',
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Catatan Pribadi" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Catatan Pribadi Asisten</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Simpan catatan agenda pengajaran, catatan praktikan bermasalah, atau to-do list pribadi Anda</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingNote ? 'Perbarui Catatan' : 'Buat Catatan Baru'}
                            </h2>

                            <form onSubmit={editingNote ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Judul Catatan"
                                    placeholder="Contoh: Pembahasan Minggu Ini"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Isi Catatan"
                                    isTextArea
                                    placeholder="Tuliskan isi catatan Anda..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={errors.content}
                                />

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingNote ? 'Simpan' : 'Simpan Catatan'}
                                    </GlassButton>
                                    
                                    {editingNote && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingNote(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Daftar Catatan Anda</h2>

                            {notes.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada catatan yang tersimpan.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {notes.map((note) => (
                                        <div key={note.id} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition flex flex-col justify-between min-h-[160px]">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-extrabold text-slate-200 text-sm leading-snug truncate pr-2" title={note.title}>
                                                        {note.title}
                                                    </h3>
                                                    <span className="text-4xs text-slate-500 font-bold uppercase shrink-0">
                                                        {new Date(note.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">
                                                    {note.content || '-'}
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3 text-2xs font-bold pt-3 mt-3 border-t border-white/5">
                                                <button
                                                    onClick={() => startEdit(note)}
                                                    className="text-slate-400 hover:text-indigo-400 transition"
                                                >
                                                    Ubah
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note.id)}
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
