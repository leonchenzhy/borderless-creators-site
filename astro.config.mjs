import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// ─── Site URL ─────────────────────────────────────────────────────────────────
// Canonical production domain: https://borderlesscreators.com
//
// wrangler.toml [vars]          SITE_URL = "https://borderlesscreators.com"
// wrangler.toml [env.preview]   SITE_URL = "https://staging.borderlesscreators.com"
const SITE_URL = process.env.SITE_URL ?? 'https://borderless-creators-site.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    // sitemap() — temporarily removed; re-add after confirming staging builds pass
  ],
});
