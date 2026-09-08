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

export const getAnchorMap = () => {
  const map: Record<string, string> = {};
  const enAnchors: Record<string, string> = en.anchors;
  const esAnchors: Record<string, string> = es.anchors;
  for (const key of Object.keys(en.anchors)) {
    map[`#${enAnchors[key]}`] = `#${esAnchors[key]}`;
    map[`#${esAnchors[key]}`] = `#${enAnchors[key]}`;
  }
  return map;
};
