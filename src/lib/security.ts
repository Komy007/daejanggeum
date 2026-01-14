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
 */
export const validateGeofencing = async (): Promise<boolean> => {
    // 개발 모드나 로컬 테스트 중에는 보안 검사를 통과시킵니다.
    if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Geofencing bypassed.');
        return true;
    }

    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser.');
            resolve(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const distance = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    STORE_LOCATION.lat,
                    STORE_LOCATION.lng
                );
                resolve(distance <= MAX_RADIUS_METERS);
            },
            (error) => {
                // HTTP 접속이나 권한 거부 시 발생합니다. console.error 대신 warn을 사용하여 화면 멈춤을 방지합니다.
                console.warn('Location access skipped or failed:', error.message);
                resolve(true); // 테스트 편의를 위해 에러 시에도 일단 통과 (운영 시 false로 변경 권장)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
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
