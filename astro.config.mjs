import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { IMAGE_BASE_URL, SITE_URL } from './src/lib/constants.ts';

export { IMAGE_BASE_URL };

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
