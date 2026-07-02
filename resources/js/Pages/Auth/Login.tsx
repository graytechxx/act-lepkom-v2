import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log In" />

            {status && (
                <div className="mb-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center animate-pulse">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <GlassInput
                    id="email"
                    type="text"
                    name="email"
                    label="ID Asisten (Username)"
                    placeholder="Contoh: AST001"
                    value={data.email}
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />

                <div>
                    <GlassInput
                        id="password"
                        type="password"
                        name="password"
                        label="Kata Sandi"
                        placeholder="••••••••"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center select-none cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-slate-900"
                        />
                        <span className="ms-2 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                            Ingat Saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-2xs font-bold text-slate-400 hover:text-indigo-400 transition"
                        >
                            Lupa Password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <GlassButton
                        type="submit"
                        variant="primary"
                        className="w-full text-xs font-bold py-3"
                        disabled={processing}
                    >
                        Masuk Ke Portal
                    </GlassButton>
                </div>
            </form>
        </GuestLayout>
    );
}
