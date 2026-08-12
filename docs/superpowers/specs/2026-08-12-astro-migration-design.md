# Delta Force Site — Astro Migration + Content Expansion Design

**Date:** 2026-08-12  
**Status:** Approved by user (user is in meeting, full autonomy granted)

---

## 1. Context

The site at `game-delta.asia` is a static HTML game guide for *Delta Force: Hawk Ops*. It has 14 articles + 7 category pages, all hand-coded HTML. It uses Google Analytics, AdSense, and is deployed via GitHub Pages. Traffic is growing (30 organic sessions in 28 days, mostly new users).

**Goals:**
1. Migrate to Astro framework for maintainability
2. Write 11 new image-rich articles covering popular topics
3. Host static images on GitHub Releases served via jsDelivr CDN
4. Improve SEO with richer structured data and internal linking
5. Improve UX with better content components

---

## 2. Architecture: Astro + MDX

### Project Structure

```
delta-force-site/
├── astro.config.mjs          # Astro config
├── package.json
├── tsconfig.json
├── public/
│   ├── ads.txt               # Keep existing
│   ├── robots.txt            # Keep existing
│   ├── favicon.svg           # Keep existing
│   └── images/               # Keep existing cover images here
│       └── *.jpg
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell (head, header, footer, scripts)
│   │   └── ArticleLayout.astro   # Article wrapper (breadcrumb, TOC, JSON-LD)
│   ├── components/
│   │   ├── ArticleCard.astro     # Card for article listing
│   │   ├── AdSlot.astro          # AdSense ad unit
│   │   ├── Screenshot.astro      # Image with CDN prefix + lazy load
│   │   ├── ImageGallery.astro    # Multi-image gallery
│   │   ├── Callout.astro         # Info/warning/tip callout boxes
│   │   ├── ComparisonTable.astro # Weapon/operator comparison tables
│   │   ├── TOC.astro             # Auto-generated table of contents
│   │   ├── FilterBar.astro       # Category filter buttons
│   │   ├── SearchBar.astro       # Client-side search
│   │   └── HeroSection.astro     # Hero with Three.js canvas
│   ├── pages/
│   │   ├── index.astro
│   │   ├── modes.astro
│   │   ├── operators.astro
│   │   ├── weapons.astro
│   │   ├── maps.astro
│   │   ├── faq.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy-policy.astro
│   │   ├── terms-of-service.astro
│   │   ── 404.astro
│   ├── content/
│   │   └── articles/             # All MDX articles (14 existing + 11 new)
│   ├── content.config.ts         # Content Collections schema
│   ├── data/
│   │   └── articles.json         # Article metadata (migrated from frontmatter)
│   ├── styles/
│   │   └── global.css            # Migrated from css/style.css
│   └── scripts/
│       ├── main.ts               # Filter, search, mobile menu
│       ├── cookie-consent.ts     # Cookie consent
│       └── three-hero.ts         # Three.js hero animation
```

### Key Decisions

- **Content Collections** for type-safe article metadata
- **MDX** for articles (Markdown + inline components)
- **URL strategy:** Use Astro's `build.format: 'directory'` with `trailingSlash: 'never'` to produce `/articles/beginner-tips/` paths. Add 301 redirects from old `.html` URLs in `_redirects` or via a post-build script to preserve SEO equity.
- **GitHub Releases + jsDelivr** for image hosting:
  - `IMAGE_BASE_URL = 'https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@v{version}/images/'`
  - `Screenshot` component auto-prepends this URL
  - Images uploaded to a GitHub Release tagged per content batch

---

## 3. Content Collections Schema

```typescript
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),           // For SEO meta + card excerpt
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum([
      'overview', 'mode', 'operator',
      'weapon', 'map', 'economy',
      'beginner', 'season'
    ]),
    tags: z.array(z.string()).optional(),
    heroImage: z.string(),             // Filename only, CDN prefix added by component
    readTime: z.number(),
    author: z.string().default('Delta Force Guide Team'),
    featured: z.boolean().default(false),
  }),
});
```

Each article gets automatic:
- `Article` JSON-LD (with `dateModified` for Google freshness signal)
- `BreadcrumbList` JSON-LD
- Open Graph + Twitter Card meta tags
- Canonical URL

---

## 4. MDX Components for Rich Articles

### `Screenshot` Component
```mdx
<Screenshot src="havoc-loot-map.png" alt="Dam Zero loot map" caption="High-value loot spawns on Dam Zero" />
```
- Auto-prepends `IMAGE_BASE_URL`
- `loading="lazy"`, `decoding="async"`
- WebP `<source>` if available
- Optional caption as `<figcaption>`
- Lightbox on click

### `ImageGallery` Component
```mdx
<Gallery>
  <Screenshot src="weapon-1.jpg" alt="..." />
  <Screenshot src="weapon-2.jpg" alt="..." />
</Gallery>
```

### `Callout` Component
```mdx
<Callout type="tip">Always extract before your timer runs out!</Callout>
<Callout type="warning">Don't bring expensive gear to Havoc until you know the routes.</Callout>
<Callout type="info">Season 8 changed the recoil pattern for the M4.</Callout>
```

