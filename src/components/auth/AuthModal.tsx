'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login, signup } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Premium feel delay
        await new Promise(r => setTimeout(r, 1000));

        let success = false;
        if (isLoginView) {
            success = login(formData.email, formData.password);
            if (!success) setError('로그인에 실패했습니다. 정보를 확인해주세요.');
        } else {
            success = signup(formData.name, formData.email, formData.password);
            if (!success) setError('모든 항목을 올바르게 채워주세요.');
        }

        setLoading(false);
        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-card w-full max-w-md rounded-[3rem] p-10 border border-primary/20 relative z-30 shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
                            <X size={24} />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="text-primary" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold gold-gradient-text">
                                {isLoginView ? 'Welcome Back' : 'Get Started'}
                            </h2>
                            <p className="text-xs opacity-50 mt-2 font-inter">
                                {isLoginView ? '대장금 멤버십으로 더 큰 혜택을 누리세요.' : '특별한 미식 경험의 시작, 대장금 회원가입'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLoginView && (
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary transition-all text-sm"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40" size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary transition-all text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary transition-all text-sm"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}

                            <button
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (isLoginView ? '로그인' : '회원가입')}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsLoginView(!isLoginView)}
                                className="text-xs font-bold opacity-60 hover:text-primary transition-colors"
                            >
                                {isLoginView ? '아직 회원이 아니신가요? 가입하기' : '이미 계정이 있으신가요? 로그인'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
