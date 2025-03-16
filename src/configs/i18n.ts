import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files directly
import enTranslation from "../locales/en.json";
import viTranslation from "../locales/vi.json";

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
    lng: "vi",
    fallbackLng: "vi", // Default language if user's language is not available
    detection: {
      order: ["localStorage", "navigator"], // First check localStorage, then browser language
      lookupLocalStorage: "i18nextLng", // Key to use in localStorage
      caches: ["localStorage"], // Cache language selection in localStorage
    },
    react: {
      useSuspense: false, // Disable Suspense to avoid issues with SSR or during loading
    },
  });

export default i18n;