### `ComparisonTable` Component
```mdx
<ComparisonTable headers={["Weapon", "Damage", "Range", "Recoil"]} rows={[
  ["M4", "32", "Medium", "Low"],
  ["AK-47", "41", "Medium", "High"],
]} />
```

### `AdSlot` Component
```mdx
<AdSlot position="in-article" />
```
Wraps AdSense script, accepts position hints for styling.

---

## 5. New Articles (11 total)

### Batch 1: Missing Operators (3 articles)

1. **Stinger — Assault Specialist Operator Guide**
   - Abilities: Adrenaline Rush, Flash Grenade
   - Best loadouts, positioning, team role
   - Screenshots: ability demo, loadout config, gameplay moments

2. **Luna — Intel & Drone Operator Guide**
   - Abilities: Recon Drone, EMP
   - Map control strategies, intel gathering
   - Screenshots: drone view, EMP effect, tactical positioning

3. **Shepherd — Tactical Support Guide**
   - Abilities: Shield, Ammo Resupply
   - Squad support tactics, best pairings
   - Screenshots: shield placement, resupply timing

### Batch 2: Season Updates (2 articles)

4. **Season 8 Patch Notes — All Changes Explained**
   - Full changelog breakdown
   - Impact analysis per change
   - Before/after comparisons

5. **Season 8 Meta — Best Operators & Weapons Right Now**
   - Current tier rankings
   - Why certain picks are strong
   - Counter strategies

### Batch 3: Havoc Strategies (3 articles)

6. **Knife Run Routes — Fastest Money-Making Paths**
   - Route maps with annotated screenshots
   - Risk/reward analysis per route
   - Timing guides

7. **Top 20 High-Value Loot Locations in Havoc**
   - Map-by-map breakdown
   - Loot tables with images
   - Priority ordering

8. **All Extraction Points & How to Survive Them**
   - Every extraction point per map
   - Ambush spots, safe approaches
   - Screenshot map overlays

### Batch 4: Weapon Deep Dives (3 articles)

9. **Assault Rifles Compared — Which AR Reigns Supreme?**
   - Side-by-side stat tables
   - Recoil pattern images
   - Best attachment builds per AR

10. **SMG Loadouts — Close-Quarter Domination**
    - Per-weapon builds
    - Range/damage comparisons
    - Situational recommendations

11. **Sniper & Marksman Rifles — Long Range Guide**
    - Bullet drop charts
    - Scope recommendations
    - Positioning guides with map screenshots

---

## 6. Internal Linking Strategy

Every article will have:
- **"Related Articles"** section at the bottom (auto-generated: 3 articles from same category)
- **Inline contextual links** — e.g., the Beginner Guide links to Weapon Tier List, Economy Guide, and all operator guides at relevant points
- **Breadcrumb navigation** on every page
- **Category pages** list all articles in that category with cards

---

## 7. SEO Enhancements

| Enhancement | Implementation |
|-------------|---------------|
| Article JSON-LD | Auto-injected by `ArticleLayout` from frontmatter |
| FAQ JSON-LD | `FAQPage` schema on FAQ page |
| Breadcrumb JSON-LD | Auto-injected by `ArticleLayout` |
| `dateModified` | In JSON-LD + visible on article pages |
| Image `alt` text | Required on all `Screenshot` components |
| Internal links | Every article links to 3+ related articles |
| Sitemap | `@astrojs/sitemap` plugin auto-generates |
| Performance | Astro SSG = zero JS by default, lazy images, preconnect |

---

## 8. Image Hosting Workflow

### Setup
1. Create a GitHub Release on the repo (tag: `images-v1`)
2. Upload all existing + new images as release assets
3. Set `IMAGE_BASE_URL` in `astro.config.mjs`:
   ```js
   const IMAGE_BASE_URL = 'https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/';
   ```

### For New Content
1. Create screenshots/images for new articles
2. Upload to a new GitHub Release (e.g., `images-v2`)
3. Update `IMAGE_BASE_URL` or use versioned URLs per image
4. Write the MDX article referencing images by filename

### Fallback
- Keep existing `public/images/` for the original 15 cover images (no CDN migration needed for those — they're already in the repo)
- Only new article images go to GitHub Releases

---

## 9. Deployment

- GitHub Actions workflow updated to run `npm run build` then deploy `dist/`
- CNAME preserved (`game-delta.asia`)
- No changes to custom domain setup

---

## 10. Implementation Phases

### Phase 1: Scaffold & Migrate
- Initialize Astro project
- Set up Content Collections
- Migrate all 14 existing articles to MDX
- Migrate all existing pages to Astro layouts
- Migrate CSS + JS
- Verify all existing URLs resolve (redirect `.html` → extensionless or keep `.html`)

### Phase 2: Components
- Build `Screenshot`, `ImageGallery`, `Callout`, `ComparisonTable`, `AdSlot`
- Build `ArticleCard`, `FilterBar`, `TOC`
- Build `ArticleLayout` with auto JSON-LD

### Phase 3: New Content
- Write all 11 new articles with images
- Set up image hosting on GitHub Releases
- Add internal links across all articles

### Phase 4: Polish & Deploy
- Final SEO audit
- Performance check
- Deploy to GitHub Pages

---

*End of design document.*
