import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export const IMAGE_BASE_URL =
  'https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/';

export const SITE_URL = 'https://game-delta.asia';

export default {
  site: SITE_URL,
  build: {
    format: 'directory',  // clean URLs without .html extension
  },
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap(),
  ],
};
