import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ko from './locales/ko.json';
import en from './locales/en.json';
import km from './locales/km.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import vi from './locales/vi.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  km: { translation: km },
  zh: { translation: zh },
  ja: { translation: ja },
  vi: { translation: vi },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
