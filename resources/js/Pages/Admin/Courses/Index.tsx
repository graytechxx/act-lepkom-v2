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

interface Course {
    id: number;
    level_id: number;
    name: string;
    description: string | null;
    level?: Level;
}

interface CoursesProps {
    courses: Course[];
    levels: Level[];
}

export const Index: React.FC<CoursesProps> = ({ courses, levels }) => {
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        level_id: '',
        name: '',
        description: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/courses', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            patch(`/admin/courses/${editingCourse.id}`, {
                onSuccess: () => {
                    setEditingCourse(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus mata praktikum ini? Semua modul dan berkas terkait di bawahnya mungkin terhapus.')) {
            destroy(`/admin/courses/${id}`);
        }
    };

    const startEdit = (crs: Course) => {
        setEditingCourse(crs);
        setData({
            level_id: crs.level_id.toString(),
            name: crs.name,
            description: crs.description || '',
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Manajemen Praktikum" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Mata Praktikum (Kursus)</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Kelola mata praktikum yang aktif di masing-masing tingkat</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingCourse ? 'Perbarui Praktikum' : 'Tambah Praktikum Baru'}
                            </h2>

                            <form onSubmit={editingCourse ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Tingkat Studi"
                                    placeholder="-- Pilih Tingkat Studi --"
                                    value={data.level_id}
                                    onChange={(e) => setData('level_id', e.target.value)}
                                    options={levels.map(l => ({ value: l.id.toString(), label: l.name }))}
                                    error={errors.level_id}
                                />

                                <GlassInput
                                    label="Nama Mata Praktikum"
                                    placeholder="Contoh: Cisco CCNA, Web Laravel"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                />

                                <GlassInput
                                    label="Keterangan / Silabus"
                                    isTextArea
                                    placeholder="Deskripsi ringkas praktikum..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    error={errors.description}
                                />

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingCourse ? 'Simpan' : 'Tambah Praktikum'}
                                    </GlassButton>
                                    
                                    {editingCourse && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingCourse(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Daftar Praktikum</h2>

                            {courses.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data mata praktikum.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2 w-32">Tingkat</th>
                                                <th className="pb-3 px-2">Nama Praktikum</th>
                                                <th className="pb-3 px-2">Keterangan</th>
                                                <th className="pb-3 pl-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {courses.map((crs) => (
                                                <tr key={crs.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-3 pr-2">
                                                        <span className="px-2 py-0.5 rounded text-3xs font-extrabold bg-indigo-500/10 text-indigo-300 uppercase tracking-wide">
                                                            {crs.level?.name || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-slate-200 font-bold text-sm">{crs.name}</td>
                                                    <td className="py-3 px-2 text-slate-400 max-w-xs truncate">{crs.description || '-'}</td>
                                                    <td className="py-3 pl-2 text-right space-x-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => startEdit(crs)}
                                                            className="text-slate-400 hover:text-indigo-400 font-semibold transition"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(crs.id)}
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
