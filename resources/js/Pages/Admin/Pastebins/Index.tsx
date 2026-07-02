import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Pastebin {
    id: number;
    title: string;
    content: string;
    language: string | null;
    code: string;
    is_public: boolean;
    created_at: string;
}

interface PastebinsProps {
    pastebins: Pastebin[];
}

const LANGUAGES = [
    { value: 'plain', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Golang' },
    { value: 'java', label: 'Java' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
];

export const Index: React.FC<PastebinsProps> = ({ pastebins }) => {
    const [editingPaste, setEditingPaste] = useState<Pastebin | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        content: '',
        language: 'plain',
        is_public: true,
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pastebins', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPaste) {
            patch(`/admin/pastebins/${editingPaste.id}`, {
                onSuccess: () => {
                    setEditingPaste(null);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pastebin ini?')) {
            destroy(`/admin/pastebins/${id}`);
        }
    };

    const startEdit = (paste: Pastebin) => {
        setEditingPaste(paste);
        setData({
            title: paste.title,
            content: paste.content,
            language: paste.language || 'plain',
            is_public: !!paste.is_public,
        });
    };

    const copyShareLink = (code: string, id: number) => {
        const link = `${window.location.origin}/p/${code}`;
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <GlassAdminLayout>
            <Head title="Pastebin Saya" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Kode Pastebin Saya</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Bagikan contoh potongan kode program kepada praktikan dengan cepat melalui kode unik</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Add/Edit */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">
                                {editingPaste ? 'Perbarui Snippet' : 'Buat Snippet Baru'}
                            </h2>

                            <form onSubmit={editingPaste ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                                <GlassInput
                                    label="Judul Pastebin"
                                    placeholder="Contoh: Kode Koneksi Database"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={errors.title}
                                />

                                <GlassInput
                                    label="Bahasa Pemrograman"
                                    value={data.language}
                                    onChange={(e) => setData('language', e.target.value)}
                                    options={LANGUAGES}
                                    error={errors.language}
                                />

                                <GlassInput
                                    label="Isi Source Code"
                                    isTextArea
                                    placeholder="Tempel atau ketikkan kode program disini..."
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    error={errors.content}
                                    className="font-mono text-xs"
                                />

                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        checked={data.is_public}
                                        onChange={(e) => setData('is_public', e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
                                    />
                                    <label htmlFor="is_public" className="text-2xs font-bold text-slate-300 uppercase tracking-wider select-none cursor-pointer">
                                        Dapat Diakses Publik
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="text-2xs font-bold grow py-2.5"
                                        disabled={processing}
                                    >
                                        {editingPaste ? 'Simpan' : 'Buat Pastebin'}
                                    </GlassButton>
                                    
                                    {editingPaste && (
                                        <GlassButton
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setEditingPaste(null);
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Snippet Tersimpan</h2>

                            {pastebins.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data pastebin dibuat.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pastebins.map((paste) => (
                                        <div key={paste.id} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded text-4xs font-extrabold uppercase tracking-wide bg-indigo-500/10 text-indigo-300">
                                                            {paste.language || 'plain'}
                                                        </span>
                                                        <h3 className="font-extrabold text-slate-200 text-sm leading-snug">{paste.title}</h3>
                                                    </div>
                                                    <p className="text-4xs text-slate-500 font-bold uppercase mt-1">
                                                        DIBUAT: {new Date(paste.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-4xs font-extrabold uppercase tracking-wide ${
                                                        paste.is_public 
                                                            ? 'bg-teal-500/10 text-teal-300' 
                                                            : 'bg-slate-500/10 text-slate-400'
                                                    }`}>
                                                        {paste.is_public ? 'Publik' : 'Private'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Preview snippet content */}
                                            <pre className="font-mono text-3xs text-slate-400 bg-black/20 p-2.5 rounded-lg overflow-x-auto max-h-24 my-2 border border-white/3 select-all">
                                                {paste.content}
                                            </pre>

                                            <div className="flex justify-between items-center text-2xs font-bold pt-3 border-t border-white/5">
                                                {paste.is_public ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => copyShareLink(paste.code, paste.id)}
                                                        className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.318-2.159m-4.318 3.081l4.318 2.159m-7.493-2.91a3 3 0 110-6 3 3 0 010 6zm1.2-4.8l2.4 1.2" />
                                                        </svg>
                                                        {copiedId === paste.id ? 'Tautan Disalin!' : 'Bagikan Link'}
                                                    </button>
                                                ) : (
                                                    <div></div>
                                                )}

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => startEdit(paste)}
                                                        className="text-slate-400 hover:text-indigo-400 transition"
                                                    >
                                                        Ubah
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(paste.id)}
                                                        className="text-rose-500 hover:text-rose-400 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
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
