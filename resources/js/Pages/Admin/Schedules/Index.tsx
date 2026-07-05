import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';
import * as XLSX from 'xlsx';

interface IndexProps {
    schedule: Record<string, any>[];
}

/**
 * Parse matrix format jadwal asisten.
 * Format: Sheet dengan kolom lintas hari (SENIN-SABTU) dan ruang (121/122/124/125).
 * 
 * Struktur:
 *   Row HARI:   HARI |   | SENIN         | ... | SELASA        | ...
 *   Row RUANG:  RUANG|   | J5 121 | J5 122 | ... | J5 121 | ...
 *   Row Materi: Materi|   | [mata praktikum per kolom]
 *   Row SESI:   SESI 0 | TUTOR | [nama per kolom]
 *   Row Waktu:  HH:MM-HH:MM | ASISTEN PJ | [nama per kolom]
 *   Row:          | ASISTEN  | [nama per kolom]
 *   Row:          | ASISTEN  | [nama per kolom]
 *   Row:          | ASISTEN  | [nama per kolom]
 *   ... (repeat for next session)
 */
function parseMatrixSchedule(rawData: any[][]): { headers: string[], rows: Record<string, any>[] } {
    const DAY_NAMES = ['SENIN', 'SELASA', 'RABU', 'KAMIS', "JUM'AT", 'SABTU'];

    // 1. Cari baris HARI dan RUANG
    let hariRowIdx = -1, ruangRowIdx = -1;
    for (let r = 0; r < rawData.length; r++) {
        const v = String(rawData[r]?.[0] || '').trim().toUpperCase();
        if (v === 'HARI') hariRowIdx = r;
        else if (v === 'RUANG' && hariRowIdx >= 0) ruangRowIdx = r;
        if (hariRowIdx >= 0 && ruangRowIdx >= 0) break;
    }

    if (hariRowIdx < 0 || ruangRowIdx < 0) {
        return { headers: [], rows: [] };
    }

    const hariRow = rawData[hariRowIdx];
    const ruangRow = rawData[ruangRowIdx];

    // 2. Mapping kolom (index kolom) -> { day, room }
    let currentDay = '';
    const colMap: Record<number, { day: string; room: string }> = {};
    for (let c = 0; c < Math.max(hariRow.length, ruangRow.length); c++) {
        const d = String(hariRow[c] || '').trim().toUpperCase();
        if (DAY_NAMES.includes(d)) currentDay = d;
        // Handle JUM'AT
        if (d.startsWith("JUM")) currentDay = "JUM'AT";
        
        const roomVal = String(ruangRow[c] || '').trim().toUpperCase();
        if (c > 1 && currentDay && roomVal) {
            colMap[c] = { day: currentDay, room: roomVal };
        }
    }

    const maxCol = Math.max(...Object.keys(colMap).map(Number));

    // 3. Parse blok sesi
    const entries: Record<string, any>[] = [];
    let lastMateriRow: any[] = [];

    let r = ruangRowIdx + 1;
    while (r < rawData.length) {
        const row = rawData[r];
        if (!row || row.length === 0) { r++; continue; }

        const col0 = String(row[0] || '').trim();
        const col1 = String(row[1] || '').trim();

        // Skip baris "Materi" — simpan untuk referensi
        if (col0 === 'Materi') {
            lastMateriRow = row;
            r++;
            continue;
        }

        // Deteksi awal blok sesi: "SESI X"
        if (col0.toUpperCase().startsWith('SESI')) {
            const tutorRow = row; // row ini punya TUTOR di col1

            // Cari baris ASISTEN PJ (row berikutnya yang punya jam di col0 dan "ASISTEN PJ" di col1)
            let pjRow: any[] | null = null;
            let asistenRows: any[][] = [];
            let scanR = r + 1;

            while (scanR < rawData.length) {
                const sRow = rawData[scanR];
                if (!sRow || sRow.length === 0) { scanR++; continue; }
                const sCol0 = String(sRow[0] || '').trim();
                const sCol1 = String(sRow[1] || '').trim();

                if (sCol1 === 'ASISTEN PJ' && /^[\d.:\s-]+$/.test(sCol0)) {
                    pjRow = sRow;
                    scanR++;
                    break;
                }
                scanR++;
            }

            if (!pjRow) { r++; continue; }

            // Cari baris ASISTEN setelah ASISTEN PJ
            while (scanR < rawData.length) {
                const aRow = rawData[scanR];
                if (!aRow || aRow.length === 0) { scanR++; break; }

                // Cek apakah semua nilai kosong (selain col0/col1 yang boleh ASISTEN)
                const aCol0 = String(aRow[0] || '').trim();
                const aCol1 = String(aRow[1] || '').trim();

                if (aCol0 === '' && aCol1 === 'ASISTEN') {
                    asistenRows.push(aRow);
                    scanR++;
                } else {
                    break;
                }
            }

            const time = String(pjRow[0] || '').trim();

            // Buat entry untuk setiap kolom yang punya PJ name
            for (let c = 2; c <= maxCol; c++) {
                if (!colMap[c]) continue;
                const pjName = String(pjRow[c] || '').trim();
                if (!pjName) continue;

                const entry: Record<string, any> = {
                    Hari: colMap[c].day,
                    Jam: time,
                    Ruang: colMap[c].room,
                    'Mata Praktikum': String(lastMateriRow[c] || '').trim(),
                    'Penanggung Jawab': pjName,
                    'Tutor': String(tutorRow[c] || '').trim(),
                };

                asistenRows.forEach((aRow, i) => {
                    const name = String(aRow[c] || '').trim();
                    if (name) entry[`Asisten ${i + 1}`] = name;
                });

                entries.push(entry);
            }

            r = scanR;
            continue;
        }

        r++;
    }

    if (entries.length === 0) return { headers: [], rows: [] };

    // Hitung jumlah asisten maksimal
    let maxAsisten = 0;
    entries.forEach(e => {
        let count = 0;
        while (e[`Asisten ${count + 1}`]) count++;
        if (count > maxAsisten) maxAsisten = count;
    });

    const headers = ['Hari', 'Jam', 'Ruang', 'Mata Praktikum', 'Penanggung Jawab', 'Tutor'];
    for (let i = 1; i <= maxAsisten; i++) headers.push(`Asisten ${i}`);

    return { headers, rows: entries };
}

