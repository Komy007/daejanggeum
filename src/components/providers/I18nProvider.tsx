'use client';

import { ReactNode, useEffect, useState } from 'react';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';

export function I18nProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="bg-background min-h-screen" />; // 초기 로딩 스플래시 대안
    }

    return <>{children}</>;
}
