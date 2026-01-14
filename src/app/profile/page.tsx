'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Shield, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoggedIn, logout, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

    if (!isLoggedIn) {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <div className="p-8 flex items-center justify-between">
                <button onClick={() => router.back()} className="glass w-12 h-12 rounded-full flex items-center justify-center">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold font-outfit uppercase tracking-tighter">My Account</h1>
                <div className="w-12 h-12" /> {/* Spacer */}
            </div>

            <main className="px-6 space-y-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-[3rem] p-10 border border-primary/20 text-center relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <User size={120} />
                    </div>

                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                        <User size={48} className="text-primary" />
                    </div>

                    <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
                    <p className="text-xs opacity-40 font-inter mb-6">{user?.email}</p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Shield size={14} className="text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.tier} Member</span>
                    </div>
                </motion.div>

                {/* Settings List */}
                <div className="space-y-3">
                    <button className="w-full glass p-6 rounded-[2rem] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <CreditCard size={20} className="text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Membership & Billing</p>
                                <p className="text-[10px] opacity-40">Manage your subscription and tier</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="opacity-20" />
                    </button>

                    <button className="w-full glass p-6 rounded-[2rem] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Shield size={20} className="text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm">Security & Privacy</p>
                                <p className="text-[10px] opacity-40">Password and account security</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="opacity-20" />
                    </button>

                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="w-full bg-accent/10 border border-accent/20 p-6 rounded-[2rem] flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                                <LogOut size={20} className="text-accent" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-accent">Sign Out</p>
                                <p className="text-[10px] text-accent/60">Log out from this device</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Promotion Area */}
                <div className="glass p-8 rounded-[3rem] border-primary/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold gold-gradient-text mb-2">Upgrade to Special</h3>
                        <p className="text-xs opacity-50 mb-6 leading-relaxed">
                            특별 회원으로 업그레이드하여 전용 룸 예약 우선권과 최고급 전통주 페어링 혜택을 누리세요.
                        </p>
                        <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm">
                            Learn More
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
