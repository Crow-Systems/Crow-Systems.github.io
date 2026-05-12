export function getStaticPaths() {
  return [
    { params: { lang: "en" } },
    { params: { lang: "es" } },
  ];
}