/**
 * Deteksi apakah file dalam format matrix (cross-tab) jadwal asisten.
 */
function isMatrixFormat(rawData: any[][]): boolean {
    for (let r = 0; r < Math.min(10, rawData.length); r++) {
        const row = rawData[r];
        if (row && String(row[0] || '').trim().toUpperCase() === 'HARI') {
            return true;
        }
    }
    return false;
}

export const Index: React.FC<IndexProps> = ({ schedule }) => {
    const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
    const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
    const [isMatrixFile, setIsMatrixFile] = useState(false);
    const [fileName, setFileName] = useState('');

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

        setFileName(file.name);

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

                // Deteksi format
                if (isMatrixFormat(rawData)) {
                    // Format matrix/cross-tab jadwal asisten
                    const result = parseMatrixSchedule(rawData);
                    if (result.rows.length === 0) {
                        alert('Gagal membaca jadwal dari format matrix. Pastikan file memiliki struktur baris HARI dan RUANG.');
                        return;
                    }
                    setIsMatrixFile(true);
                    setParsedHeaders(result.headers);
                    setParsedRows(result.rows);
                    console.log(`[Matrix Parse] Parsed ${result.rows.length} entries from ${file.name}`);
                } else {
                    // Format flat table biasa
                    setIsMatrixFile(false);
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
                    console.log(`[Flat Parse] Parsed ${rows.length} rows from ${file.name}`);
                }
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
            setIsMatrixFile(false);
            setFileName('');
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
                    {fileName && (
                        <p className="text-2xs text-indigo-400 font-bold mt-1">
                            File: {fileName} {isMatrixFile ? '(format matrix jadwal)' : '(format tabel)'}
                        </p>
                    )}
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
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
                                Preview Jadwal Asisten
                                {parsedRows.length > 0 && (
                                    <span className="ml-2 text-indigo-400 font-bold">
                                        ({parsedRows.length} entri)
                                    </span>
                                )}
                            </h2>
                            
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
