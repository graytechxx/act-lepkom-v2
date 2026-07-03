import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import GlassPublicLayout from '@/Layouts/GlassPublicLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
    creator?: {
        name: string;
    };
}

interface Course {
    id: number;
    name: string;
    level_id: number;
}

interface Level {
    id: number;
    name: string;
    order: number;
    courses: Course[];
}

interface CalEvent {
    id: number;
    title: string;
    description: string;
    start: string;
    end?: string;
}

interface HomeProps {
    announcements: Announcement[];
    levels: Level[];
    upcomingEvents: CalEvent[];
}

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const Home: React.FC<HomeProps> = ({ announcements, levels, upcomingEvents }) => {
    const { flash } = usePage<any>().props;
    const [clientRoom, setClientRoom] = useState<string>('');

    // Pastebin search state
    const [pastebinCode, setPastebinCode] = useState('');
    const [searchError, setSearchError] = useState('');

    const handlePastebinSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pastebinCode.trim()) {
            setSearchError('Kode tidak boleh kosong');
            return;
        }
        setSearchError('');
        router.visit(`/p/${pastebinCode.trim()}`);
    };

    // Calendar state
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

    // Form setup using Inertia useForm
    const uploadForm = useForm({
        student_name: '',
        student_npm: '',
        level_id: '',
        course_id: '',
        file: null as File | null,
        room_name: '',
    });

    // Detect IP & physical lab room on mount
    useEffect(() => {
        fetch('/api/ip-mapping')
            .then(res => res.json())
            .then(data => {
                if (data.detected && data.room) {
                    setClientRoom(data.room);
                    uploadForm.setData('room_name', data.room);
                }
            })
            .catch(() => {});
    }, []);

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/public/upload', {
            onSuccess: () => {
                uploadForm.reset('file', 'student_name', 'student_npm');
            }
        });
    };

    // Calendar math helpers
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const prevMonth = () => {
        setCalendarDate(new Date(year, month - 1, 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        setCalendarDate(new Date(year, month + 1, 1));
        setSelectedDay(null);
    };

    // Get events for a specific day
    const getDayEvents = (dayVal: number) => {
        return upcomingEvents.filter(e => {
            const evDate = new Date(e.start);
            return evDate.getFullYear() === year &&
                   evDate.getMonth() === month &&
                   evDate.getDate() === dayVal;
        });
    };

    const selectedDayEvents = selectedDay ? getDayEvents(selectedDay) : [];

    const activeLevelObj = levels.find(l => l.id.toString() === uploadForm.data.level_id);
    const coursesOptions = activeLevelObj 
        ? activeLevelObj.courses.map(c => ({ value: c.id.toString(), label: c.name }))
        : [];

    return (
        <GlassPublicLayout>
            <Head title="Beranda" />

            <div className="space-y-12 animate-fade-in">
                {/* Hero Section */}
                <div className="text-center py-6 max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3 leading-tight">
                        Aktivitas & Tugas Praktikum <br />
                        <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                            Lepkom Gunadarma J5
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        Selamat datang di portal praktikan Lepkom J5. Unduh modul praktikum, kumpulkan laporan tugas ACT Anda secara langsung tanpa login, dan pantau jadwal terkini.
                    </p>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Middle Column: Announcements & Upload Form */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Announcements Section */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Pengumuman Terbaru
                            </h2>

                            {announcements.length === 0 ? (
                                <GlassCard light className="text-center py-12">
                                    <p className="text-slate-400 font-semibold text-xs">Tidak ada pengumuman untuk ditampilkan saat ini.</p>
                                </GlassCard>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map((item) => (
                                        <GlassCard light key={item.id} hoverable className="border-l-4 border-l-indigo-500 border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{item.title}</h3>
                                                <span className="text-3xs text-slate-400 font-bold uppercase shrink-0">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                                                {item.content}
                                            </p>
                                            {item.creator && (
                                                <div className="mt-4 flex items-center gap-1.5 text-3xs text-slate-400 font-bold uppercase tracking-wider">
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {item.creator.name}
                                                </div>
                                            )}
                                        </GlassCard>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Direct File Upload Panel (Moved here and structured in grid) */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Pengumpulan Berkas ACT
                            </h2>
                            <GlassCard light className="bg-gradient-to-tr from-white/90 to-slate-50/80 border border-white shadow-md relative overflow-hidden p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/50 pb-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm uppercase tracking-wide">Unggah Berkas Laporan Praktikum</h3>
                                        <p className="text-3xs text-slate-400 font-bold uppercase">Unggah langsung laporan tanpa login</p>
                                    </div>
                                </div>

                                {flash.success && (
                                    <div className="mb-6 text-3xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-center animate-pulse">
                                        {flash.success}
                                    </div>
                                )}

                                <form onSubmit={handleUploadSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <GlassInput
                                            light
                                            label="Nama Lengkap Praktikan"
                                            placeholder="Contoh: Budi Santoso"
                                            value={uploadForm.data.student_name}
                                            onChange={(e) => uploadForm.setData('student_name', e.target.value)}
                                            error={uploadForm.errors.student_name}
                                            className="py-2 text-xs"
                                        />

                                        <GlassInput
                                            light
                                            label="NPM Praktikan"
                                            placeholder="Contoh: 10121345"
                                            value={uploadForm.data.student_npm}
                                            onChange={(e) => uploadForm.setData('student_npm', e.target.value)}
                                            error={uploadForm.errors.student_npm}
                                            className="py-2 text-xs"
                                        />

                                        <GlassInput
                                            light
                                            label="Tingkat Praktikum"
                                            placeholder="-- Pilih Tingkat --"
                                            value={uploadForm.data.level_id}
                                            onChange={(e) => {
                                                uploadForm.setData(prev => ({
                                                    ...prev,
                                                    level_id: e.target.value,
                                                    course_id: ''
                                                }));
                                            }}
                                            options={levels.map(l => ({ value: l.id.toString(), label: l.name }))}
                                            error={uploadForm.errors.level_id}
                                            className="py-2 text-xs"
                                        />

                                        <GlassInput
                                            light
                                            label="Mata Praktikum"
                                            placeholder="-- Pilih Praktikum --"
                                            value={uploadForm.data.course_id}
                                            onChange={(e) => uploadForm.setData('course_id', e.target.value)}
                                            options={coursesOptions}
                                            disabled={!uploadForm.data.level_id}
                                            error={uploadForm.errors.course_id}
                                            className="py-2 text-xs"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-3xs font-extrabold uppercase tracking-widest text-slate-400">Lokasi Ruang Lab</label>
                                                <span className="text-3xs font-extrabold text-indigo-600 uppercase tracking-widest">
                                                    {clientRoom ? `Lab ${clientRoom}` : 'Remote / Luar Lab'}
                                                </span>
                                            </div>
                                            <GlassInput
                                                light
                                                placeholder="N/A"
                                                value={uploadForm.data.room_name || 'Remote'}
                                                disabled
                                                className="py-2 text-xs opacity-75 bg-slate-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-3xs font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Pilih Berkas ACT (Max 50MB)</label>
                                            <input
                                                type="file"
                                                onChange={(e) => uploadForm.setData('file', e.target.files?.[0] || null)}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-3xs file:font-bold file:bg-indigo-50 file:text-indigo-600 file:cursor-pointer hover:file:bg-indigo-100 transition-all"
                                            />
                                            {uploadForm.errors.file && (
                                                <p className="mt-1 text-3xs text-red-500 font-bold">{uploadForm.errors.file}</p>
                                            )}
                                        </div>
                                    </div>

                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-xs font-bold py-2.5 mt-4"
                                        disabled={uploadForm.processing}
                                        loading={uploadForm.processing}
                                    >
                                        Unggah Laporan ACT
                                    </GlassButton>
                                </form>
                            </GlassCard>
                        </div>
                    </div>

                    {/* Right Column: Interactive Calendar Grid on Top */}
                    <div className="space-y-8">
                        
                        {/* Search Pastebin Widget */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Cari Pastebin
                            </h3>

                            <GlassCard light className="p-5 border border-slate-100 shadow-sm bg-white/70">
                                <form onSubmit={handlePastebinSearchSubmit} className="space-y-3">
                                    <p className="text-3xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                        Masukkan kode unik pastebin untuk melihat source code yang dibagikan.
                                    </p>
                                    <GlassInput
                                        light
                                        placeholder="Contoh: pert-1"
                                        value={pastebinCode}
                                        onChange={(e) => {
                                            setPastebinCode(e.target.value);
                                            if (searchError) setSearchError('');
                                        }}
                                        error={searchError}
                                        className="py-2.5 text-xs mb-0"
                                    />
                                    <GlassButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full text-xs font-bold py-2.5 mt-2"
                                    >
                                        Buka Kode
                                    </GlassButton>
                                </form>
                            </GlassCard>
                        </div>

                        {/* Interactive Monthly Grid Calendar Widget */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <svg className="h-3.5 w-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Kalender Kegiatan
                            </h3>

                            <GlassCard light className="p-4 border border-slate-100 shadow-sm bg-white/70 space-y-4">
                                {/* Calendar Controls */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <button 
                                            onClick={prevMonth} 
                                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                                            {MONTHS[month]} {year}
                                        </span>
                                        <button 
                                            onClick={nextMonth} 
                                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Weekday Headers */}
                                    <div className="grid grid-cols-7 gap-1 text-center text-3xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                                        {WEEKDAYS.map(day => (
                                            <div key={day} className="py-1">{day}</div>
                                        ))}
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                        {/* Empty cells padding */}
                                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                                            <div key={`empty-${idx}`} className="py-1.5"></div>
                                        ))}

                                        {/* Actual days grid */}
                                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                                            const dayVal = idx + 1;
                                            const dayEvents = getDayEvents(dayVal);
                                            const hasEvents = dayEvents.length > 0;
                                            const isSelected = selectedDay === dayVal;

                                            return (
                                                <button
                                                    key={dayVal}
                                                    onClick={() => setSelectedDay(dayVal)}
                                                    className={`py-1.5 relative rounded-lg text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                                                        isSelected 
                                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25' 
                                                            : 'hover:bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    <span>{dayVal}</span>
                                                    {hasEvents && (
                                                        <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                                                            isSelected ? 'bg-white' : 'bg-indigo-500 animate-pulse'
                                                        }`} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Integrated Event details drawer inside the Calendar Card */}
                                <div className="border-t border-slate-200/50 pt-4">
                                    <h4 className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                                        <svg className="h-3 w-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Detail: {selectedDay ? `${selectedDay} ${MONTHS[month]}` : '--'}
                                    </h4>

                                    {selectedDayEvents.length === 0 ? (
                                        <p className="text-3xs text-slate-400 font-bold text-center py-2">
                                            {selectedDay ? 'Tidak ada agenda kegiatan terjadwal.' : 'Pilih tanggal di atas.'}
                                        </p>
                                    ) : (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            {selectedDayEvents.map((event) => (
                                                <div key={event.id} className="p-2.5 rounded-lg border border-slate-200/60 bg-white/40 space-y-1">
                                                    <h5 className="font-extrabold text-slate-800 text-3xs sm:text-2xs leading-snug">{event.title}</h5>
                                                    {event.description && (
                                                        <p className="text-4xs text-slate-500 leading-normal">{event.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-4xs text-slate-400 font-bold">
                                                        <svg className="h-2.5 w-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(event.start).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </div>

                    </div>
                </div>
            </div>
        </GlassPublicLayout>
    );
};

export default Home;
