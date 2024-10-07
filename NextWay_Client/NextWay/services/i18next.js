import i18next from "i18next";
import {initReactI18next} from 'react-i18next';
import en from '../languages/en.json';
import sin from '../languages/sin.json';
import tam from '../languages/tam.json';


export const languageResources = {
    en: {translation: en},
    sin: {translation: sin},
    tam: {translation: tam},
  };
  
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: languageResources,
  });
  
  export default i18next;