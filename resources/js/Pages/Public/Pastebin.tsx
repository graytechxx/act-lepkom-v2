import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

interface User {
    id: number;
    name: string;
}

interface Pastebin {
    id: number;
    title: string;
    content: string;
    language: string | null;
    code: string;
    is_public: boolean;
    created_at: string;
    user?: User;
}

interface PastebinProps {
    pastebin: Pastebin;
}

export const Pastebin: React.FC<PastebinProps> = ({ pastebin }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(pastebin.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <GlassPublicLayout>
            <Head title={`Pastebin: ${pastebin.title}`} />

            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Meta Header */}
                <GlassCard light className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-100 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-700">
                                {pastebin.language || 'Plain Text'}
                            </span>
                            <span className="text-3xs text-slate-400 font-semibold">
                                Kode: {pastebin.code}
                            </span>
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-800">{pastebin.title}</h1>
                        <p className="text-2xs text-slate-400 mt-1 font-bold">
                            DIKIRIM OLEH: {pastebin.user?.name || 'Anonim'} • {new Date(pastebin.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>

                    <GlassButton
                        type="button"
                        onClick={handleCopy}
                        variant="secondary"
                        light
                        className="text-xs font-bold shrink-0 self-start sm:self-center"
                    >
                        {copied ? (
                            <>
                                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Berhasil Disalin!
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Salin Kode
                            </>
                        )}
                    </GlassButton>
                </GlassCard>

                {/* Code Body Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed">
                    {/* Fake Window Header for aesthetics */}
                    <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                            <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                            <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
                        </div>
                        <span className="text-3xs text-slate-500 uppercase tracking-widest font-bold font-sans">
                            {pastebin.language || 'text'} view
                        </span>
                    </div>

                    {/* Pre / Code area */}
                    <div className="overflow-x-auto p-6 max-h-[600px] scrollbar-light">
                        <pre className="font-mono text-xs sm:text-sm">
                            <code>{pastebin.content}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </GlassPublicLayout>
    );
};

export default Pastebin;
