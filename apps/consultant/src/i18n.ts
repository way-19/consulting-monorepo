// apps/consultant/src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimum hazır kaynaklar; projede gerçek JSON'larınız varsa sonra buraya import edin
// ör: import en from './locales/en.json'; vb.
const resources = {
  en: { translation: {} },
  tr: { translation: {} },
  pt: { translation: {} },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnEmptyString: false,
      keySeparator: false,
    });
}

export default i18n;