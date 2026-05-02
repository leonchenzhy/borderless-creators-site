import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Always hardcode to production so staging/preview builds never generate
  // a sitemap pointing at non-canonical URLs.
  site: 'https://borderlesscreators.com',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
});
