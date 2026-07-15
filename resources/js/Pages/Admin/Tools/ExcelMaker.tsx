import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import axios from 'axios';

export const ExcelMaker: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [generating, setGenerating] = useState(false);
    const [logs, setLogs] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [infoOpen, setInfoOpen] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            // Reset previous results
            setLogs('');
            setDownloadUrl(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
                setFile(droppedFile);
                setLogs('');
                setDownloadUrl(null);
            } else {
                alert('Hanya file Excel (.xlsx, .xls) yang diperbolehkan.');
            }
        }
    };

    const triggerBrowse = () => {
        fileInputRef.current?.click();
    };

    const handleGenerate = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setGenerating(true);
        setLogs('[PROSES] Sedang mengunggah berkas master dan memulai proses generator...\n');
        setDownloadUrl(null);

        try {
            const response = await axios.post('/admin/excel-maker/generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            setLogs(data.logs);

            if (data.success) {
                setDownloadUrl(data.download_url);
            } else {
                setLogs(prev => prev + '\n[ERROR] Pembuatan spreadsheet gagal. Silakan periksa log di atas.');
            }
        } catch (err: any) {
            const errorOutput = err.response?.data?.logs || err.response?.data?.message || err.message || 'Terjadi kesalahan tidak dikenal.';
            setLogs(prev => prev + `\n[ERROR] Hubungan ke server gagal:\n${errorOutput}`);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <GlassAdminLayout>
            <Head title="Lepkom Excel Maker" />

            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-2">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                            </svg>
                            Lepkom Excel Maker
                        </h1>
                        <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                            Generate spreadsheet penilaian kursus pengulangan (remedial) otomatis dari satu file master
                        </p>
                    </div>

                    <GlassButton 
                        variant="secondary"
                        onClick={() => setInfoOpen(!infoOpen)}
                        className="text-xs"
                    >
                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {infoOpen ? 'Sembunyikan Aturan Format' : 'Tampilkan Aturan Format'}
                    </GlassButton>
                </div>

                {/* Info Format Format Master */}
                {infoOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <GlassCard className="border-indigo-500/20 bg-indigo-500/5">
                            <h3 className="text-xs font-black uppercase text-indigo-300 mb-2 flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Sheet 1: Jadwal Asisten
                            </h3>
                            <p className="text-3xs text-slate-400 mb-2.5 font-bold uppercase">Memetakan PJ, Asisten, dan Tanggal Kloter</p>
                            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 font-medium">
                                <li>Wajib memiliki kolom untuk tiap materi (<strong className="text-white">DBMS, DESKTOP, WEB, NETWORK</strong>).</li>
                                <li>Baris <strong className="text-indigo-400">PJ Penilai</strong> berisi nama PJ masing-masing materi.</li>
                                <li>Baris <strong className="text-teal-400">Asisten</strong> berisi list nama asisten.</li>
                                <li>Harus ada cell yang berisi rentang tanggal, contoh: <code className="bg-slate-950/40 px-1 py-0.5 rounded text-indigo-300 font-semibold">(23 - 28 JUNI 2026)</code>.</li>
                            </ul>
                        </GlassCard>

                        <GlassCard className="border-indigo-500/20 bg-indigo-500/5">
                            <h3 className="text-xs font-black uppercase text-indigo-300 mb-2 flex items-center gap-1.5">
                                <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Sheet 2: Data Pengulangan
                            </h3>
                            <p className="text-3xs text-slate-400 mb-2.5 font-bold uppercase">Daftar Praktikan Remedial</p>
                            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 font-medium">
                                <li>Harus memiliki kolom: <strong className="text-white">NPM, NAMA, KELAS, MATERI KURSUS, TURUNAN MATERI, KATEGORI PENGULANGAN</strong>.</li>
                                <li><strong className="text-indigo-400">TURUNAN MATERI</strong> diisi: <code className="bg-slate-950/40 px-1 py-0.5 rounded text-indigo-300 font-semibold">TURUNAN DBMS</code> / <code className="bg-slate-950/40 px-1 py-0.5 rounded text-indigo-300 font-semibold">DESKTOP</code>, dll.</li>
                                <li><strong className="text-teal-400">KATEGORI PENGULANGAN</strong> diisi: <code className="bg-slate-950/40 px-1 py-0.5 rounded text-indigo-300">ULANG UJIAN</code> atau <code className="bg-slate-950/40 px-1 py-0.5 rounded text-indigo-300">ULANG KURSUS</code>.</li>
                            </ul>
                        </GlassCard>
                    </div>
                )}

                {/* Upload Section & Download Result */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Drag & Drop */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    Upload File Master
                                </h3>
                                
                                <div 
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={triggerBrowse}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] ${
                                        file 
                                            ? 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10' 
                                            : 'border-white/10 bg-white/2 hover:border-white/25 hover:bg-white/4'
                                    }`}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".xlsx, .xls"
                                        className="hidden"
                                    />
                                    
                                    {file ? (
                                        <svg className="h-8 w-8 text-emerald-400 mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-8 w-8 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    )}
                                    {file ? (
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-4xs text-emerald-400 font-extrabold uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-300">Drag & drop file master di sini</p>
                                            <p className="text-3xs text-slate-500">atau klik untuk menelusuri berkas (.xlsx, .xls)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {file && (
                                    <GlassButton
                                        onClick={handleGenerate}
                                        loading={generating}
                                        disabled={generating}
                                        className="w-full text-xs font-black uppercase py-3 tracking-wider flex items-center justify-center gap-1.5"
                                    >
                                        {generating ? 'Membuat Spreadsheet...' : (
                                            <>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Generate Spreadsheet
                                            </>
                                        )}
                                    </GlassButton>
                                )}

                                {downloadUrl && (
                                    <a 
                                        href={downloadUrl}
                                        className="w-full glass-btn-primary py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_0_rgba(79,70,229,0.25)] border border-indigo-500/40 text-center animate-bounce mt-2"
                                    >
                                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Hasil (.zip)
                                    </a>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right: Log Console */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Log Progress
                                </h3>
                                {generating && (
                                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-h-[220px] rounded-xl bg-slate-950/80 p-4 border border-white/5 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-y-auto max-h-[350px] whitespace-pre-wrap select-text scrollbar-light">
                                {logs ? logs : (
                                    <span className="text-slate-600 italic font-sans">Console output akan ditampilkan di sini setelah Anda mengklik tombol Generate...</span>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </GlassAdminLayout>
    );
};

export default ExcelMaker;
