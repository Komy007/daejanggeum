/**
 * Mock Notification Service for POS Integration
 */

export type PaymentRequest = {
    tableId: string;
    status: 'pending' | 'calculating' | 'done';
    timestamp: number;
};

export const triggerPosNotification = (tableId: string) => {
    console.log(`[SYSTEM] Triggering POS notification for Table: ${tableId}`);

    // LocalStorage를 사용한 페이지 간 통신 시뮬레이션
    const requests: PaymentRequest[] = JSON.parse(localStorage.getItem('payment_requests') || '[]');

    // 중복 체크
    if (!requests.find(r => r.tableId === tableId && r.status !== 'done')) {
        requests.push({
            tableId,
            status: 'pending',
            timestamp: Date.now()
        });
        localStorage.setItem('payment_requests', JSON.stringify(requests));

        // POS 페이지에 스토리지 변경 이벤트 알림
        window.dispatchEvent(new Event('storage'));
    }
};

export const printBillAtCounter = (tableId: string) => {
    console.log(`[SYSTEM] Printing bill for Table: ${tableId}`);

    const requests: PaymentRequest[] = JSON.parse(localStorage.getItem('payment_requests') || '[]');
    const updated = requests.map(r =>
        r.tableId === tableId ? { ...r, status: 'calculating' as const } : r
    );

    localStorage.setItem('payment_requests', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // 실제 환경에서는 여기서 열전사 프린터 API 호출
    return true;
};

export const removePosNotification = (tableId: string) => {
    console.log(`[SYSTEM] Removing POS notification for Table: ${tableId}`);
    const requests: PaymentRequest[] = JSON.parse(localStorage.getItem('payment_requests') || '[]');
    const filtered = requests.filter(r => r.tableId !== tableId);
    localStorage.setItem('payment_requests', JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
};
