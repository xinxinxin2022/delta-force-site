# Image Upload Guide

## How to Add Images to New Articles

1. Create your screenshots/images locally
2. Go to GitHub repo → Releases → Create new release (tag: `images-v1` or next version)
3. Upload images as release assets
4. Reference in MDX using:
   ```mdx
   <Screenshot src="your-image.jpg" alt="Description" />
   ```
5. The `IMAGE_BASE_URL` in `astro.config.mjs` auto-prepends the CDN URL

## Current CDN Base URL

```
https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/
```

## Adding New Image Batch

1. Create release with tag `images-v2` (or next version)
2. Upload new images
3. Update `IMAGE_BASE_URL` in `astro.config.mjs`

## Existing Images

- 15 cover images are in `public/images/` (committed to repo)
- These are used for article cards on category pages and homepage
- New article images should go to GitHub Releases
