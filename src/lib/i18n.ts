import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        appName: "Mon Kalimera",
        nav: {
          commandCenter: "Command Center",
          members: "Matrice des Membres",
          moderation: "Hub de Modération",
          expansion: "Radar d'Expansion",
          finops: "FinOps & Abonnements",
          events: "Gestion des Événements",
          cms: "CMS & Blog",
        },
      },
    },
  },
  lng: "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
