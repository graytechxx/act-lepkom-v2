import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';
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

    const handleFilterChange = (levelId: string | null, courseId: string | null = null) => {
        const query: Record<string, string> = {};
        if (levelId) query.level = levelId;
        if (courseId) query.course = courseId;
        
        router.get('/materi', query, { preserveState: true });
    };

    const formatBytes = (bytes: number | null) => {
        if (!bytes) return 'N/A';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const activeLevelObj = levels.find(l => l.id.toString() === selectedLevel);
    const relatedCourses = activeLevelObj ? activeLevelObj.courses : [];

    return (
        <GlassPublicLayout>
            <Head title="Materi Praktikum" />

            <div className="space-y-8">
                {/* Intro */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Materi Praktikum</h1>
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
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50/50 rounded-xl border border-slate-200/55 max-w-max">
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

                {/* Materials List */}
                {materials.length === 0 ? (
                    <GlassCard light className="text-center py-16">
                        <svg className="h-10 w-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-slate-400 font-semibold text-sm">Tidak ada materi yang ditemukan untuk filter ini.</p>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map((file) => {
                            const isLink = file.type === 'link';
                            const isFolder = file.type === 'folder';

                            return (
                                <GlassCard light hoverable key={file.id} className="flex flex-col justify-between border border-slate-100 shadow-sm">
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
                                        {isLink ? (
                                            <a
                                                href={file.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full text-2xs font-bold py-2 rounded-lg border border-slate-200 hover:border-amber-500 hover:text-amber-600 transition flex items-center justify-center gap-1 text-slate-600 bg-white"
                                            >
                                                Buka Tautan
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <a
                                                href={`/admin/materials/${file.id}/download`}
                                                className="w-full text-2xs font-bold py-2 rounded-lg border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition flex items-center justify-center gap-1 text-slate-600 bg-white"
                                            >
                                                Unduh File
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}
            </div>
        </GlassPublicLayout>
    );
};

export default Materi;
