'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Printer, CheckCircle, Clock, AlertCircle, Utensils } from 'lucide-react';
import { PaymentRequest, printBillAtCounter } from '@/lib/notifications';

export default function PosDashboard() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [lastNotification, setLastNotification] = useState<string | null>(null);

    const loadRequests = async () => {
        try {
            const res = await fetch('/api/pos/requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to load POS requests:', error);
        }
    };

    useEffect(() => {
        loadRequests();
        const interval = setInterval(loadRequests, 2000); // 2s polling
        return () => clearInterval(interval);
    }, []);

    const handlePrint = async (tableId: string) => {
        const success = await printBillAtCounter(tableId);
        if (success) {
            setLastNotification(`Table ${tableId}의 계산서를 출력했습니다.`);
            setTimeout(() => setLastNotification(null), 3000);
            loadRequests();
        }
    };

    const handleComplete = async (tableId: string) => {
        const request = requests.find(r => r.tableId === tableId);
        if (request && request.totalAmount) {
            try {
                // Get current stats from server
                const statsRes = await fetch('/api/admin/stats');
                const stats = await statsRes.json();

                // Update revenue and order count
                await fetch('/api/admin/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        total_revenue: stats.total_revenue + request.totalAmount,
                        order_count: stats.order_count + 1
                    })
                });
            } catch (e) {
                console.error('Failed to update admin stats:', e);
            }
        }

        // POS 목록에서 제거 (API를 통해)
        const fresh = requests.filter(r => r.tableId !== tableId);
        try {
            await fetch('/api/pos/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fresh)
            });
        } catch (e) {
            console.error('Failed to update POS requests:', e);
        }

        // 테이블 상태 완전 초기화 (API를 통해 서버 상태 초기화)
        try {
            await fetch(`/api/table/${tableId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: [], staffCalled: false, orderSubmitted: false, isPaying: false })
            });
        } catch (e) {
            console.error('Failed to reset table state:', e);
        }

        loadRequests();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                    <img src="/images/brand/logo.png" alt="Logo" className="h-16 w-auto" />
                    <div className="h-12 w-[1px] bg-white/10" />
                    <div>
                        <h1 className="text-2xl font-bold font-outfit gold-gradient-text tracking-tight uppercase">
                            Counter Dashboard <span className="text-platinum/40 font-light ml-2">| 카운터 관리</span>
                        </h1>
                        <p className="text-white/40 text-xs mt-1">DaeJangGeum Smart Hospitality Management • 스마트 매장 관리 시스템</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => window.location.href = '/admin/dashboard'} className="glass-dark px-6 py-2 rounded-full text-xs font-bold text-primary border-primary/30 hover:bg-primary/10 transition-all">
                        Go to Admin (관리자)
                    </button>
                    <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        System Live
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {requests.map((request) => (
                        <motion.div
                            key={request.tableId}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`glass rounded-3xl p-6 border-l-4 overflow-hidden relative ${request.status === 'pending' ? 'border-l-accent' : 'border-l-primary'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold font-outfit">Table {request.tableId}</h3>
                                    <p className="text-xs opacity-40 flex items-center gap-1 mt-1">
                                        <Clock size={12} /> {new Date(request.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                                {request.status === 'pending' && (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="p-2 bg-accent/20 text-accent rounded-full"
                                    >
                                        <Bell size={20} />
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Order Details Preview */}
                                {request.items && request.items.length > 0 && (
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                        <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Order Details</p>
                                        <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-2">
                                            {request.items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-xs">
                                                    <span className="opacity-70">{item.name} x{item.quantity}</span>
                                                    <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] font-bold opacity-30">TOTAL</span>
                                            <span className="text-primary font-black">${request.totalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-xs opacity-50 mb-1">Status</p>
                                    <p className="text-sm font-medium">
                                        {request.status === 'pending' ? '결제 요청됨 (대기 중)' : '계산서 출력됨 (처리 중)'}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    {request.status === 'pending' ? (
                                        <button
                                            onClick={() => handlePrint(request.tableId)}
                                            className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
                                        >
                                            <Printer size={18} /> 계산서 출력
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleComplete(request.tableId)}
                                            className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all"
                                        >
                                            <CheckCircle size={18} /> 결제 완료
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {requests.length === 0 && (
                    <div className="col-span-full py-24 flex flex-col items-center opacity-20">
                        <Utensils size={64} className="mb-4" />
                        <p className="text-lg">대기 중인 요청이 없습니다.</p>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {lastNotification && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 glass border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 text-sm font-medium z-50 shadow-2xl"
                    >
                        <AlertCircle size={18} className="text-primary" />
                        {lastNotification}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
