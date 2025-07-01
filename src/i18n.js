import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishTranslation from './languages/english';
import frenchTranslation from './languages/french';



i18n
    //   .use(i18nBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: localStorage.getItem("lan") || 'en',
        // lng: getCurrentLang(),
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: englishTranslation,
            },
            fr: {
                translation: frenchTranslation,
            },
        },
    });

export default i18n;
