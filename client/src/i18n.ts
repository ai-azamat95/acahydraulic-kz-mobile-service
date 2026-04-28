import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ruTranslation from './locales/ru/translation.json';
import kzTranslation from './locales/kz/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ruTranslation,
      },
      kz: {
        translation: kzTranslation,
      },
    },
    fallbackLng: 'ru',
    lng: 'ru',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
