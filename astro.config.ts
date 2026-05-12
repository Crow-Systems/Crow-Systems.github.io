import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://crowsys.chrislabs.net',
  base: '/',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: true }),
    sitemap(),
  ],
  output: 'static',
});
