/**
 * Mock Notification Service for POS Integration
 */

export type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export type PaymentRequest = {
    tableId: string;
    status: 'pending' | 'calculating' | 'done';
    timestamp: number;
    items?: OrderItem[];
    totalAmount?: number;
};

export const triggerPosNotification = async (tableId: string, items?: OrderItem[], totalAmount?: number) => {
    console.log(`[SYSTEM] Triggering POS notification for Table: ${tableId}`);

    try {
        const res = await fetch('/api/pos/requests');
        const requests: PaymentRequest[] = res.ok ? await res.json() : [];

        // 기존 펜딩 요청이 있다면 업데이트, 없다면 신규 추가
        const existingIndex = requests.findIndex(r => r.tableId === tableId && r.status !== 'done');

        const newRequest: PaymentRequest = {
            tableId,
            status: 'pending',
            timestamp: Date.now(),
            items,
            totalAmount
        };

        if (existingIndex > -1) {
            requests[existingIndex] = newRequest;
        } else {
            requests.push(newRequest);
        }

        await fetch('/api/pos/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requests)
        });

        // 로컬 보조 (동일 브라우저 대비)
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error('Failed to trigger POS notification:', e);
    }
};

export const printBillAtCounter = async (tableId: string) => {
    console.log(`[SYSTEM] Printing bill for Table: ${tableId}`);

    try {
        const res = await fetch('/api/pos/requests');
        const requests: PaymentRequest[] = res.ok ? await res.json() : [];

        const updated = requests.map(r =>
            r.tableId === tableId ? { ...r, status: 'calculating' as const } : r
        );

        await fetch('/api/pos/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });

        window.dispatchEvent(new Event('storage'));
        return true;
    } catch (e) {
        console.error('Failed to print bill:', e);
        return false;
    }
};

export const removePosNotification = async (tableId: string) => {
    console.log(`[SYSTEM] Removing POS notification for Table: ${tableId}`);

    try {
        const res = await fetch('/api/pos/requests');
        const requests: PaymentRequest[] = res.ok ? await res.json() : [];
        const filtered = requests.filter(r => r.tableId !== tableId);

        await fetch('/api/pos/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filtered)
        });

        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error('Failed to remove POS notification:', e);
    }
};
