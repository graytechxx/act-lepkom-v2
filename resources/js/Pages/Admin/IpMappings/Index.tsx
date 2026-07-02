import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Mapping {
    id: number;
    ip_address: string;
    room_name: string;
}

interface MappingsProps {
    mappings: Mapping[];
}

export const Index: React.FC<MappingsProps> = ({ mappings }) => {
    const [editingMap, setEditingMap] = useState<Mapping | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        ip_address: '',
        room_name: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/ip-mappings', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMap) {
            patch(`/admin/ip-mappings/${editingMap.id}`, {
                onSuccess: () => {
                    setEditingMap(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pemetaan IP ini?')) {
            destroy(`/admin/ip-mappings/${id}`);
        }
    };

    const startEdit = (map: Mapping) => {
        setEditingMap(map);
        setData({
            ip_address: map.ip_address,
            room_name: map.room_name,
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Pemetaan IP" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Pemetaan IP Alamat Ruang Lab</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Petakan alamat IP static ke nama ruangan laboratorium komputer agar absensi terdeteksi</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingMap ? 'Perbarui Pemetaan' : 'Tambah Pemetaan Baru'}
                            </h2>

                            <form onSubmit={editingMap ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Alamat IP"
                                    placeholder="Contoh: 172.16.0.115"
                                    value={data.ip_address}
                                    onChange={(e) => setData('ip_address', e.target.value)}
                                    error={errors.ip_address}
                                />

                                <GlassInput
                                    label="Nama Ruang Lab"
                                    placeholder="Contoh: Ruang J5, Lab 1"
                                    value={data.room_name}
                                    onChange={(e) => setData('room_name', e.target.value)}
                                    error={errors.room_name}
                                />

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingMap ? 'Simpan' : 'Tambah Pemetaan'}
                                    </GlassButton>
                                    
                                    {editingMap && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingMap(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Pemetaan IP Terdaftar</h2>

                            {mappings.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada pemetaan IP terdaftar.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2">Alamat IP</th>
                                                <th className="pb-3 px-2">Nama Ruangan</th>
                                                <th className="pb-3 pl-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {mappings.map((map) => (
                                                <tr key={map.id} className="hover:bg-white/2 transition duration-150">
                                                    <td className="py-3 pr-2 font-bold text-slate-200 text-sm font-mono">{map.ip_address}</td>
                                                    <td className="py-3 px-2 text-indigo-300 font-bold">{map.room_name}</td>
                                                    <td className="py-3 pl-2 text-right space-x-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => startEdit(map)}
                                                            className="text-slate-400 hover:text-indigo-400 font-semibold transition"
                                                        >
                                                            Ubah
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(map.id)}
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
