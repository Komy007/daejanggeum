'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, LayoutDashboard, UtensilsCrossed } from 'lucide-react';

export default function AdminLoginPage() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'account' && pw === 'admin') {
            setIsLoggedIn(true);
            setError('');
            // 실제 세션 처리는 추후 고도화 (현재는 클라이언트 상태로 시뮬레이션)
            localStorage.setItem('admin_logged_in', 'true');
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 bg-[url('/images/brand/pattern.png')] bg-repeat opacity-95">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
                    <div className="text-center mb-16">
                        <img src="/images/brand/logo.png" alt="Logo" className="h-20 mx-auto mb-8" />
                        <h1 className="text-4xl font-black gold-gradient-text uppercase tracking-tighter mb-4">DAE JANG GEUM Portal</h1>
                        <p className="text-white/40">환영합니다 마스터님, 원하시는 메뉴를 선택해 주세요.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Option 1: Counter (POS) */}
                        <button
                            onClick={() => router.push('/pos/dashboard')}
                            className="glass group p-10 rounded-[3rem] border border-white/5 hover:border-primary/30 transition-all text-left relative overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <UtensilsCrossed className="text-primary" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Counter (POS)</h3>
                            <p className="text-sm opacity-40 mb-8">실시간 주문 및 결제 관리</p>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                                Go to Counter <ArrowRight size={16} />
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UtensilsCrossed size={160} />
                            </div>
                        </button>

                        {/* Option 2: Admin Dashboard */}
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="glass group p-10 rounded-[3rem] border border-white/5 hover:border-accent/30 transition-all text-left relative overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="text-accent" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
                            <p className="text-sm opacity-40 mb-8">매출 분석 및 매장 총괄 관리</p>
                            <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest">
                                Go to Dashboard <ArrowRight size={16} />
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <LayoutDashboard size={160} />
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <img src="/images/brand/logo.png" alt="Logo" className="h-24 mx-auto mb-10" />
                    <h1 className="text-3xl font-black gold-gradient-text uppercase tracking-tighter">Master Access</h1>
                    <p className="text-white/30 text-sm mt-2 font-inter">대장금 통합 관리 시스템 로그인이 필요합니다.</p>
                </div>

                <form onSubmit={handleLogin} className="glass p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 ml-2">
                            <User size={14} className="text-primary" />
                            <span className="text-[10px] items-center text-primary uppercase font-black tracking-widest">Admin ID</span>
                        </div>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="계정 아이디를 입력하세요"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-sm"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2 ml-2">
                            <Lock size={14} className="text-accent" />
                            <span className="text-[10px] items-center text-accent uppercase font-black tracking-widest">Password</span>
                        </div>
                        <input
                            type="password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium text-sm"
                        />
                    </div>

                    {error && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center font-bold">
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-5 rounded-[2rem] font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.2em]"
                    >
                        Sign In Now
                    </button>
                </form>

                <p className="text-center text-[10px] text-white/20 mt-12 uppercase tracking-[0.3em]">
                    DaeJangGeum Smart POS System v2.0
                </p>
            </motion.div>
        </div>
    );
}
