import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ProfileProps {
    user: User;
}

export const Index: React.FC<ProfileProps> = ({ user }) => {
    // Form for profile details update
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    // Form for password update
    const passwordForm = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch('/profile');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.patch('/profile/password', {
            onSuccess: () => {
                passwordForm.reset();
            }
        });
    };

    return (
        <GlassAdminLayout>
            <Head title="Pengaturan Profil" />

            <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
                <div>
                    <h1 className="text-xl font-black text-white">Profil Pengguna</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">Perbarui informasi profil dan sandi akun Anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left Column: Profile Details */}
                    <GlassCard className="border-white/5 shadow-md">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informasi Profil
                        </h2>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <GlassInput
                                label="Nama Lengkap"
                                placeholder="Nama Anda"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                error={profileForm.errors.name}
                            />

                            <GlassInput
                                label="Alamat Email"
                                type="email"
                                placeholder="nama@email.com"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                error={profileForm.errors.email}
                            />

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-400">Hak Akses / Peran</label>
                                <div className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/3 text-slate-300 text-xs font-extrabold uppercase tracking-wide cursor-not-allowed">
                                    {user.role}
                                </div>
                            </div>

                            <div className="pt-2">
                                <GlassButton
                                    type="submit"
                                    variant="primary"
                                    className="w-full text-xs font-bold py-2.5"
                                    disabled={profileForm.processing}
                                >
                                    Simpan Perubahan
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>

                    {/* Right Column: Password Change */}
                    <GlassCard className="border-white/5 shadow-md">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Ubah Kata Sandi
                        </h2>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <GlassInput
                                label="Kata Sandi Sekarang"
                                type="password"
                                placeholder="••••••••"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                error={passwordForm.errors.current_password}
                            />

                            <GlassInput
                                label="Kata Sandi Baru"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={passwordForm.data.new_password}
                                onChange={(e) => passwordForm.setData('new_password', e.target.value)}
                                error={passwordForm.errors.new_password}
                            />

                            <GlassInput
                                label="Konfirmasi Kata Sandi Baru"
                                type="password"
                                placeholder="Ulangi kata sandi baru"
                                value={passwordForm.data.new_password_confirmation}
                                onChange={(e) => passwordForm.setData('new_password_confirmation', e.target.value)}
                                error={passwordForm.errors.new_password_confirmation}
                            />

                            <div className="pt-2">
                                <GlassButton
                                    type="submit"
                                    variant="primary"
                                    className="w-full text-xs font-bold py-2.5"
                                    disabled={passwordForm.processing}
                                >
                                    Ubah Kata Sandi
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>

                </div>
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
