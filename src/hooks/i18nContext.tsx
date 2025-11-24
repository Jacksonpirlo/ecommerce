import { createContext, useContext, useState } from "react";
import i18n from "../i18n/locales/index";

const LanguageContext = createContext<{ language: string; changeLanguage: (lang: string) => void }>({
  language: i18n.language,
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }: any) => {
  const initialLang = typeof window !== "undefined" ? localStorage.getItem("lang") || i18n.language : i18n.language;
  const [language, setLanguage] = useState(initialLang);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
