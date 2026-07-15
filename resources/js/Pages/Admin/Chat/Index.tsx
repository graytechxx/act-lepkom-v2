import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import GlassAdminLayout from '@/Layouts/GlassAdminLayout';
import GlassCard from '@/Components/GlassCard';
import GlassInput from '@/Components/GlassInput';
import GlassButton from '@/Components/GlassButton';

interface User {
    id: number;
    name: string;
    role: string;
}

interface ChatMessage {
    id: number;
    user_id: number;
    message: string;
    created_at: string;
    user?: User;
}

interface ChatProps {
    messages: ChatMessage[];
    [key: string]: any;
}

export const Index: React.FC<ChatProps> = ({ messages: initialMessages }) => {
    const { auth } = usePage<any>().props;
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom on mount and whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Poll for new messages every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/chat/messages')
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data);
                })
                .catch(() => {});
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);

        fetch('/api/chat/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            body: JSON.stringify({ message: newMessage }),
        })
            .then((res) => res.json())
            .then((msg: ChatMessage) => {
                setNewMessage('');
                setSending(false);
                // Append the returned message
                setMessages(prev => [...prev.filter(m => m.id !== msg.id), msg]);
            })
            .catch(() => {
                setSending(false);
            });
    };

    return (
        <GlassAdminLayout>
            <Head title="Ruang Chat Asisten" />

            <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-12rem)]">
                <div>
                    <h1 className="text-xl font-black text-white">Ruang Obrolan Asisten</h1>
                    <p className="text-3xs sm:text-2xs font-extrabold uppercase text-slate-400 tracking-wider">
                        Komunikasi koordinasi jadwal pengajaran dan tugas lab Lepkom J5
                    </p>
                </div>

                {/* Chat Card Box */}
                <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 border-white/5 shadow-lg relative min-h-[300px]">
                    {/* Chat Messages Log Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-light">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                Belum ada obrolan dimulai. Ketik pesan Anda di bawah untuk menyapa asisten lain!
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.user_id === auth.user.id;
                                const initial = msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'A';

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-3 max-w-[85%] ${
                                            isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                        }`}
                                    >
                                        {/* Avatar bubble */}
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-2xs font-extrabold shrink-0 select-none ${
                                            isMe 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'bg-white/10 text-slate-200 border border-white/10'
                                        }`}>
                                            {initial}
                                        </div>

                                        {/* Speech Bubble */}
                                        <div className="space-y-1">
                                            {/* Uploader Name / Time */}
                                            <div className={`flex items-center gap-2 text-4xs font-bold uppercase tracking-wider ${
                                                isMe ? 'justify-end text-indigo-400' : 'text-slate-400'
                                            }`}>
                                                <span>{msg.user?.name || 'Anonim'}</span>
                                                <span className="text-5xs text-slate-500">
                                                    {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                                                isMe 
                                                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/5' 
                                                    : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                                            }`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Footer Form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-slate-950/20 flex gap-3 items-end shrink-0">
                        <textarea
                            rows={1}
                            placeholder="Ketikkan pesan koordinasi..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            className="grow bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 max-h-24 resize-none transition-all"
                        />
                        <GlassButton
                            type="submit"
                            variant="primary"
                            className="text-xs font-bold py-2.5 shrink-0 px-4"
                            disabled={!newMessage.trim() || sending}
                        >
                            Kirim
                        </GlassButton>
                    </form>
                </GlassCard>
            </div>
        </GlassAdminLayout>
    );
};

export default Index;
