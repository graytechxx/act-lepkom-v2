import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';

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
    meeting_number: number | null;
    created_at: string;
    level?: { name: string };
    course?: { name: string };
    uploader?: { name: string };
}

interface MateriProps {
    materials: Material[];
    levels: Level[];
    selectedLevel: string | null;
    selectedCourse: string | null;
}

export const Materi: React.FC<MateriProps> = ({
    materials,
    levels,
    selectedLevel,
    selectedCourse
}) => {
    const [previewItem, setPreviewItem] = useState<{ name: string; url: string; type: string } | null>(null);
    const [activeFolderMap, setActiveFolderMap] = useState<Record<number | string, number | 'general' | null>>({});

    const handleFilterChange = (levelId: string | null, courseId: string | null = null) => {
        const query: Record<string, string> = {};
        if (levelId) query.level = levelId;
        if (courseId) query.course = courseId;
        
        // Reset folders navigation when level filter changes
        setActiveFolderMap({});
        router.get('/materi', query, { preserveState: true });
    };

    const formatBytes = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getEmbeddableUrl = (url: string) => {
        try {
            // Handle Google Drive file link
            if (url.includes('drive.google.com')) {
                return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
            }
            // Handle YouTube video link
            if (url.includes('youtube.com/watch')) {
                const videoId = new URL(url).searchParams.get('v');
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            }
            if (url.includes('youtu.be/')) {
                const parts = url.split('/');
                const videoId = parts[parts.length - 1].split('?')[0];
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (e) {
            console.error(e);
        }
        return url;
    };

    const activeLevelObj = levels.find(l => l.id.toString() === selectedLevel);
    const relatedCourses = activeLevelObj ? activeLevelObj.courses : [];

    const renderMaterialCard = (file: Material) => {
        const isLink = file.type === 'link';
        const isFolder = file.type === 'folder';

        const handleActionClick = (e: React.MouseEvent) => {
            if (isFolder) return;
            e.preventDefault();
            const url = isLink 
                ? getEmbeddableUrl(file.path) 
                : `/admin/materials/${file.id}/download?inline=true`;
            setPreviewItem({ name: file.name, url, type: file.type });
        };

        return (
            <GlassCard light hoverable key={file.id} className="flex flex-col justify-between border border-slate-100 shadow-sm animate-scale-in">
                <div>
                    {/* Badge / Meta */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-600">
                            {file.level?.name || 'Tingkat N/A'}
                        </span>
                        {file.course && (
                            <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide bg-teal-50 text-teal-600">
                                {file.course.name}
                            </span>
                        )}
                        {file.meeting_number && (
                            <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-100">
                                Pertemuan {file.meeting_number}
                            </span>
                        )}
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-start gap-3 mb-4">
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                            isLink 
                                ? 'bg-amber-50 text-amber-600' 
                                : isFolder 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'bg-indigo-50 text-indigo-600'
                        }`}>
                            {isLink ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            ) : isFolder ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug" title={file.name}>
                                {file.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-3xs text-slate-400 font-semibold uppercase">
                                <span>{file.type}</span>
                                {!isLink && !isFolder && file.size && (
                                    <>
                                        <span>•</span>
                                        <span>{formatBytes(file.size)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <div className="mt-2">
                    {isFolder ? (
                        <div className="w-full text-center text-3xs font-extrabold uppercase text-slate-400 tracking-wider py-2">
                            Folder Direktori
                        </div>
                    ) : (
                        <button
                            onClick={handleActionClick}
                            className="w-full text-2xs font-bold py-2 rounded-lg border border-slate-200 hover:border-indigo-650 hover:text-indigo-650 hover:bg-slate-50 transition flex items-center justify-center gap-1 text-slate-655 bg-white cursor-pointer"
                        >
                            Pratinjau / Buka
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    )}
                </div>
            </GlassCard>
        );
    };

    const renderFolderCard = (title: string, count: number, onClick: () => void) => {
        return (
            <button
                onClick={onClick}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur border border-slate-100/70 hover:border-indigo-500 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm text-left group cursor-pointer animate-scale-in"
            >
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 group-hover:scale-105 transition-all shadow-sm">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">{title}</h4>
                    <p className="text-3xs text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">{count} Berkas</p>
                </div>
            </button>
        );
    };

    const meetings = Array.from({ length: 8 }).map((_, i) => i + 1);

    return (
        <GlassPublicLayout>
            <Head title="Materi Praktikum" />

            <div className="space-y-8">
                {/* Intro */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Materi & Modul</h1>
                    <p className="text-sm text-slate-500">Temukan materi dan file modul praktikum Lepkom berdasarkan tingkat studi Anda.</p>
                </div>

                {/* Level Tabs */}
                <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200/50">
                    <button
                        onClick={() => handleFilterChange(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            !selectedLevel 
                                ? 'bg-indigo-600 text-white shadow-sm' 
                                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                        }`}
                    >
                        Semua Tingkat
                    </button>
                    {levels.map((lvl) => (
                        <button
                            key={lvl.id}
                            onClick={() => handleFilterChange(lvl.id.toString())}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                selectedLevel === lvl.id.toString()
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                        >
                            {lvl.name}
                        </button>
                    ))}
                </div>

                {/* Course Sub-filters */}
                {selectedLevel && relatedCourses.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50/50 rounded-xl border border-slate-200/55 max-w-max animate-fade-in">
                        <button
                            onClick={() => handleFilterChange(selectedLevel, null)}
                            className={`px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                                !selectedCourse
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Semua Praktikum
                        </button>
                        {relatedCourses.map((crs) => (
                            <button
                                key={crs.id}
                                onClick={() => handleFilterChange(selectedLevel, crs.id.toString())}
                                className={`px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                                    selectedCourse === crs.id.toString()
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {crs.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Materials Grouped by Level & Meeting */}
                {materials.length === 0 ? (
                    <GlassCard light className="text-center py-16">
                        <svg className="h-10 w-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-slate-400 font-semibold text-sm">Tidak ada materi yang ditemukan untuk filter ini.</p>
                    </GlassCard>
                ) : (
                    <div className="space-y-12 animate-fade-in">
                        {levels.map((lvl) => {
                            const lvlMaterials = materials.filter(m => m.level_id === lvl.id);
                            if (lvlMaterials.length === 0) return null;

                            const activeFolder = activeFolderMap[lvl.id];

                            return (
                                <div key={lvl.id} className="space-y-5">
                                    {/* Level Heading */}
                                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/50 bg-slate-50/20 px-3 py-2 rounded-xl">
                                        <div className="h-3 w-3 rounded-lg bg-indigo-600 shadow-sm shadow-indigo-600/20"></div>
                                        <h2 className="text-base font-black text-slate-800 tracking-tight uppercase">
                                            {lvl.name}
                                        </h2>
                                        <span className="text-4xs font-extrabold uppercase px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                            {lvlMaterials.length} File
                                        </span>
                                    </div>

                                    {/* Folder-style Navigation */}
                                    {activeFolder === undefined || activeFolder === null ? (
                                        /* Folder Grid View */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-2">
                                            {meetings.map((meetingNum) => {
                                                const count = lvlMaterials.filter(m => m.meeting_number === meetingNum).length;
                                                if (count === 0) return null;

                                                return renderFolderCard(
                                                    `Pertemuan ${meetingNum}`,
                                                    count,
                                                    () => setActiveFolderMap(prev => ({ ...prev, [lvl.id]: meetingNum }))
                                                );
                                            })}

                                            {/* General/Lainnya Folder */}
                                            {lvlMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length > 0 && (
                                                renderFolderCard(
                                                    "Materi Lainnya / Umum",
                                                    lvlMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length,
                                                    () => setActiveFolderMap(prev => ({ ...prev, [lvl.id]: 'general' }))
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        /* Files Inside Folder View */
                                        <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-indigo-600/10">
                                            {/* Folder Path and Back Button */}
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setActiveFolderMap(prev => ({ ...prev, [lvl.id]: null }))}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-3xs font-extrabold uppercase transition bg-white shadow-sm cursor-pointer"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                        </svg>
                                                        Kembali
                                                    </button>
                                                    <span className="text-3xs text-slate-500 font-black uppercase tracking-wider">
                                                        {activeFolder === 'general' ? 'Materi Lainnya' : `Pertemuan ${activeFolder}`}
                                                    </span>
                                                </div>
                                                <span className="text-3xs text-slate-400 font-extrabold uppercase">
                                                    {activeFolder === 'general'
                                                        ? lvlMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length
                                                        : lvlMaterials.filter(m => m.meeting_number === activeFolder).length} Berkas
                                                </span>
                                            </div>

                                            {/* File Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                                                {activeFolder === 'general'
                                                    ? lvlMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).map(file => renderMaterialCard(file))
                                                    : lvlMaterials.filter(m => m.meeting_number === activeFolder).map(file => renderMaterialCard(file))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* General materials (level_id === null) */}
                        {materials.filter(m => m.level_id === null).length > 0 && (
                            (() => {
                                const generalMaterials = materials.filter(m => m.level_id === null);
                                const activeFolder = activeFolderMap['general_lvl'];

                                return (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/50 bg-slate-50/20 px-3 py-2 rounded-xl">
                                            <div className="h-3 w-3 rounded-lg bg-slate-600 shadow-sm shadow-slate-600/20"></div>
                                            <h2 className="text-base font-black text-slate-800 tracking-tight uppercase">
                                                Umum / Lainnya
                                            </h2>
                                            <span className="text-4xs font-extrabold uppercase px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-150">
                                                {generalMaterials.length} File
                                            </span>
                                        </div>

                                        {activeFolder === undefined || activeFolder === null ? (
                                            /* Folder Grid View */
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-2">
                                                {meetings.map((meetingNum) => {
                                                    const count = generalMaterials.filter(m => m.meeting_number === meetingNum).length;
                                                    if (count === 0) return null;

                                                    return renderFolderCard(
                                                        `Pertemuan ${meetingNum}`,
                                                        count,
                                                        () => setActiveFolderMap(prev => ({ ...prev, 'general_lvl': meetingNum }))
                                                    );
                                                })}

                                                {generalMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length > 0 && (
                                                    renderFolderCard(
                                                        "Materi Lainnya",
                                                        generalMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length,
                                                        () => setActiveFolderMap(prev => ({ ...prev, 'general_lvl': 'general' }))
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            /* Files Inside Folder View */
                                            <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-slate-350/10">
                                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setActiveFolderMap(prev => ({ ...prev, 'general_lvl': null }))}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-3xs font-extrabold uppercase transition bg-white shadow-sm cursor-pointer"
                                                        >
                                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                            </svg>
                                                            Kembali
                                                        </button>
                                                        <span className="text-3xs text-slate-500 font-black uppercase tracking-wider">
                                                            {activeFolder === 'general' ? 'Materi Lainnya' : `Pertemuan ${activeFolder}`}
                                                        </span>
                                                    </div>
                                                    <span className="text-3xs text-slate-400 font-extrabold uppercase">
                                                        {activeFolder === 'general'
                                                            ? generalMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).length
                                                            : generalMaterials.filter(m => m.meeting_number === activeFolder).length} Berkas
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                                                    {activeFolder === 'general'
                                                        ? generalMaterials.filter(m => m.meeting_number === null || m.meeting_number < 1 || m.meeting_number > 8).map(file => renderMaterialCard(file))
                                                        : generalMaterials.filter(m => m.meeting_number === activeFolder).map(file => renderMaterialCard(file))
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                )}
            </div>

            {/* Inline Preview Glassmorphic Modal */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setPreviewItem(null)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full h-[85vh] md:h-[90vh] rounded-2xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-200/50 bg-white/20">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100 shadow-sm">
                                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate pr-4" title={previewItem.name}>
                                    Pratinjau: {previewItem.name}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {!previewItem.url.includes('inline=true') ? (
                                    <a 
                                        href={previewItem.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-650 hover:text-indigo-650 text-3xs font-bold uppercase transition bg-white"
                                    >
                                        Buka di Tab Baru
                                    </a>
                                ) : (
                                    <>
                                        <a 
                                            href={previewItem.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-650 hover:text-indigo-650 text-3xs font-bold uppercase transition bg-white"
                                        >
                                            Pratinjau di Tab Baru
                                        </a>
                                        <a 
                                            href={previewItem.url.replace('inline=true', 'download').split('?')[0]} 
                                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-3xs font-bold uppercase transition shadow-sm"
                                        >
                                            Unduh
                                        </a>
                                    </>
                                )}
                                <button 
                                    onClick={() => setPreviewItem(null)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200/50 text-slate-500 hover:text-slate-700 transition cursor-pointer"
                                >
                                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Body - Embedded Content */}
                        <div className="flex-1 bg-slate-950 relative">
                            <iframe 
                                src={previewItem.url}
                                className="w-full h-full border-0"
                                title={previewItem.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </GlassPublicLayout>
    );
};

export default Materi;
