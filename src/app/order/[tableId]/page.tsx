'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Utensils, Info, MapPin, Wifi, Star, X, Bell, User, DollarSign } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, STORE_INFO } from '@/lib/constants';
import { validateGeofencing } from '@/lib/security';
import { triggerPosNotification } from '@/lib/notifications';
import { useTableSync } from '@/hooks/useTableSync';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

export default function OrderPage() {
    const { tableId } = useParams();
    const router = useRouter();
    const { t, i18n } = useTranslation();

    // SaaS 실시간 동기화 훅 사용
    const {
        cart,
        updateCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        staffCalled,
        callStaff,
        cancelStaffCall,
        orderSubmitted,
        markOrderAsSubmitted,
        isPaying,
        requestPayment,
        resetTable
    } = useTableSync(tableId as string);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isOutOfRange, setIsOutOfRange] = useState(false);
    const [showUpsell, setShowUpsell] = useState(false);
    const [showCRM, setShowCRM] = useState(false);
    const [showCartDetail, setShowCartDetail] = useState(false);
    const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedItemForDetail, setSelectedItemForDetail] = useState<any>(null);

    const {
        user,
        isLoggedIn,
        loading: authLoading,
        updateTier
    } = useAuth();

    const languages = [
        { code: 'ko', name: '한국어', flag: '🇰🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    ];

    useEffect(() => {
        const checkSecurity = async () => {
            const isValid = await validateGeofencing();
            if (!isValid) console.warn('Geofencing validation failed');
        };
        checkSecurity();

        // CRM 환영 메시지 시뮬레이션 (보류)
        // const isReturning = localStorage.getItem('is_member') === 'true';
        // if (isReturning) {
        //     setTimeout(() => setShowCRM(true), 1500);
        // }

        // 추천 메뉴 팝업 일시 중지
        // const timer = setTimeout(() => setShowUpsell(true), 30000);
        // return () => clearTimeout(timer);
    }, []);

    const addToCart = (item: any) => {
        if (orderSubmitted) return;
        const existing = cart.find(c => c.id === item.id);
        if (existing) {
            updateCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            updateCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const getItemQuantity = (itemId: string) => {
        return cart.find(c => c.id === itemId)?.quantity || 0;
    };

    const handleSubmitOrder = () => {
        markOrderAsSubmitted();
        setShowOrderReviewModal(false);
        setShowCartDetail(false);
    };

    const handleRequestPayment = () => {
        requestPayment();
        triggerPosNotification(tableId as string);
        setShowPaymentConfirmModal(false);
    };

    const filteredItems = selectedCategory === 'all'
        ? MENU_ITEMS
        : MENU_ITEMS.filter(item => item.category === selectedCategory);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            {/* Header */}
            <header className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 z-10" />
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-black/30 z-10" />
                <div className="relative z-20 h-full flex flex-col justify-start p-4 pt-12">
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                        <div className="mb-2 relative w-full max-w-[340px]">
                            <img
                                src="/images/brand/logo.png"
                                alt="DaeJangGeum Logo"
                                className="w-full h-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-8 right-8 z-30 flex gap-2">
                    <button onClick={() => setShowLanguageModal(true)} className="glass w-12 h-12 rounded-full flex flex-col items-center justify-center text-[10px] font-bold">
                        <span className="text-lg">{languages.find(l => l.code === i18n.language)?.flag}</span>
                        <span className="opacity-60">{i18n.language.toUpperCase()}</span>
                    </button>
                    <button
                        onClick={() => isLoggedIn ? router.push('/profile') : setShowAuthModal(true)}
                        className={`glass px-4 h-12 rounded-full flex items-center gap-2 transition-all ${isLoggedIn ? 'border-primary/40 bg-primary/10' : ''}`}
                    >
                        <User size={18} className={isLoggedIn ? "text-primary fill-primary/20" : "text-primary"} />
                        {isLoggedIn && (
                            <span className="text-[10px] font-black platinum-text uppercase tracking-tight">
                                {user?.tier}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Language Modal */}
            <AnimatePresence>
                {showLanguageModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <div className="bg-card w-full max-w-sm rounded-[3rem] p-8 border border-primary/20">
                            <h2 className="text-2xl font-bold mb-8 text-center gold-gradient-text">Choose Language</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { i18n.changeLanguage(lang.code); setShowLanguageModal(false); }}
                                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${i18n.language === lang.code ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-3xl">{lang.flag}</span>
                                        <span className="text-xs font-bold">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Bar: 4 Equal Columns */}
            <div className="px-6 -mt-6 relative z-30 grid grid-cols-4 gap-2">
                <button
                    onClick={() => staffCalled ? cancelStaffCall() : callStaff()}
                    className={`py-6 rounded-3xl font-black flex flex-col items-center justify-center transition-all shadow-xl group ${staffCalled ? 'bg-accent text-white ring-4 ring-accent/30' : 'glass border-primary/20 bg-background/40 text-platinum hover:bg-primary/10'
                        }`}
                >
                    <Bell size={20} className={staffCalled ? 'animate-bounce' : 'text-primary group-hover:scale-110 transition-transform'} />
                    <span className="text-[9px] mt-2 font-black uppercase tracking-tighter">
                        {staffCalled ? t('order_status.cancel_call') : t('order_status.staff_call')}
                    </span>
                </button>

                <button
                    disabled
                    className="glass border-white/5 bg-background/20 py-6 rounded-3xl font-black flex flex-col items-center justify-center text-platinum/20 shadow-xl cursor-not-allowed group"
                >
                    <Info size={20} className="text-platinum/10" />
                    <span className="text-[9px] mt-2 font-black uppercase tracking-tighter opacity-40">{t('order.recommendation')}</span>
                </button>

                {/* Primary Action Button - Equal Size */}
                <button
                    onClick={() => {
                        if (isPaying) return;
                        if (orderSubmitted) setShowPaymentConfirmModal(true);
                        else if (cartCount > 0) setShowOrderReviewModal(true);
                        else alert('장바구니가 비어있습니다.');
                    }}
                    disabled={(!orderSubmitted && cartCount === 0) || isPaying}
                    className={`py-6 rounded-3xl font-black flex flex-col items-center justify-center transition-all shadow-2xl relative overflow-hidden group disabled:opacity-50 ${isPaying
                        ? 'bg-secondary text-platinum/40 cursor-not-allowed'
                        : 'bg-primary text-primary-foreground shadow-primary/30'
                        }`}
                >
                    {isPaying ? (
                        <div className="w-5 h-5 border-2 border-platinum/20 border-t-platinum rounded-full animate-spin" />
                    ) : orderSubmitted ? (
                        <DollarSign size={20} className="group-hover:scale-110 transition-transform" />
                    ) : (
                        <Utensils size={20} className="group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-[9px] mt-2 font-black uppercase tracking-tighter">
                        {isPaying
                            ? t('order_status.bill_coming')
                            : orderSubmitted
                                ? t('order_status.request_payment')
                                : t('order_status.order_and_send')
                        }
                    </span>
                </button>

                <button
                    onClick={() => setShowCartDetail(true)}
                    className="glass border-primary/20 bg-background/40 py-6 rounded-3xl font-black flex flex-col items-center justify-center text-platinum shadow-xl hover:bg-primary/10 transition-all group"
                >
                    <div className="relative">
                        <ShoppingCart size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[9px] mt-2 font-black uppercase tracking-tighter">{t('order.cart')}</span>
                </button>
            </div>

            <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/5 flex overflow-x-auto px-6 py-4 scrollbar-hide my-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex-shrink-0 mr-2 ${selectedCategory === cat.id
                            ? 'bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(192,160,96,0.3)]'
                            : 'text-foreground/40 hover:text-foreground/80'
                            }`}
                    >
                        {(cat as any)[`name${i18n.language.toUpperCase()}`] || (cat as any).nameEN}
                    </button>
                ))}
            </nav>

            <main className="p-6 pb-[calc(8rem+env(safe-area-inset-bottom))]">
                {orderSubmitted && (
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-[10px] text-center text-primary font-bold">
                        {t('order_status.cannot_cancel')}
                    </div>
                )}
                <AnimatePresence mode="popLayout">
                    {MENU_ITEMS.filter(i => selectedCategory === 'all' || i.category === selectedCategory).map((item: any) => {
                        const qty = getItemQuantity(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => setSelectedItemForDetail(item)}
                                className="bg-card rounded-[2rem] p-5 border border-white/5 shadow-2xl flex items-center gap-5 group cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary shadow-inner relative">
                                    <img src={item.image} alt={item.names.ko} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {item.popular && <div className="absolute top-1 right-1 bg-accent p-1 rounded-lg"><Star size={10} className="text-white fill-white" /></div>}
                                </div>
                                <div className="flex-1 flex flex-col justify-between h-24">
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight mb-1">{item.names[i18n.language] || item.names['en']}</h3>
                                        <p className="text-[10px] opacity-40 italic line-clamp-2">{item.descriptions[i18n.language] || item.descriptions['en']}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary font-bold font-outfit">${(item.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                                        {!orderSubmitted && (
                                            <div className="flex items-center gap-2">
                                                {qty > 0 && (
                                                    <button onClick={(e) => { e.stopPropagation(); decreaseQuantity(item.id); }} className="w-8 h-8 rounded-lg bg-card border border-white/10 flex items-center justify-center text-primary font-bold active:scale-95 transition-all">
                                                        -
                                                    </button>
                                                )}
                                                {qty > 0 && <span className="text-xs font-bold w-4 text-center">{qty}</span>}
                                                <button onClick={() => addToCart(item)} className="bg-primary/20 text-primary p-2 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-90">
                                                    <Utensils size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </main>

            {/* Minimal Mobile Cart Summary - Floating */}
            <AnimatePresence>
                {cartCount > 0 && !orderSubmitted && (
                    <div className="fixed mb-[env(safe-area-inset-bottom)] bottom-6 right-6 z-50 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => setShowCartDetail(true)}
                            className="glass-dark border-primary/30 bg-black/80 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto shadow-2xl active:scale-90 transition-all group"
                        >
                            <div className="relative">
                                <ShoppingCart size={24} className="text-primary group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-3 -right-3 bg-accent text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black ring-2 ring-black">
                                    {cartCount}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Cart Detail Modal */}
            <AnimatePresence>
                {showCartDetail && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col justify-end"
                    >
                        <div className="bg-card w-full max-h-[80vh] rounded-t-[3rem] p-8 overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-bold font-outfit uppercase tracking-tighter">{t('order_status.your_order')}</h2>
                                <button onClick={() => setShowCartDetail(false)} className="glass w-12 h-12 rounded-full flex items-center justify-center">
                                    <X />
                                </button>
                            </div>

                            <div className="space-y-6 mb-12">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-[2rem] border border-white/5 group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-tight mb-1">{item.names[i18n.language] || item.names['en']}</p>
                                                <p className="text-[10px] text-primary font-outfit">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {!orderSubmitted ? (
                                                <div className="flex items-center gap-3 bg-background border border-white/10 p-1.5 rounded-2xl shadow-inner">
                                                    <button onClick={() => decreaseQuantity(item.id)} className="w-9 h-9 rounded-xl bg-secondary hover:bg-white/10 flex items-center justify-center transition-colors active:scale-90">-</button>
                                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95">+</button>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 rounded-[1.2rem] bg-primary/10 border border-primary/20">
                                                    <p className="font-bold text-primary text-[10px]">{item.quantity}개 ({t('order_status.cooking')})</p>
                                                </div>
                                            )}
                                            {!orderSubmitted && (
                                                <button onClick={() => removeFromCart(item.id)} className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4">
                                {!orderSubmitted ? (
                                    <>
                                        <button onClick={() => setShowCartDetail(false)} className="w-full bg-secondary text-foreground py-4 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all active:scale-95">
                                            메뉴로 돌아가기
                                        </button>
                                        <button onClick={() => { if (confirm(t('order_status.empty_cart') + '?')) clearCart(); }} className="text-[10px] opacity-40 uppercase tracking-widest font-bold text-center">{t('order_status.empty_cart')}</button>
                                    </>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary animate-pulse">
                                            <p className="text-sm font-bold">{t('order_status.sent_success')}</p>
                                        </div>
                                        <button onClick={handleRequestPayment} className="w-full bg-accent text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all active:scale-95">
                                            {t('order_status.request_payment')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upsell Popup (Disabled for now) */}
            {/* <AnimatePresence>
                {showUpsell && (
                    ...
                )}
            </AnimatePresence> */}

            {/* 2-Step Order Review Modal */}
            <AnimatePresence>
                {showOrderReviewModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="bg-card w-full max-w-sm rounded-[3rem] p-8 border border-primary/30 shadow-2xl overflow-hidden relative">
                            <h2 className="text-2xl font-bold mb-6 platinum-text text-center">{t('order_status.review_order')}</h2>
                            <div className="max-h-60 overflow-y-auto space-y-3 mb-8 pr-2 scrollbar-hide">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="platinum-text opacity-70">{item.names[i18n.language] || item.names['en']}</span>
                                        <span className="text-primary font-bold">x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-4 mb-8">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs opacity-50 uppercase tracking-widest font-bold">{t('order_status.total_bill')}</span>
                                    <span className="text-xl font-bold text-primary font-outfit">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleSubmitOrder} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all">
                                    {t('order_status.confirm_order')}
                                </button>
                                <button onClick={() => setShowOrderReviewModal(false)} className="w-full bg-white/5 py-4 rounded-2xl font-bold text-sm platinum-text opacity-40">
                                    {t('common.error') === 'Error' ? 'Back' : '돌아가기'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Confirmation Modal */}
            <AnimatePresence>
                {showPaymentConfirmModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8"
                    >
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-card w-full max-w-sm rounded-[3rem] p-10 text-center border border-accent/40 shadow-2xl">
                            <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <DollarSign size={40} className="text-accent" />
                            </div>
                            <h2 className="text-xl font-bold mb-4 platinum-text leading-tight">{t('order_status.finish_meal_q')}</h2>
                            <p className="text-sm opacity-50 mb-10 leading-relaxed font-inter">
                                {t('order_status.payment_processing')}
                            </p>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleRequestPayment} className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
                                    {t('order_status.request_payment')}
                                </button>
                                <button onClick={() => setShowPaymentConfirmModal(false)} className="text-xs opacity-30 underline">아니오, 좀 더 머물게요</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Item Detail Modal */}
            <AnimatePresence>
                {selectedItemForDetail && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-end sm:justify-center p-0 sm:p-6"
                    >
                        {/* Desktop: Close button on top right */}
                        <button onClick={() => setSelectedItemForDetail(null)} className="hidden sm:flex absolute top-10 right-10 text-white opacity-40 hover:opacity-100 transition-opacity">
                            <X size={40} />
                        </button>

                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-card w-full max-w-2xl h-[90vh] sm:h-auto sm:rounded-[4rem] overflow-hidden flex flex-col relative"
                        >
                            {/* Mobile: Close button on top right of image */}
                            <button onClick={() => setSelectedItemForDetail(null)} className="sm:hidden absolute top-6 right-6 z-20 glass w-10 h-10 rounded-full flex items-center justify-center">
                                <X size={20} />
                            </button>

                            <div className="h-2/5 sm:h-80 w-full overflow-hidden relative">
                                <img src={selectedItemForDetail.image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                            </div>

                            <div className="flex-1 p-8 sm:p-12 -mt-10 relative z-10 bg-card rounded-t-[3rem] sm:rounded-none flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl sm:text-4xl font-bold mb-2 gold-gradient-text leading-tight">
                                            {selectedItemForDetail.names[i18n.language] || selectedItemForDetail.names['ko']}
                                        </h2>
                                        <p className="text-sm opacity-60 italic">{selectedItemForDetail.names.en}</p>
                                    </div>
                                    <span className="text-2xl font-bold font-outfit text-primary">
                                        ${selectedItemForDetail.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto mb-6 pr-2">
                                    <p className="text-lg leading-relaxed opacity-80 whitespace-pre-wrap">
                                        {selectedItemForDetail.descriptions[i18n.language] || selectedItemForDetail.descriptions['ko']}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedItemForDetail(null);
                                    }}
                                    className="self-center px-8 py-2.5 rounded-full border border-primary/30 bg-primary/5 text-[10px] font-bold text-primary mb-8 hover:bg-primary/10 transition-all uppercase tracking-widest"
                                >
                                    전메뉴로가기
                                </button>

                                <div className="flex flex-col gap-6 mt-auto">
                                    <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] opacity-40 uppercase font-extrabold tracking-widest mb-1">수량 선택</span>
                                            <span className="text-sm font-bold opacity-80">주문할 갯수를 선택하세요</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => decreaseQuantity(selectedItemForDetail.id)}
                                                className="w-14 h-14 rounded-2xl bg-secondary hover:bg-white/10 flex items-center justify-center text-2xl font-bold transition-all active:scale-90"
                                            >
                                                -
                                            </button>
                                            <span className="text-2xl font-bold font-outfit w-8 text-center">
                                                {getItemQuantity(selectedItemForDetail.id)}
                                            </span>
                                            <button
                                                onClick={() => addToCart(selectedItemForDetail)}
                                                className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg active:scale-90 transition-all font-outfit"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedItemForDetail(null)}
                                        className="w-full bg-primary text-primary-foreground py-5 rounded-[2rem] font-bold text-xl shadow-2xl active:scale-95 transition-all"
                                    >
                                        확인 및 닫기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Overlay */}
            {isOutOfRange && (
                <div className="fixed inset-0 z-[100] bg-background/90 flex flex-col items-center justify-center p-12 text-center backdrop-blur-xl">
                    <Info size={48} className="text-accent mb-4" />
                    <h2 className="text-xl font-bold mb-2">{t('security.out_of_range')}</h2>
                    <p className="text-sm opacity-60">{t('common.offline')}</p>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}
