'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    Settings,
    ShoppingBag,
    ArrowUpRight,
    BarChart3,
    Bell,
    ChevronRight,
    Search
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: '오늘 총 매출', value: '$4,250', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: '신규 회원', value: '12명', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: '주문 건수', value: '84건', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: '서빙 만족도', value: '98%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(prev => prev.map(s => {
                        if (s.label === '오늘 총 매출') return { ...s, value: `$${data.total_revenue.toLocaleString()}` };
                        if (s.label === '신규 회원') return { ...s, value: `${data.new_members}명` };
                        if (s.label === '주문 건수') return { ...s, value: `${data.order_count}건` };
                        if (s.label === '서빙 만족도') return { ...s, value: `${data.satisfaction}%` };
                        return s;
                    }));
                }
            } catch (e) {
                console.error('Failed to fetch stats:', e);
            }
        };

        loadStats();
        const interval = setInterval(loadStats, 3000); // 3s polling
        return () => clearInterval(interval);
    }, []);

    const alerts = [
        { time: '방금 전', message: '테이블 4번: 결제 요청이 승인되었습니다.', type: 'payment' },
        { time: '10분 전', message: '새로운 VIP 회원이 가입했습니다: 김*수님', type: 'member' },
        { time: '30분 전', message: '주방 재고 부족 알림: 갈비찜 (남은 수량 5)', type: 'stock' },
    ];

    return (
        <div className="min-h-screen bg-[#080808] text-platinum font-sans">
            {/* Navigation Sidebar (Mini) */}
            <aside className="fixed left-0 top-0 bottom-0 w-24 border-r border-white/5 flex flex-col items-center py-12 gap-10 z-50 bg-black/60 backdrop-blur-3xl">
                <div className="px-4">
                    <img src="/images/brand/logo.png" alt="Logo" className="w-full h-auto mb-6 scale-125" />
                </div>
                <div className="h-[1px] w-12 bg-white/10" />
                <button className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-lg ring-4 ring-primary/20 hover:scale-105 transition-all">
                    <BarChart3 size={24} />
                </button>
                <button className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <Users size={24} className="opacity-40" />
                </button>
                <button className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <ShoppingBag size={24} className="opacity-40" />
                </button>
                <button className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <Settings size={24} className="opacity-40" />
                </button>
            </aside>

            {/* Main Content */}
            <main className="pl-28 pr-12 py-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold gold-gradient-text font-outfit uppercase">Admin Panel</h1>
                        <p className="text-white/40 text-sm mt-1">대장금 통합 관리 서비스 (관리자용)</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
                            <input
                                type="text"
                                placeholder="회원 또는 주문 검색..."
                                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 outline-none focus:border-primary/50 transition-all text-sm w-64"
                            />
                        </div>
                        <button className="relative p-2.5 glass-dark rounded-full border-primary/20">
                            <Bell size={20} className="text-primary" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#080808]" />
                        </button>
                        <div className="flex items-center gap-3 glass px-4 py-2 rounded-full border-white/10">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                                <span className="text-xs font-bold text-primary">A</span>
                            </div>
                            <span className="text-sm font-bold">마스터 관리자</span>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card glass p-6 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all"
                        >
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 shadow-sm`}>
                                <stat.icon size={28} />
                            </div>
                            <p className="text-xs font-bold opacity-30 mb-2 font-inter uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-bold mb-1 font-outfit">{stat.value}</h3>
                            <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                                <ArrowUpRight size={14} /> 12% 상승
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Activity Log */}
                    <div className="col-span-8 space-y-8">
                        <section className="bg-card glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xl font-bold platinum-text">주요 활동 로그</h3>
                                <button className="text-xs font-bold text-primary underline">전체 보기</button>
                            </div>
                            <div className="space-y-6">
                                {alerts.map((alert, idx) => (
                                    <div key={idx} className="flex items-start gap-6 p-5 hover:bg-white/5 rounded-3xl transition-colors border border-transparent hover:border-white/5 group">
                                        <div className="w-1.5 h-12 bg-primary rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1">
                                            <p className="text-platinum text-sm leading-relaxed mb-1">{alert.message}</p>
                                            <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{alert.time}</span>
                                        </div>
                                        <ChevronRight size={18} className="opacity-10 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Quick Settings */}
                    <div className="col-span-4 space-y-6">
                        <section className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10 relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold gold-gradient-text mb-4">매장 설정 도우미</h3>
                                <p className="text-sm opacity-50 mb-8 leading-relaxed">
                                    현재 실시간 주문이 활성화되어 있습니다. 메뉴 재고 현황을 실시간으로 동기화하시겠습니까?
                                </p>
                                <button className="w-full bg-primary text-primary-foreground py-4 rounded-3xl font-bold text-sm shadow-xl active:scale-95 transition-all mb-4">
                                    설정 최적화 진행
                                </button>
                                <button className="w-full glass-dark py-4 rounded-3xl font-bold text-sm opacity-40">
                                    나중에 하기
                                </button>
                            </div>
                            <BarChart3 size={120} className="absolute -bottom-10 -right-10 opacity-5 -rotate-12" />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
