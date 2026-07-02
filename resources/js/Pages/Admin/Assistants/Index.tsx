import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Assistant {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AssistantsProps {
    assistants: Assistant[];
}

export const Index: React.FC<AssistantsProps> = ({ assistants }) => {
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'asisten',
        password: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/assistants', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAssistant) {
            patch(`/admin/assistants/${editingAssistant.id}`, {
                onSuccess: () => {
                    setEditingAssistant(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus akun asisten ini? Tindakan ini tidak dapat dibatalkan.')) {
            destroy(`/admin/assistants/${id}`);
        }
    };

    const startEdit = (ast: Assistant) => {
        setEditingAssistant(ast);
        setData({
            name: ast.name,
            email: ast.email,
            role: ast.role,
            password: '', // Leave password blank on edit unless updating
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Manajemen Akun Asisten" />

            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-xl font-black text-white">Akun Asisten & Staff</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Kelola akun pengajar asisten dan staff laboratorium komputer Lepkom J5
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingAssistant ? 'Perbarui Akun' : 'Tambah Akun Baru'}
                            </h2>

                            <form onSubmit={editingAssistant ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Nama Lengkap"
                                    placeholder="Contoh: Muhammad Khotami"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                />

                                <GlassInput
                                    label="ID Asisten (Username)"
                                    placeholder="Contoh: AST001"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                />

                                <GlassInput
                                    label="Peran / Hak Akses"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    options={[
                                        { value: 'asisten', label: 'Asisten Laboratorium' },
                                        { value: 'staff', label: 'Staff Laboratorium' },
                                    ]}
                                    error={errors.role}
                                />

                                <GlassInput
                                    label={editingAssistant ? 'Kata Sandi Baru (Kosongkan jika tetap)' : 'Kata Sandi'}
                                    type="password"
                                    placeholder={editingAssistant ? '•••••••• (Tetap)' : 'Minimal 8 karakter'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                />

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingAssistant ? 'Simpan Perubahan' : 'Buat Akun'}
                                    </GlassButton>
                                    
                                    {editingAssistant && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingAssistant(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Daftar Akun Terdaftar</h2>

                            {assistants.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada akun asisten/staff terdaftar.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2">Nama</th>
                                                <th className="pb-3 px-2">ID Asisten</th>
                                                <th className="pb-3 px-2">Peran</th>
                                                <th className="pb-3 pl-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {assistants.map((ast) => (
                                                <tr key={ast.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-3 pr-2 font-bold text-slate-200 text-sm">{ast.name}</td>
                                                    <td className="py-3 px-2 text-slate-400 font-mono text-3xs">{ast.email}</td>
                                                    <td className="py-3 px-2 whitespace-nowrap">
                                                        <span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide ${
                                                            ast.role === 'staff'
                                                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/10'
                                                                : 'bg-teal-500/10 text-teal-300 border border-teal-500/10'
                                                        }`}>
                                                            {ast.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 pl-2 text-right space-x-3 whitespace-nowrap font-bold">
                                                        <button
                                                            onClick={() => startEdit(ast)}
                                                            className="text-slate-400 hover:text-indigo-400 transition"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(ast.id)}
                                                            className="text-rose-500 hover:text-rose-400 transition"
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
