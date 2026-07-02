import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Rule {
    id: number;
    title: string;
    content: string;
    order: number;
}

interface RulesProps {
    rules: Rule[];
}

export const Index: React.FC<RulesProps> = ({ rules }) => {
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
        order: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/rules', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRule) {
            patch(`/admin/rules/${editingRule.id}`, {
                onSuccess: () => {
                    setEditingRule(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan tata tertib ini?')) {
            destroy(`/admin/rules/${id}`);
        }
    };

    const startEdit = (rule: Rule) => {
        setEditingRule(rule);
        setData({
            title: rule.title,
            content: rule.content,
            order: rule.order.toString(),
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Tata Tertib" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Tata Tertib Praktikum</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Aturan dan regulasi laboratorium bagi seluruh praktikan</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingRule ? 'Perbarui Aturan' : 'Tambah Aturan Baru'}
                            </h2>

                            <form onSubmit={editingRule ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Judul Aturan"
                                    placeholder="Contoh: Keterlambatan Hadir"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Detail Regulasi"
                                    isTextArea
                                    placeholder="Tuliskan butir aturan selengkapnya..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={errors.content}
                                />

                                <GlassInput
                                    label="Nomor Urut Tampil"
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
                                        {editingRule ? 'Simpan Perubahan' : 'Tambah Aturan'}
                                    </GlassButton>
                                    
                                    {editingRule && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingRule(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Butir Regulasi Aktif</h2>

                            {rules.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data tata tertib yang didefinisikan.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {rules.map((rule) => (
                                        <div key={rule.id} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-5 w-5 rounded bg-indigo-500/10 text-indigo-300 text-2xs font-black flex items-center justify-center">
                                                        {rule.order}
                                                    </span>
                                                    <h3 className="font-extrabold text-slate-200 text-sm leading-snug">{rule.title}</h3>
                                                </div>
                                                
                                                <div className="flex gap-3 text-2xs font-bold whitespace-nowrap">
                                                    <button
                                                        onClick={() => startEdit(rule)}
                                                        className="text-slate-400 hover:text-indigo-400 transition"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rule.id)}
                                                        className="text-rose-500 hover:text-rose-400 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 whitespace-pre-line leading-relaxed pl-7">
                                                {rule.content}
                                            </p>
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
