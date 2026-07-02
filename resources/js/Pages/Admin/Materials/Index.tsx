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
    courses: Course[];
}

interface Course {
    id: number;
    name: string;
    level_id: number;
}

interface Material {
    id: number;
    level_id: number | null;
    course_id: number | null;
    name: string;
    type: 'file' | 'folder' | 'link';
    path: string;
    mime_type: string | null;
    size: number | null;
    created_at: string;
    level?: { name: string };
    course?: { name: string };
    uploader?: { name: string };
}

interface MaterialsProps {
    materials: Material[];
    levels: Level[];
}

export const Index: React.FC<MaterialsProps> = ({ materials, levels }) => {
    const [creationMode, setCreationMode] = useState<'upload' | 'manual'>('upload');

    // Form for file upload
    const uploadForm = useForm({
        file: null as File | null,
        level_id: '',
        course_id: '',
    });

    // Form for manual link or folder creation
    const manualForm = useForm({
        level_id: '',
        course_id: '',
        name: '',
        type: 'link', // link or folder
        path: '',
    });

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/admin/materials/upload', {
            onSuccess: () => {
                uploadForm.reset();
            }
        });
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/admin/materials', {
            onSuccess: () => {
                manualForm.reset();
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
            uploadForm.delete(`/admin/materials/${id}`);
        }
    };

    const formatBytes = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Filter courses options based on level selection
    const uploadLevelObj = levels.find(l => l.id.toString() === uploadForm.data.level_id);
    const uploadCoursesOptions = uploadLevelObj 
        ? uploadLevelObj.courses.map(c => ({ value: c.id.toString(), label: c.name }))
        : [];

    const manualLevelObj = levels.find(l => l.id.toString() === manualForm.data.level_id);
    const manualCoursesOptions = manualLevelObj 
        ? manualLevelObj.courses.map(c => ({ value: c.id.toString(), label: c.name }))
        : [];

    return (
        <GlassAdminLayout>
            <Head title="Manajemen Materi" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-black text-white">Materi & Modul Praktikum</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Unggah berkas modul, buat tautan eksternal, atau susun subfolder materi</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Form: Creator Wizard */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard className="border-white/5 shadow-md">
                            {/* Mode Toggle */}
                            <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setCreationMode('upload')}
                                    className={`grow text-3xs font-black uppercase tracking-wider py-2 rounded-lg transition-all ${
                                        creationMode === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Unggah File
                                </button>
                                <button
                                    onClick={() => setCreationMode('manual')}
                                    className={`grow text-3xs font-black uppercase tracking-wider py-2 rounded-lg transition-all ${
                                        creationMode === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Tautan & Folder
                                </button>
                            </div>

                            {creationMode === 'upload' ? (
                                <form onSubmit={handleUploadSubmit} className="space-y-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Upload Berkas Fisik</h2>
                                    
                                    <GlassInput
                                        label="Tingkat Studi"
                                        placeholder="-- Pilih Tingkat Studi --"
                                        value={uploadForm.data.level_id}
                                        onChange={(e) => {
                                            uploadForm.setData('level_id', e.target.value);
                                            uploadForm.setData('course_id', '');
                                        }}
                                        options={levels.map(l => ({ value: l.id.toString(), label: l.name }))}
                                        error={uploadForm.errors.level_id}
                                    />

                                    <GlassInput
                                        label="Mata Praktikum"
                                        placeholder="-- Pilih Praktikum --"
                                        value={uploadForm.data.course_id}
                                        onChange={(e) => uploadForm.setData('course_id', e.target.value)}
                                        options={uploadCoursesOptions}
                                        disabled={!uploadForm.data.level_id}
                                        error={uploadForm.errors.course_id}
                                    />

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400">Pilih Berkas (Max 50MB)</label>
                                        <input
                                            type="file"
                                            onChange={(e) => uploadForm.setData('file', e.target.files?.[0] || null)}
                                            className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-bold file:bg-white/10 file:text-white file:cursor-pointer hover:file:bg-white/15 transition"
                                        />
                                        {uploadForm.errors.file && (
                                            <p className="mt-1 text-xs text-red-500">{uploadForm.errors.file}</p>
                                        )}
                                    </div>

                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-xs font-bold py-2.5 mt-2"
                                        disabled={uploadForm.processing}
                                        loading={uploadForm.processing}
                                    >
                                        Unggah File Modul
                                    </GlassButton>
                                </form>
                            ) : (
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Buat Link / Folder</h2>
                                    
                                    <GlassInput
                                        label="Tingkat Studi"
                                        placeholder="-- Pilih Tingkat Studi --"
                                        value={manualForm.data.level_id}
                                        onChange={(e) => {
                                            manualForm.setData('level_id', e.target.value);
                                            manualForm.setData('course_id', '');
                                        }}
                                        options={levels.map(l => ({ value: l.id.toString(), label: l.name }))}
                                        error={manualForm.errors.level_id}
                                    />

                                    <GlassInput
                                        label="Mata Praktikum"
                                        placeholder="-- Pilih Praktikum --"
                                        value={manualForm.data.course_id}
                                        onChange={(e) => manualForm.setData('course_id', e.target.value)}
                                        options={manualCoursesOptions}
                                        disabled={!manualForm.data.level_id}
                                        error={manualForm.errors.course_id}
                                    />

                                    <GlassInput
                                        label="Tipe Data"
                                        value={manualForm.data.type}
                                        onChange={(e) => manualForm.setData('type', e.target.value as any)}
                                        options={[
                                            { value: 'link', label: 'Tautan / Link Web' },
                                            { value: 'folder', label: 'Folder Direktori' },
                                        ]}
                                        error={manualForm.errors.type}
                                    />

                                    <GlassInput
                                        label="Nama Materi / Folder"
                                        placeholder="Contoh: Modul Lanjutan GDrive"
                                        value={manualForm.data.name}
                                        onChange={(e) => manualForm.setData('name', e.target.value)}
                                        error={manualForm.errors.name}
                                    />

                                    <GlassInput
                                        label={manualForm.data.type === 'link' ? 'URL / Link Tujuan' : 'Path Direktori'}
                                        placeholder={manualForm.data.type === 'link' ? 'https://google.com' : '/materials/praktikum-web'}
                                        value={manualForm.data.path}
                                        onChange={(e) => manualForm.setData('path', e.target.value)}
                                        error={manualForm.errors.path}
                                    />

                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-xs font-bold py-2.5 mt-2"
                                        disabled={manualForm.processing}
                                    >
                                        Buat Item Baru
                                    </GlassButton>
                                </form>
                            )}
                        </GlassCard>
                    </div>

                    {/* Right Card Table List */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5">Daftar Materi Terunggah</h2>

                            {materials.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 font-bold text-xs">
                                    Belum ada data materi praktikum.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                                <th className="pb-3 pr-2">Materi</th>
                                                <th className="pb-3 px-2">Info Praktikum</th>
                                                <th className="pb-3 px-2">Ukuran / Jenis</th>
                                                <th className="pb-3 px-2">Diunggah Oleh</th>
                                                <th className="pb-3 pl-2 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                                            {materials.map((mat) => {
                                                const isLink = mat.type === 'link';
                                                const isFolder = mat.type === 'folder';

                                                return (
                                                    <tr key={mat.id} className="hover:bg-white/2 transition duration-150">
                                                        <td className="py-3 pr-2 font-bold text-slate-200">
                                                            <div className="flex items-center gap-2 max-w-xs truncate" title={mat.name}>
                                                                {isLink ? (
                                                                    <svg className="h-4 w-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                                    </svg>
                                                                ) : isFolder ? (
                                                                    <svg className="h-4 w-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="h-4 w-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                                <span>{mat.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2 space-y-0.5">
                                                            <div className="text-3xs font-extrabold text-indigo-300 uppercase tracking-wide">
                                                                {mat.level?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-slate-400 text-3xs font-bold uppercase">
                                                                {mat.course?.name || 'Umum'}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2 font-mono text-slate-400 uppercase text-3xs">
                                                            {isLink ? 'Web Link' : isFolder ? 'Folder' : formatBytes(mat.size)}
                                                        </td>
                                                        <td className="py-3 px-2 text-slate-400 whitespace-nowrap">{mat.uploader?.name || 'Admin'}</td>
                                                        <td className="py-3 pl-2 text-right space-x-2.5 whitespace-nowrap font-bold">
                                                            {!isFolder && (
                                                                isLink ? (
                                                                    <a href={mat.path} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 transition">Buka</a>
                                                                ) : (
                                                                    <a href={`/admin/materials/${mat.id}/download`} className="text-indigo-400 hover:text-indigo-300 transition">Unduh</a>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(mat.id)}
                                                                className="text-rose-500 hover:text-rose-400 transition"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
