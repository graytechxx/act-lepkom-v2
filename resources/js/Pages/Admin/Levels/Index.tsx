import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Level {
    id: number;
    name: string;
    order: number;
}

interface LevelsProps {
    levels: Level[];
}

export const Index: React.FC<LevelsProps> = ({ levels }) => {
    const [editingLevel, setEditingLevel] = useState<Level | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        order: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/levels', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLevel) {
            patch(`/admin/levels/${editingLevel.id}`, {
                onSuccess: () => {
                    setEditingLevel(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus tingkat studi ini? Semua data praktikum di bawahnya mungkin terpengaruh.')) {
            destroy(`/admin/levels/${id}`);
        }
    };

    const startEdit = (lvl: Level) => {
        setEditingLevel(lvl);
        setData({
            name: lvl.name,
            order: lvl.order.toString(),
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Manajemen Tingkat" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Tingkat Studi Praktikum</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Kelola master data tingkat praktikum</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingLevel ? 'Perbarui Tingkat' : 'Tambah Tingkat Baru'}
                            </h2>

                            <form onSubmit={editingLevel ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Nama Tingkat"
                                    placeholder="Contoh: Tingkat 1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                />

                                <GlassInput
                                    label="Urutan Tampilan"
                                    type="number"
                                    placeholder="Contoh: 1"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    error={errors.order}
                                />

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingLevel ? 'Simpan Perubahan' : 'Tambah Tingkat'}
                                    </GlassButton>
                                    
                                    {editingLevel && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingLevel(null);
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

                    {/* Right Table List */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Daftar Tingkat</h2>

                            {levels.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data tingkat praktikum.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2 w-16">Urutan</th>
                                                <th className="pb-3 px-2">Nama Tingkat</th>
                                                <th className="pb-3 pl-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {levels.map((lvl) => (
                                                <tr key={lvl.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-3 pr-2 font-bold text-indigo-400">{lvl.order}</td>
                                                    <td className="py-3 px-2 text-slate-200 font-bold text-sm">{lvl.name}</td>
                                                    <td className="py-3 pl-2 text-right space-x-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => startEdit(lvl)}
                                                            className="text-slate-400 hover:text-indigo-400 font-semibold transition"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(lvl.id)}
                                                            className="text-rose-500 hover:text-rose-400 font-semibold transition"
                                                        >
                                                            Hapus
                                                        </button>
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
