import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { getRoutes } from './src/locales';

const SITE_URL = process.env.SITE_URL || 'https://crow-systems.github.io';
const routes = getRoutes();

const stripSlash = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

const withSlash = (p: string) => (p.length > 1 && !p.endsWith('/') ? `${p}/` : p);

const hreflangByPath = new Map<string, { url: string; lang: string }[]>();
for (const key of Object.keys(routes.en)) {
  const links = [
    { url: `${SITE_URL}${withSlash(routes.es[key])}`, lang: 'es' },
    { url: `${SITE_URL}${withSlash(routes.en[key])}`, lang: 'en' },
    { url: `${SITE_URL}${withSlash(routes.es[key])}`, lang: 'x-default' },
  ];
  hreflangByPath.set(stripSlash(routes.es[key]), links);
  hreflangByPath.set(stripSlash(routes.en[key]), links);
}
const corporate = [
  { url: `${SITE_URL}/folleto/corporate/`, lang: 'es' },
  { url: `${SITE_URL}/en/flyer/corporate/`, lang: 'en' },
  { url: `${SITE_URL}/folleto/corporate/`, lang: 'x-default' },
];
hreflangByPath.set('/folleto/corporate', corporate);
hreflangByPath.set('/en/flyer/corporate', corporate);

export default defineConfig({
  site: SITE_URL,
  base: '/',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: true }),
    sitemap({
      filter: (url) => !/\/\d{3}\/?$/.test(new URL(url).pathname),
      serialize: (item) => {
        const path = stripSlash(new URL(item.url).pathname);
        const links = hreflangByPath.get(path);
        if (links) item.links = links;
        return item;
      },
    }),
  ],
  output: 'static',
  vite: {
    build: {
      sourcemap: false,
      cssCodeSplit: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022',
      },
    },
  },
});