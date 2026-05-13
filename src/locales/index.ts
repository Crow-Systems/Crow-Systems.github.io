import en from "./en.json";
import es from "./es.json";
export const getLocaleData = (locale: string) => {
  return locale === "en" ? en : es;
};

export const getRoutes = () => {
  return {
    en: en.routes,
    es: es.routes,
  };
};
