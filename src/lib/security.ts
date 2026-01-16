/**
 * Smart QR Order Security Utilities
 */

// 매장 위치 (예시: 서울 성수동 대장금 매장 좌표)
const STORE_LOCATION = {
    lat: 37.5445,
    lng: 127.0560,
};

const MAX_RADIUS_METERS = 50;

/**
 * 하베신 공식(Haversine Formula)을 사용하여 두 좌표 사이의 거리를 계산합니다.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 거리 (미터)
};

/**
 * 사용자가 매장 반경 내에 있는지 확인합니다.
 * 사용자의 요청으로 현재는 항상 true를 반환하며, 향후 배달 서비스 개발 시 활성화 예정입니다.
 */
export const validateGeofencing = async (): Promise<boolean> => {
    // 2026-01-16: 사용자의 요청으로 접속 시 위치 확인 팝업 제거
    // 향후 배달 서비스(Home Delivery)에서만 위치 정보가 필요하므로, 현재는 센서 호출 없이 통과시킵니다.
    return true;

    /* (향후 배달용으로 보존할 로직)
    if (process.env.NODE_ENV === 'development') {
        return true;
    }
    ...
    */
};

/**
 * 일회용 세션 토큰을 생성합니다 (QR 도용 방지).
 */
export const generateSessionToken = (tableId: string): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return btoa(`${tableId}-${timestamp}-${random}`);
};

/**
 * 매장 Wi-Fi SSID 접속 여부를 시뮬레이션합니다.
 * 실제 환경에서는 하이브리드 앱 또는 특정 API 게이트웨이와 연동 필요.
 */
export const checkWifiConnectivity = (ssid: string): boolean => {
    // 실제 브라우저에서는 보안상 SSID 직접 조회가 제한되므로, 
    // 매장 내 전용 서버(Internal IP) 접근 성공 여부 등으로 대체 가능합니다.
    console.log(`Checking connectivity for SSID: ${ssid}`);
    return true; // 데모를 위해 true 반환
};
