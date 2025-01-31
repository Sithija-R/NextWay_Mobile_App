import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your language files (make sure paths are correct)
import { en, sin, tam } from "./locales";


const resources = {
  en: { translation: en },
  sin: { translation: sin },
  tam: { translation: tam },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3", // Good practice
    resources,
    lng: 'en', // Default, will be overridden
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  })
  .then(async () => {  // Use .then and async/await
    const storedLang = await AsyncStorage.getItem("language");
    const lng = storedLang || Localization.getLocales()?.split("-")[0] || "en"; 
    i18next.changeLanguage(lng);
  });


export default i18next;