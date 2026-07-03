import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import * as XLSX from 'xlsx';

interface IndexProps {
    schedule: Record<string, any>[];
}

export const Index: React.FC<IndexProps> = ({ schedule }) => {
    const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
    const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);

    // Initialize with existing schedule if present
    useEffect(() => {
        if (schedule && schedule.length > 0) {
            const headers = Object.keys(schedule[0]);
            setParsedHeaders(headers);
            setParsedRows(schedule);
        }
    }, [schedule]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const buffer = evt.target?.result;
            if (!buffer) return;

            try {
                const data = new Uint8Array(buffer as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
                
                if (rawData.length === 0) {
                    alert('Berkas Excel kosong.');
                    return;
                }

                // Process headers and rows
                const headers = rawData[0].map(h => String(h || '').trim());
                const rows = rawData.slice(1).map(row => {
                    const rowData: Record<string, any> = {};
                    headers.forEach((header, index) => {
                        if (header) {
                            rowData[header] = row[index] !== undefined ? String(row[index]).trim() : '';
                        }
                    });
                    return rowData;
                }).filter(row => Object.values(row).some(val => val !== ''));

                setParsedHeaders(headers.filter(Boolean));
                setParsedRows(rows);
            } catch (err: any) {
                console.error(err);
                alert('Gagal membaca berkas Excel: ' + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSave = () => {
        if (parsedRows.length === 0) {
            alert('Tidak ada data jadwal untuk disimpan.');
            return;
        }

        router.post('/admin/schedules', { data: parsedRows }, {
            onSuccess: () => {
                alert('Jadwal asisten berhasil diperbarui.');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Gagal menyimpan jadwal: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleClear = () => {
        if (confirm('Apakah Anda yakin ingin menghapus perubahan data jadwal ini?')) {
            setParsedHeaders([]);
            setParsedRows([]);
        }
    };

    return (
        <GlassAdminLayout>
            <Head title="Kelola Jadwal Asisten" />

            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-xl font-black text-white">Kelola Jadwal Asisten</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Unggah dan perbarui jadwal asisten PJ dan Tutor dari berkas Microsoft Excel (.xlsx)
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Card */}
                    <div className="lg:col-span-1">
                        <GlassCard className="border-white/5 shadow-md space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300">Unggah Jadwal</h2>
                            
                            <div className="space-y-3">
                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-slate-400">Pilih Berkas Excel (.xlsx)</label>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-3xs file:font-bold file:bg-indigo-500/10 file:text-indigo-300 file:cursor-pointer hover:file:bg-indigo-500/20 transition-all"
                                />
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-white/5">
                                <GlassButton
                                    variant="primary"
                                    className="grow text-2xs font-bold py-2"
                                    onClick={handleSave}
                                    disabled={parsedRows.length === 0}
                                >
                                    Simpan Jadwal
                                </GlassButton>
                                {parsedRows.length > 0 && (
                                    <GlassButton
                                        variant="danger"
                                        className="text-2xs font-bold py-2"
                                        onClick={handleClear}
                                    >
                                        Batal
                                    </GlassButton>
                                )}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Preview Table */}
                    <div className="lg:col-span-2">
                        <GlassCard className="border-white/5 shadow-md">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Preview Jadwal Asisten</h2>
                            
                            {parsedRows.length === 0 ? (
                                <div className="text-center py-16 text-slate-500 font-bold text-xs">
                                    Belum ada data jadwal yang diunggah.
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-white/5 max-h-[500px] scrollbar-light">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-3xs font-extrabold uppercase tracking-wider">
                                                {parsedHeaders.map((header) => (
                                                    <th key={header} className="px-4 py-3 font-bold select-none">{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsedRows.map((row, idx) => (
                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                                    {parsedHeaders.map((header) => (
                                                        <td key={header} className="px-4 py-2.5 text-slate-300 font-medium whitespace-nowrap">
                                                            {row[header] || '-'}
                                                        </td>
                                                    ))}
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
