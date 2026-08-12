import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export const IMAGE_BASE_URL =
  'https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/';

export const SITE_URL = 'https://game-delta.asia';

export default {
  site: SITE_URL,
  build: {
    format: 'file',  // produces .html files, preserving existing URL structure
  },
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap(),
  ],
};
