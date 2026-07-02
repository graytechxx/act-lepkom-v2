import React from 'react';
import { Head } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';

interface Rule {
    id: number;
    title: string;
    content: string;
    order: number;
}

interface TataTertibProps {
    rules: Rule[];
}

export const TataTertib: React.FC<TataTertibProps> = ({ rules }) => {
    return (
        <GlassPublicLayout>
            <Head title="Tata Tertib" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">Tata Tertib Praktikum</h1>
                    <p className="text-sm text-slate-500">Peraturan dan kode etik wajib yang harus dipatuhi oleh seluruh praktikan selama berada di lingkungan Laboratorium Lepkom J5.</p>
                </div>

                {/* Content Cards */}
                {rules.length === 0 ? (
                    <GlassCard light className="text-center py-16">
                        <p className="text-slate-400 font-semibold text-sm">Belum ada data tata tertib praktikum saat ini.</p>
                    </GlassCard>
                ) : (
                    <div className="space-y-6">
                        {rules.map((rule, idx) => (
                            <GlassCard light hoverable key={rule.id} className="border border-slate-100 shadow-sm relative overflow-hidden">
                                {/* Large Number BG decoration */}
                                <div className="absolute right-4 bottom-[-10px] text-8xl font-black text-slate-100 select-none z-0 pointer-events-none">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-6 w-6 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600">
                                            {idx + 1}
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm sm:text-base">{rule.title}</h3>
                                    </div>
                                    <p className="text-slate-600 text-xs sm:text-sm whitespace-pre-line leading-relaxed pl-9">
                                        {rule.content}
                                    </p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>
        </GlassPublicLayout>
    );
};

export default TataTertib;
