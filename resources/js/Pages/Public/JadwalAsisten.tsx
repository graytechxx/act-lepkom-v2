import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';

interface JadwalAsistenProps {
    schedule: Record<string, any>[];
}

export const JadwalAsisten: React.FC<JadwalAsistenProps> = ({ schedule }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const headers = schedule.length > 0 ? Object.keys(schedule[0]) : [];

    const filteredRows = schedule.filter(row => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return Object.values(row).some(val => 
            String(val || '').toLowerCase().includes(q)
        );
    });

    return (
        <GlassPublicLayout>
            <Head title="Jadwal Asisten & Tutor" />

            <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Hero Section */}
                <div className="text-center py-4 max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
                        Jadwal Jaga Asisten & Tutor <br />
                        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                            Lepkom Gunadarma J5
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        Cari jadwal asisten PJ Lab atau Tutor mata praktikum Anda berdasarkan hari, jam, kelas, atau nama asisten.
                    </p>
                </div>

                {/* Filter and Search Panel */}
                <div className="max-w-md mx-auto">
                    <GlassCard light className="p-4 border border-slate-100 shadow-md">
                        <div className="relative">
                            <GlassInput
                                light
                                placeholder="Cari nama, hari, mata praktikum, ruang..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="py-2.5 text-xs mb-0 pl-10"
                            />
                            <div className="absolute left-3 top-3.5 text-slate-400">
                                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Schedule Table Display */}
                <GlassCard light className="p-6 border border-slate-100 shadow-md">
                    {schedule.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                            Jadwal asisten belum dirilis atau sedang diperbarui.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-3xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                                <span>Menampilkan: {filteredRows.length} dari {schedule.length} baris</span>
                                {searchQuery && <span>Hasil pencarian "{searchQuery}"</span>}
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/40">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-500 text-3xs font-extrabold uppercase tracking-wider">
                                            {headers.map((header) => (
                                                <th key={header} className="px-4 py-3 font-bold select-none">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRows.length === 0 ? (
                                            <tr>
                                                <td colSpan={headers.length} className="text-center py-12 text-slate-400 font-semibold uppercase tracking-wider text-2xs">
                                                    Tidak ada jadwal yang cocok dengan kata kunci pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRows.map((row, idx) => (
                                                <tr key={idx} className="border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors">
                                                    {headers.map((header) => {
                                                        const val = row[header] || '-';
                                                        const isMatch = searchQuery && String(val).toLowerCase().includes(searchQuery.toLowerCase());
                                                        return (
                                                            <td key={header} className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                                                                {isMatch ? (
                                                                    <mark className="bg-yellow-100 text-slate-900 rounded px-1 py-0.5 font-bold">
                                                                        {val}
                                                                    </mark>
                                                                ) : (
                                                                    val
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        </GlassPublicLayout>
    );
};

export default JadwalAsisten;
