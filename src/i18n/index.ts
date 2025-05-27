import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // 從 public/locales 讀 JSON
  .use(LanguageDetector) // 根據瀏覽器語言自動切換
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    debug: import.meta.env.DEV, // 開發階段才開 debug
    interpolation: {
      escapeValue: false, // React 已自帶 XSS 防禦
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
