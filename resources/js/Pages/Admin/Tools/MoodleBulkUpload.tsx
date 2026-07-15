import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassButton from '@/Components/GlassButton';

interface UserRow {
    username: string;
    password?: string;
    firstname: string;
    lastname: string;
    email: string;
}

export const MoodleBulkUpload: React.FC = () => {
    const getDefaultPrefix = () => {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();
        const year2 = String(year).slice(-2);
        
        // PTA is Odd Semester (Sept - Feb)
        // ATA is Even Semester (Mar - Aug)
        if (month >= 7 && month <= 12) {
            return `PTA${year2}`;
        } else if (month >= 1 && month <= 2) {
            const prevYear2 = String(year - 1).slice(-2);
            return `PTA${prevYear2}`;
        } else {
            const prevYear2 = String(year - 1).slice(-2);
            return `ATA${prevYear2}`;
        }
    };

    const [usernamePrefix, setUsernamePrefix] = useState(getDefaultPrefix());
    const [rows, setRows] = useState<UserRow[]>([
        { username: '', password: 'lepkomnewnormal', firstname: '', lastname: '', email: '' }
    ]);
    const [guideOpen, setGuideOpen] = useState(false);

    const handleInputChange = (index: number, field: keyof UserRow, value: string) => {
        const updated = [...rows];
        let val = value;
        if (field === 'username') {
            val = value.trim().replace(/^(PTA|ATA)\d+-/i, '');
        }
        updated[index] = {
            ...updated[index],
            [field]: val
        };
        
        // Auto-generate email based on username
        if (field === 'username') {
            const cleanUser = val.toLowerCase().replace(/\s+/g, '');
            const finalUsername = cleanUser ? `${usernamePrefix}-${cleanUser}` : '';
            updated[index].email = finalUsername ? `${finalUsername}@lepkom.com` : '';
        }
        
        setRows(updated);
    };

    const addRow = () => {
        setRows([...rows, { username: '', password: 'lepkomnewnormal', firstname: '', lastname: '', email: '' }]);
    };

    const deleteRow = (index: number) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index));
        } else {
            setRows([{ username: '', password: 'lepkomnewnormal', firstname: '', lastname: '', email: '' }]);
        }
    };

    // Filter rows and dynamically prepend prefix
    const previewRows = useMemo(() => {
        return rows
            .filter(r => r.username.trim() !== '' || r.firstname.trim() !== '')
            .map(row => {
                const cleanUser = row.username.trim().replace(/^(PTA|ATA)\d+-/i, '');
                const finalUsername = cleanUser ? `${usernamePrefix}-${cleanUser}` : '';
                return {
                    ...row,
                    username: finalUsername,
                    email: finalUsername ? `${finalUsername.toLowerCase()}@lepkom.com` : ''
                };
            });
    }, [rows, usernamePrefix]);

    const validationStatus = useMemo(() => {
        if (previewRows.length === 0) return { valid: false, message: 'Isi data user terlebih dahulu.' };

        let hasEmptyFields = false;

        for (const row of previewRows) {
            if (!row.username.trim() || !row.firstname.trim() || !row.lastname.trim() || !row.email.trim()) {
                hasEmptyFields = true;
                break;
            }
        }

        if (hasEmptyFields) {
            return { valid: false, warning: true, message: 'Masih ada kolom wajib (NPM/Username, Nama Depan, Nama Belakang, Email) yang kosong.' };
        }

        return { valid: true, message: `${previewRows.length} user siap diunduh!` };
    }, [previewRows]);

    const downloadCsv = () => {
        if (previewRows.length === 0) return;

        const headers = ['username', 'password', 'firstname', 'lastname', 'email'];
        const csvContent = [
            headers.join(','),
            ...previewRows.map(row => 
                headers.map(header => {
                    const val = (row as any)[header] || '';
                    return `"${val.replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users_moodle.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const pasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            
            const newRows: UserRow[] = lines.map(line => {
                const delimiter = line.includes('\t') ? '\t' : (line.includes(',') ? ',' : ';');
                const parts = line.split(delimiter).map(p => p.trim());
                const rawUsername = parts[0] || '';
                const username = rawUsername.replace(/^(PTA|ATA)\d+-/i, '');
                
                let firstname = '';
                let lastname = '';
                
                if (parts.length <= 3) {
                    firstname = parts[1] || '';
                    lastname = parts[2] || '';
                } else {
                    firstname = parts[2] || '';
                    lastname = parts[3] || '';
                }
                
                const cleanUser = username.toLowerCase().replace(/\s+/g, '');
                const finalUsername = cleanUser ? `${usernamePrefix}-${cleanUser}` : '';

                return {
                    username: username,
                    password: 'lepkomnewnormal',
                    firstname: firstname,
                    lastname: lastname,
                    email: finalUsername ? `${finalUsername}@lepkom.com` : '',
                };
            });

            if (newRows.length > 0) {
                if (rows.length === 1 && !rows[0].username && !rows[0].firstname) {
                    setRows(newRows);
                } else {
                    setRows([...rows, ...newRows]);
                }
            }
        } catch (err) {
            alert('Gagal membaca clipboard. Pastikan izin clipboard diaktifkan.');
        }
    };

    return (
        <GlassAdminLayout>
            <Head title="Moodle Bulk Account Upload" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white flex items-center gap-2">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Moodle Bulk User Upload
                        </h1>
                        <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                            Isi data user, nanti tinggal download CSV dan upload ke Moodle
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <GlassButton 
                            variant="secondary" 
                            onClick={pasteFromClipboard}
                            className="text-xs"
                            title="Format: username, password, firstname, lastname, email"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Paste dari Excel
                        </GlassButton>
                        <GlassButton 
                            variant="secondary" 
                            onClick={() => setGuideOpen(!guideOpen)}
                            className="text-xs"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {guideOpen ? 'Tutup Panduan' : 'Lihat Panduan'}
                        </GlassButton>
                    </div>
                </div>

                {/* Configuration Panel */}
                <GlassCard className="border-white/5 shadow-md p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <label className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Prefix Username (Periode):</label>
                        <input
                            type="text"
                            value={usernamePrefix}
                            onChange={(e) => setUsernamePrefix(e.target.value.trim().toUpperCase())}
                            className="w-28 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950/40 text-indigo-300 font-bold text-center text-xs focus:outline-none focus:border-indigo-500/50"
                            placeholder="PTA26"
                        />
                        <span className="text-4xs text-slate-500 font-bold italic">(Otomatis dideteksi berdasarkan waktu server)</span>
                    </div>
                </GlassCard>

                {/* Guide Panel */}
                {guideOpen && (
                    <GlassCard className="border-indigo-500/20 bg-indigo-500/5 animate-fade-in">
                        <h3 className="text-xs font-black uppercase text-indigo-300 mb-3 flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Panduan Cara Upload ke Moodle
                        </h3>
                        <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2.5 font-medium leading-relaxed">
                            <li>Klik tombol <strong className="text-indigo-400">Download CSV</strong> setelah mengisi data di bawah.</li>
                            <li>Login ke Moodle Anda sebagai <strong className="text-white">Admin</strong>.</li>
                            <li>Buka menu <strong className="text-white">Site administration → Users → Accounts → Upload users</strong>.</li>
                            <li>Pilih file CSV yang baru saja diunduh.</li>
                            <li>Atur bagian <strong className="text-white">New user password</strong> menjadi <span className="text-indigo-300 font-bold">"Field required in file"</span>.</li>
                            <li>Klik <strong className="text-indigo-400">Upload users</strong> untuk memproses akun!</li>
                        </ol>
                    </GlassCard>
                )}

                {/* Form Input Table */}
                <GlassCard className="border-white/5 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Daftar User
                        </h3>
                        <span className="text-3xs font-extrabold uppercase bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded-lg">
                            {rows.length} Baris
                        </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/1">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                    <th className="py-3 px-4 w-12 text-center">No</th>
                                    <th className="py-3 px-4">NPM/Username*</th>
                                    <th className="py-3 px-4">Password</th>
                                    <th className="py-3 px-4">Nama Depan*</th>
                                    <th className="py-3 px-4">Nama Belakang*</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4 w-16 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/2 transition duration-150">
                                        <td className="py-2.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                                        <td className="py-2 px-3">
                                            <div className="flex items-center w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950/20 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all duration-200">
                                                <span className="text-slate-500 font-bold pr-1 select-none">{usernamePrefix}-</span>
                                                <input
                                                    type="text"
                                                    value={row.username.replace(/^(PTA|ATA)\d+-/i, '')}
                                                    onChange={(e) => handleInputChange(idx, 'username', e.target.value)}
                                                    className="grow bg-transparent text-slate-200 text-xs focus:outline-none"
                                                    placeholder="NPM"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-2 px-3">
                                            <input
                                                type="text"
                                                value={row.password}
                                                disabled
                                                className="w-full px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 text-xs cursor-not-allowed outline-none select-none"
                                                placeholder="lepkomnewnormal"
                                            />
                                        </td>
                                        <td className="py-2 px-3">
                                            <input
                                                type="text"
                                                value={row.firstname}
                                                onChange={(e) => handleInputChange(idx, 'firstname', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 bg-slate-950/20 text-slate-200 text-xs focus:outline-none transition-all duration-200"
                                                placeholder="Nama Depan"
                                            />
                                        </td>
                                        <td className="py-2 px-3">
                                            <input
                                                type="text"
                                                value={row.lastname}
                                                onChange={(e) => handleInputChange(idx, 'lastname', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 bg-slate-950/20 text-slate-200 text-xs focus:outline-none transition-all duration-200"
                                                placeholder="Nama Belakang"
                                            />
                                        </td>
                                        <td className="py-2 px-3">
                                            <input
                                                type="email"
                                                value={row.username ? `${usernamePrefix}-${row.username.toLowerCase()}@lepkom.com` : ''}
                                                disabled
                                                className="w-full px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 text-xs cursor-not-allowed outline-none select-none"
                                                placeholder="username@lepkom.com"
                                            />
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => deleteRow(idx)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center mx-auto"
                                                title="Hapus baris"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <GlassButton 
                            variant="secondary" 
                            onClick={addRow}
                            className="text-xs py-2 px-4"
                        >
                            <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Baris
                        </GlassButton>
                        <p className="text-4xs text-slate-500 font-extrabold uppercase tracking-wider">* Kolom bertanda wajib diisi untuk Moodle</p>
                    </div>
                </GlassCard>

                {/* Validation Status & Action */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex-1 p-4 rounded-xl border bg-white/2 border-white/5 flex items-center">
                        <span className={`text-xs font-semibold flex items-center gap-2 ${validationStatus.warning ? 'text-amber-400' : validationStatus.valid ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {validationStatus.warning && (
                                <svg className="h-4 w-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            {validationStatus.valid && (
                                <svg className="h-4 w-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {validationStatus.message}
                        </span>
                    </div>

                    {previewRows.length > 0 && (
                        <GlassButton
                            onClick={downloadCsv}
                            className="text-xs font-black uppercase py-3.5 tracking-wider px-8"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download CSV
                        </GlassButton>
                    )}
                </div>

                {/* Preview Panel */}
                {previewRows.length > 0 && (
                    <GlassCard className="border-white/5 shadow-md">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview Data ({previewRows.length} User)
                        </h3>
                        
                        <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/10 max-h-[300px]">
                            <table className="w-full text-left border-collapse text-2xs text-slate-300 font-medium">
                                <thead>
                                    <tr className="bg-white/3 border-b border-white/10 text-slate-400 uppercase font-extrabold tracking-widest text-3xs">
                                        <th className="py-2 px-3">Username</th>
                                        <th className="py-2 px-3">Password</th>
                                        <th className="py-2 px-3">Firstname</th>
                                        <th className="py-2 px-3">Lastname</th>
                                        <th className="py-2 px-3">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {previewRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/1">
                                            <td className="py-2 px-3 font-bold text-indigo-300">{row.username}</td>
                                            <td className="py-2 px-3 text-slate-400">{row.password || '-'}</td>
                                            <td className="py-2 px-3 text-slate-200">{row.firstname}</td>
                                            <td className="py-2 px-3 text-slate-200">{row.lastname}</td>
                                            <td className="py-2 px-3 text-slate-300">{row.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                )}
            </div>
        </GlassAdminLayout>
    );
};

export default MoodleBulkUpload;
