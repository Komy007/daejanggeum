'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, ReceiptText } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PaymentWaitPage() {
    const { t } = useTranslation();
    const { tableId } = useParams();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-12"
            >
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="relative z-10 w-48 h-48 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center"
                >
                    <ReceiptText size={64} className="text-primary" />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-2 -right-2 bg-accent p-2 rounded-full shadow-lg"
                >
                    <Loader2 size={24} className="text-white animate-spin" />
                </motion.div>
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4 font-outfit gold-gradient-text"
            >
                {t('order.payment_waiting')}
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm opacity-60 max-w-xs leading-relaxed"
            >
                Table {tableId}의 요청이 카운터에 전달되었습니다. 직원이 곧 방문하여 결제를 도와드리겠습니다.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-[10px] opacity-50"
            >
                <CheckCircle2 size={12} />
                Real-time POS Synchronization Active
            </motion.div>
        </div>
    );
}
