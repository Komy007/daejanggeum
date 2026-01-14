'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * SaaS 실시간 테이블 동기화 훅 (Shared State Simulation)
 */
export function useTableSync(tableId: string) {
    const [cart, setCart] = useState<any[]>([]);
    const [staffCalled, setStaffCalled] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    // 로컬 스토리지 키 생성
    const cartKey = `cart_table_${tableId}`;
    const staffCallKey = `staff_call_table_${tableId}`;
    const orderSubmittedKey = `order_submitted_table_${tableId}`;
    const paymentRequestedKey = `payment_requested_table_${tableId}`;

    // 데이터 로드
    const loadState = useCallback(() => {
        const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        const isStaffCalled = localStorage.getItem(staffCallKey) === 'true';
        const isSubmitted = localStorage.getItem(orderSubmittedKey) === 'true';
        const isPaymentRequested = localStorage.getItem(paymentRequestedKey) === 'true';
        setCart(savedCart);
        setStaffCalled(isStaffCalled);
        setOrderSubmitted(isSubmitted);
        setIsPaying(isPaymentRequested);
    }, [cartKey, staffCallKey, orderSubmittedKey, paymentRequestedKey]);

    useEffect(() => {
        loadState();
        // 다른 탭/창에서의 변경 감지 (실시간 동기화 시뮬레이션)
        window.addEventListener('storage', (e) => {
            if (e.key === cartKey || e.key === staffCallKey || e.key === orderSubmittedKey || e.key === paymentRequestedKey) {
                loadState();
            }
        });
        return () => window.removeEventListener('storage', loadState);
    }, [loadState, cartKey, staffCallKey, orderSubmittedKey, paymentRequestedKey]);

    // 장바구니 업데이트 (같은 테이블 공유)
    const updateCart = (newCart: any[]) => {
        if (orderSubmitted) return; // 주문 후 수정 불가
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        setCart(newCart);
        window.dispatchEvent(new Event('storage'));
    };

    const markOrderAsSubmitted = () => {
        localStorage.setItem(orderSubmittedKey, 'true');
        setOrderSubmitted(true);
        window.dispatchEvent(new Event('storage'));
    };

    const requestPayment = () => {
        localStorage.setItem(paymentRequestedKey, 'true');
        setIsPaying(true);
        window.dispatchEvent(new Event('storage'));
    };

    const cancelPaymentRequest = () => {
        localStorage.setItem(paymentRequestedKey, 'false');
        setIsPaying(false);
        window.dispatchEvent(new Event('storage'));
    };

    const resetTable = () => {
        localStorage.removeItem(cartKey);
        localStorage.removeItem(staffCallKey);
        localStorage.removeItem(orderSubmittedKey);
        localStorage.removeItem(paymentRequestedKey);
        setCart([]);
        setStaffCalled(false);
        setOrderSubmitted(false);
        setIsPaying(false);
        window.dispatchEvent(new Event('storage'));
    };

    const decreaseQuantity = (itemId: string) => {
        if (orderSubmitted) return;
        const existing = cart.find(c => c.id === itemId);
        if (existing) {
            if (existing.quantity > 1) {
                updateCart(cart.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
            } else {
                removeFromCart(itemId);
            }
        }
    };

    const removeFromCart = (itemId: string) => {
        if (orderSubmitted) return;
        updateCart(cart.filter(c => c.id !== itemId));
    };

    const clearCart = () => {
        if (orderSubmitted) return;
        updateCart([]);
    };

    // 직원 호출
    const callStaff = () => {
        localStorage.setItem(staffCallKey, 'true');
        setStaffCalled(true);
        window.dispatchEvent(new Event('storage'));

        const calls = JSON.parse(localStorage.getItem('pos_staff_calls') || '[]');
        if (!calls.includes(tableId)) {
            calls.push(tableId);
            localStorage.setItem('pos_staff_calls', JSON.stringify(calls));
        }
    };

    // 호출 취소
    const cancelStaffCall = () => {
        localStorage.setItem(staffCallKey, 'false');
        setStaffCalled(false);
        window.dispatchEvent(new Event('storage'));

        const calls = JSON.parse(localStorage.getItem('pos_staff_calls') || '[]');
        const filtered = calls.filter((id: string) => id !== tableId);
        localStorage.setItem('pos_staff_calls', JSON.stringify(filtered));
    };

    return {
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
        cancelPaymentRequest,
        resetTable
    };
}
