'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerPosNotification } from '@/lib/notifications';

/**
 * SaaS 실시간 테이블 동기화 훅 (Shared State Simulation)
 * Ref-First 접근 방식을 사용하여 수량 조절 등 빠른 상태 변화를 안정적으로 처리합니다.
 */
export function useTableSync(tableId: string) {
    const [cart, setCart] = useState<any[]>([]);
    const [staffCalled, setStaffCalled] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    // Refs as the "True Source" for sync and rapid updates
    const cartRef = useRef<any[]>([]);
    const staffRef = useRef(false);
    const orderRef = useRef(false);
    const payingRef = useRef(false);
    const lastUpdateTimestamp = useRef(0);

    // Initial load and Polling
    const loadStateFromServer = useCallback(async () => {
        if (!tableId || tableId === 'undefined') return;

        // Shield: Local updates take priority for 3 seconds
        if (Date.now() - lastUpdateTimestamp.current < 3000) return;

        try {
            const res = await fetch(`/api/table/${tableId}`);
            if (res.ok) {
                const data = await res.json();

                // Only update if state actually changed or we are idling
                setCart(data.cart || []);
                setStaffCalled(data.staffCalled || false);
                setOrderSubmitted(data.orderSubmitted || false);
                setIsPaying(data.isPaying || false);

                // Keep refs in sync with server data while idling
                cartRef.current = data.cart || [];
                staffRef.current = data.staffCalled || false;
                orderRef.current = data.orderSubmitted || false;
                payingRef.current = data.isPaying || false;
            }
        } catch (error) {
            console.error('Failed to sync with server:', error);
        }
    }, [tableId]);

    const saveToServer = useCallback(async () => {
        if (!tableId || tableId === 'undefined') return;

        lastUpdateTimestamp.current = Date.now();
        const newState = {
            cart: cartRef.current,
            staffCalled: staffRef.current,
            orderSubmitted: orderRef.current,
            isPaying: payingRef.current
        };

        try {
            await fetch(`/api/table/${tableId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newState)
            });
        } catch (error) {
            console.error('Failed to save to server:', error);
        }
    }, [tableId]);

    useEffect(() => {
        loadStateFromServer();
        const interval = setInterval(loadStateFromServer, 1500);
        return () => clearInterval(interval);
    }, [loadStateFromServer]);

    // Local Logic - Unified Update Handler
    const updateLocalStateAndSave = (nextCart: any[]) => {
        setCart(nextCart);
        cartRef.current = nextCart;
        saveToServer();
    };

    const addToCart = (item: any) => {
        // We remove 'orderSubmitted' block to prevent "locked" state bugs during dev/testing
        const existing = cartRef.current.find(c => c.id === item.id);
        const next = existing
            ? cartRef.current.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
            : [...cartRef.current, { ...item, quantity: 1 }];
        updateLocalStateAndSave(next);
    };

    const decreaseQuantity = (itemId: string) => {
        const existing = cartRef.current.find(c => c.id === itemId);
        if (!existing) return;

        let next;
        if (existing.quantity > 1) {
            next = cartRef.current.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
        } else {
            next = cartRef.current.filter(c => c.id !== itemId);
        }
        updateLocalStateAndSave(next);
    };

    const removeFromCart = (itemId: string) => {
        const next = cartRef.current.filter(c => c.id !== itemId);
        updateLocalStateAndSave(next);
    };

    const clearCart = () => {
        updateLocalStateAndSave([]);
    };

    const callStaff = () => {
        setStaffCalled(true);
        staffRef.current = true;
        saveToServer();
    };

    const cancelStaffCall = () => {
        setStaffCalled(false);
        staffRef.current = false;
        saveToServer();
    };

    const markOrderAsSubmitted = () => {
        setOrderSubmitted(true);
        orderRef.current = true;
        saveToServer();
    };

    const requestPayment = async (items?: any[], totalAmount?: number) => {
        setIsPaying(true);
        payingRef.current = true;
        saveToServer();
        await triggerPosNotification(tableId as string, items, totalAmount);
    };

    const cancelPaymentRequest = () => {
        setIsPaying(false);
        payingRef.current = false;
        saveToServer();
    };

    const resetTable = () => {
        setCart([]);
        setStaffCalled(false);
        setOrderSubmitted(false);
        setIsPaying(false);
        cartRef.current = [];
        staffRef.current = false;
        orderRef.current = false;
        payingRef.current = false;
        saveToServer();
    };

    return {
        cart,
        updateCart: updateLocalStateAndSave,
        addToCart,
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
