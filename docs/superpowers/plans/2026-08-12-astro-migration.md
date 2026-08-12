# Delta Force Site — Astro Migration + Content Expansion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate game-delta.asia from hand-coded static HTML to Astro + MDX, add 11 new image-rich articles, and deploy to GitHub Pages — while preserving all existing SEO equity.

**Architecture:** Astro SSG with Content Collections for type-safe article metadata, MDX for articles with custom components (Screenshot, Callout, ComparisonTable, etc.), images hosted on GitHub Releases served via jsDelivr CDN.

**Tech Stack:** Astro 5, MDX, TypeScript (for config), GitHub Actions, GitHub Pages, jsDelivr CDN

## Global Constraints

- Domain: `game-delta.asia` (CNAME, no change)
- Google Analytics ID: `G-QDM4XTJZRC`
- AdSense Publisher: `ca-pub-1812733940760212`
- AdSense Ad Client: `ca-pub-1812733940760212`
- CSS variables and design tokens must be preserved exactly (see `css/style.css` in current repo)
- URL format: `.html` extension preserved for all existing URLs (Astro `build.format: 'file'`)
- Existing 15 cover images stay in `public/images/` (already in repo)
- New article images go to GitHub Releases → jsDelivr CDN
- `IMAGE_BASE_URL` constant in `astro.config.mjs`: `'https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/'`
- All 14 existing articles must be migrated with content fidelity (no content loss)
- Every article gets: Article JSON-LD, BreadcrumbList JSON-LD, OG tags, Twitter Card, canonical URL
- Cookie consent must remain GDPR-compliant
- Three.js hero uses raw Canvas 2D (NOT actual Three.js library) — preserve the particle effect

---

## File Structure

```
delta-force-site/
├── astro.config.mjs            # [NEW] Astro config with constants
├── package.json                # [MODIFY] Add astro deps
├── tsconfig.json               # [NEW] TypeScript config
── public/
│   ├── ads.txt                 # [KEEP] Existing
│   ├── robots.txt              # [KEEP] Existing
│   ├── CNAME                   # [KEEP] Existing
│   ├── favicon.svg             # [KEEP] Existing
│   └── images/                 # [KEEP] 15 existing cover images
│       └── *.jpg
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro    # [NEW] HTML shell
│   │   └── ArticleLayout.astro # [NEW] Article wrapper with JSON-LD
│   ├── components/
│   │   ├── SiteHeader.astro    # [NEW] Header/nav
│   │   ├── SiteFooter.astro    # [NEW] Footer
│   │   ├── ArticleCard.astro   # [NEW] Card component
│   │   ├── AdSlot.astro        # [NEW] AdSense wrapper
│   │   ├── Screenshot.astro    # [NEW] Image with CDN prefix
│   │   ├── ImageGallery.astro  # [NEW] Multi-image grid
│   │   ├── Callout.astro       # [NEW] Tip/warning/info box
│   │   ├── ComparisonTable.astro # [NEW] Data table
│   │   ├── TOC.astro           # [NEW] Table of contents
│   │   ├── FilterBar.astro     # [NEW] Category filter
│   │   ├── SearchBar.astro     # [NEW] Search input
│   │   └── HeroSection.astro   # [NEW] Hero with particle canvas
│   ├── pages/
│   │   ├── index.astro         # [NEW] Homepage
│   │   ├── modes.astro         # [NEW] Game modes page
│   │   ├── operators.astro     # [NEW] Operators page
│   │   ├── weapons.astro       # [NEW] Weapons page
│   │   ├── maps.astro          # [NEW] Maps page
│   │   ├── faq.astro           # [NEW] FAQ page
│   │   ├── about.astro         # [NEW] About page
│   │   ├── contact.astro       # [NEW] Contact page
│   │   ├── privacy-policy.astro # [NEW] Privacy policy
│   │   ├── terms-of-service.astro # [NEW] Terms
│   │   ├── 404.astro           # [NEW] Custom 404
│   │   └── articles/
│   │       └── [slug].astro    # [NEW] Dynamic article route
│   ├── content/
│   │   └── articles/           # [NEW] 25 MDX articles (14 migrated + 11 new)
│   │       ├── delta-force-complete-guide.mdx
│   │       ├── havoc-extraction-guide.mdx
│   │       ├── all-out-warfare.mdx
│   │       ├── red-wolf-operator.mdx
│   │       ├── weilong-operator.mdx
│   │       ├── silver-wing-operator.mdx
│   │       ├── hive-medic-operator.mdx
│   │       ├── weapon-tier-list.mdx
│   │       ├── budget-weapon-builds.mdx
│   │       ├── dam-zero-map.mdx
│   │       ├── longbow-valley-map.mdx
│   │       ├── bakhsh-aerospace-base.mdx
│   │       ├── economy-guide.mdx
│   │       ├── beginner-tips.mdx
│   │       ├── stinger-operator.mdx         # NEW
│   │       ├── luna-operator.mdx            # NEW
│   │       ├── shepherd-operator.mdx        # NEW
│   │       ├── season-8-patch-notes.mdx     # NEW
│   │       ├── season-8-meta-analysis.mdx   # NEW
│   │       ├── havoc-knife-run-routes.mdx   # NEW
│   │       ├── havoc-high-value-loot.mdx    # NEW
│   │       ├── havoc-extraction-points.mdx  # NEW
│   │       ├── ar-comparison.mdx            # NEW
│   │       ├── smg-loadout.mdx              # NEW
│   │       ── sniper-marksman.mdx          # NEW
│   ├── content.config.ts       # [NEW] Content Collections schema
│   ├── styles/
│   │   └── global.css          # [NEW] Migrated from css/style.css
│   ── scripts/
│       ├── main.ts             # [NEW] Filter, search, mobile menu
│       ├── cookie-consent.ts   # [NEW] Cookie consent (migrated from JS)
│       └── three-hero.ts       # [NEW] Canvas particle effect
├── .github/
│   └── workflows/
│       ── deploy.yml          # [MODIFY] Build + deploy pipeline
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-08-12-astro-migration-design.md  # [EXISTING] Design spec
        └── plans/
            └── 2026-08-12-astro-migration.md          # [THIS FILE]
```

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json` (modify existing), `tsconfig.json`, `astro.config.mjs`
- Create: `src/content.config.ts`
- Create: `src/styles/global.css` (copy from `css/style.css`)
- Create: `src/scripts/main.ts`, `src/scripts/cookie-consent.ts`, `src/scripts/three-hero.ts`
- Create: `public/CNAME` (copy from root `CNAME`)

**Interfaces:**
- Produces: A working Astro dev server (`npm run dev`) with global CSS loaded and scripts available
- `IMAGE_BASE_URL` exported from `astro.config.mjs` for use in components

**Dependencies:** `astro`, `@astrojs/mdx`, `@astrojs/sitemap`, `sharp`

#### Steps

- [ ] **Step 1: Install Astro and dependencies**

Run in project root:
```bash
npm install astro @astrojs/mdx @astrojs/sitemap sharp
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

- [ ] **Step 3: Create astro.config.mjs**

```js
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
```

- [ ] **Step 4: Update package.json scripts**

Add to `scripts` in `package.json`:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 5: Migrate CSS to Astro**

Create `src/styles/global.css` — copy the entire contents of the existing `css/style.css` (1256 lines) verbatim. No changes needed — Astro will process it as-is.

- [ ] **Step 6: Migrate scripts to TypeScript**

Create `src/scripts/main.ts` — copy contents of existing `js/main.js`, wrap in `export function init() { ... }` or use `document.addEventListener('DOMContentLoaded', ...)`. Keep the IIFE pattern but convert to module.

Create `src/scripts/cookie-consent.ts` — copy contents of `js/cookie-consent.js` verbatim (it's already vanilla JS, just rename).

Create `src/scripts/three-hero.ts` — copy contents of `js/three-hero.js` verbatim. This is raw Canvas 2D, NOT Three.js library.

- [ ] **Step 7: Copy static assets**

```bash
# Copy CNAME to public
cp CNAME public/CNAME

# Existing images stay in public/images/
# (they're already referenced from public/)
```

- [ ] **Step 8: Create Content Collections schema**

Create `src/content.config.ts`:

```typescript
import { z, defineCollection } from 'astro:content';
import { mdx } from '@astrojs/mdx';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum([
      'overview', 'mode', 'operator',
      'weapon', 'map', 'economy',
      'beginner', 'season',
    ]),
    tags: z.array(z.string()).optional(),
    heroImage: z.string(),
    readTime: z.number(),
    author: z.string().default('Delta Force Guide Team'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

- [ ] **Step 9: Verify Astro builds**

Run: `npx astro build`

Expected: Build succeeds with "0 pages" (no pages defined yet). This confirms the config is valid.

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json astro.config.mjs src/ public/CNAME
git commit -m "feat: initialize Astro project with config, schema, CSS, and scripts"
```

---

### Task 2: Build Layouts + Header/Footer Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`

**Interfaces:**
- Consumes: `global.css` (imported in BaseLayout)
- Produces: `BaseLayout` with props `{ title, description, canonical, jsonLd? }` — renders full HTML shell
- Produces: `ArticleLayout` extends BaseLayout, adds article-specific frontmatter processing, breadcrumb JSON-LD, Article JSON-LD

#### Steps

- [ ] **Step 1: Create SiteHeader component**

Create `src/components/SiteHeader.astro`. Extract the header from `index.html` (lines 85-106). Props: `{ currentPage?: string }` for active nav highlighting. Include the mobile menu button and language toggle.

```astro
---
interface Props {
  currentPage?: string;
}
const { currentPage = 'home' } = Astro.props;
---

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="site-logo">
      <span class="logo-icon">DF</span>
      <span>Hawk Ops Guide</span>
    </a>
    <nav>
      <ul class="nav-menu">
        <li><a href="/" class:list={{ active: currentPage === 'home' }}>Home</a></li>
        <li><a href="/modes.html" class:list={{ active: currentPage === 'modes' }}>Game Modes</a></li>
        <li><a href="/operators.html" class:list={{ active: currentPage === 'operators' }}>Operators</a></li>
        <li><a href="/weapons.html" class:list={{ active: currentPage === 'weapons' }}>Weapons</a></li>
        <li><a href="/maps.html" class:list={{ active: currentPage === 'maps' }}>Maps</a></li>
        <li><a href="/faq.html" class:list={{ active: currentPage === 'faq' }}>FAQ</a></li>
        <li><a href="/about.html" class:list={{ active: currentPage === 'about' }}>About</a></li>
        <li><button class="lang-toggle" id="langToggle" title="切换中文/English">EN / 中</button></li>
      </ul>
    </nav>
    <button class="mobile-menu-btn" aria-label="Toggle menu">☰</button>
  </div>
</header>
```

- [ ] **Step 2: Create SiteFooter component**

Create `src/components/SiteFooter.astro`. Extract from `index.html` (lines 364-421). Keep all links but update paths to use `.html` extension consistently.

- [ ] **Step 3: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';

interface Props {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: object[];
  currentPage?: string;
  noindex?: boolean;
}

const {
  title,
  description = 'Complete Delta Force: Hawk Ops guide for 2026.',
  canonical,
  jsonLd = [],
  currentPage = 'home',
  noindex = false,
} = Astro.props;

const canonicalUrl = canonical || Astro.url.href;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <meta name="author" content="Delta Force Hawk Ops Guide">
  {noindex && <meta name="robots" content="noindex">}
  {!noindex && <meta name="robots" content="index, follow">}
  <link rel="canonical" href={canonicalUrl}>

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content={canonicalUrl}>
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:site_name" content="Delta Force Hawk Ops Guide">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content={canonicalUrl}>
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- JSON-LD -->
  {jsonLd.map((ld) => (
    <script type="application/ld+json" set:html={JSON.stringify(ld)} />
  ))}

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-QDM4XTJZRC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-QDM4XTJZRC');
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1812733940760212" crossorigin="anonymous"></script>
</head>
<body>
  <SiteHeader currentPage={currentPage} />
  <slot />
  <SiteFooter />
  <button class="scroll-top" aria-label="Scroll to top">↑</button>
  <script src="../scripts/main.ts"></script>
  <script src="../scripts/three-hero.ts"></script>
  <script src="../scripts/cookie-consent.ts"></script>
</body>
</html>
```

- [ ] **Step 4: Create ArticleLayout**

Create `src/layouts/ArticleLayout.astro`. Extends BaseLayout. Accepts frontmatter from Content Collections entry. Auto-generates:
- Article JSON-LD with `headline`, `image`, `datePublished`, `dateModified`
- BreadcrumbList JSON-LD
- OG image tag (using `IMAGE_BASE_URL + frontmatter.heroImage`)
- Category-based breadcrumb

```astro
---
import BaseLayout from './BaseLayout.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'articles'>;
}

const { entry } = Astro.props;
const { data, slug } = entry;

const articleUrl = `https://game-delta.asia/articles/${slug}.html`;
const heroImageUrl = `https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/${data.heroImage}`;

// Category display name map
const categoryNames: Record<string, string> = {
  overview: 'Overview',
  mode: 'Game Modes',
  operator: 'Operators',
  weapon: 'Weapons',
  map: 'Maps',
  economy: 'Economy',
  beginner: 'Beginner',
  season: 'Season Updates',
};

// Category page URL map
const categoryUrls: Record<string, string> = {
  overview: 'https://game-delta.asia/',
  mode: 'https://game-delta.asia/modes.html',
  operator: 'https://game-delta.asia/operators.html',
  weapon: 'https://game-delta.asia/weapons.html',
  map: 'https://game-delta.asia/maps.html',
  economy: 'https://game-delta.asia/',
  beginner: 'https://game-delta.asia/',
  season: 'https://game-delta.asia/',
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: heroImageUrl,
    author: { '@type': 'Organization', name: data.author },
    publisher: {
      '@type': 'Organization',
      name: 'Delta Force Hawk Ops Guide',
      logo: { '@type': 'ImageObject', url: 'https://game-delta.asia/favicon.svg' },
    },
    datePublished: data.pubDate.toISOString(),
    dateModified: (data.updatedDate || data.pubDate).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://game-delta.asia/' },
      { '@type': 'ListItem', position: 2, name: categoryNames[data.category] || 'Guides', item: categoryUrls[data.category] },
      { '@type': 'ListItem', position: 3, name: data.title, item: articleUrl },
    ],
  },
];
---

<BaseLayout
  title={`${data.title} | Delta Force Guide`}
  description={data.description}
  canonical={articleUrl}
  jsonLd={jsonLd}
  currentPage={data.category}
>
  <main class="article-page">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span class="breadcrumb-sep">›</span>
        <a href={categoryUrls[data.category] || '/'}>{categoryNames[data.category] || 'Guides'}</a>
        <span class="breadcrumb-sep">›</span>
        <span>{data.title}</span>
      </nav>

      <div class="article-hero-banner">
        <img src={heroImageUrl} alt={data.title} loading="lazy">
      </div>

      <header>
        <h1 class="article-title">{data.title}</h1>
        <div class="article-meta">
          <span class="article-meta-item">✍️ {data.author}</span>
          <span class="article-meta-item">📅 Updated {data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span class="article-meta-item">⏱️ {data.readTime} min read</span>
          <span class="article-meta-item">📁 {categoryNames[data.category] || data.category}</span>
        </div>
      </header>

      <article class="article-content">
        <slot />
      </article>

      <!-- Related Articles (auto-generated) -->
      <!-- This will be populated by the [slug].astro route -->
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 5: Create placeholder article for testing**

Create a minimal test article `src/content/articles/test-article.mdx`:

```mdx
---
title: "Test Article"
description: "Testing the Astro setup"
pubDate: 2026-08-12
category: overview
heroImage: "cover-overview.jpg"
readTime: 1
---

# Hello World

This is a test to verify the Astro + MDX pipeline works.

- Item 1
- Item 2

[Back to Home](/)
```

- [ ] **Step 6: Create the dynamic article route**

Create `src/pages/articles/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import AdSlot from '../../components/AdSlot.astro';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---

<ArticleLayout entry={entry}>
  <Content />
  <AdSlot position="bottom" />
</ArticleLayout>
```

- [ ] **Step 7: Build and verify**

Run: `npx astro build`

Expected: Build succeeds. `dist/articles/test-article.html` exists. Check that:
- `<title>` contains "Test Article"
- JSON-LD is present in `<head>`
- OG tags are correct
- Canonical URL is `https://game-delta.asia/articles/test-article.html`

- [ ] **Step 8: Commit**

```bash
git add src/layouts/ src/components/SiteHeader.astro src/components/SiteFooter.astro src/pages/
git commit -m "feat: add BaseLayout, ArticleLayout, header, footer, and article route"
```

---

### Task 3: Build MDX Components

**Files:**
- Create: `src/components/AdSlot.astro`
- Create: `src/components/Screenshot.astro`
- Create: `src/components/ImageGallery.astro`
- Create: `src/components/Callout.astro`
- Create: `src/components/ComparisonTable.astro`
- Create: `src/components/TOC.astro`
- Create: `src/components/ArticleCard.astro`
- Create: `src/components/FilterBar.astro`
- Create: `src/components/SearchBar.astro`
- Create: `src/components/HeroSection.astro`
- Modify: `src/pages/articles/[slug].astro` (import MDX components)

**Interfaces:**
- `Screenshot`: props `{ src: string, alt: string, caption?: string }` — renders `<img>` with CDN-prefixed src
- `Callout`: props `{ type: 'tip' | 'warning' | 'info' | 'success' }` + slot content
- `ComparisonTable`: props `{ headers: string[], rows: string[][] }`
- `AdSlot`: props `{ position: 'header' | 'in-article' | 'bottom' | 'sidebar' }`
- `ArticleCard`: props `{ entry: CollectionEntry<'articles'> }` — renders card from content entry
- `FilterBar`: props `{ activeCategory: string }` + client-side filter logic
- `TOC`: client component that scans article headings and builds nav

#### Steps

- [ ] **Step 1: Create AdSlot component**

Create `src/components/AdSlot.astro`:

```astro
---
interface Props {
  position?: 'header' | 'in-article' | 'bottom' | 'sidebar';
}
const { position = 'in-article' } = Astro.props;
---
<div class="ad-slot" data-position={position}>
  <div class="ad-slot-label">Advertisement</div>
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-1812733940760212"
    data-ad-slot={position}
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
</div>
```

Note: The `<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>` cannot be in an Astro component directly. We'll use `is:inline` script or a client-side loader.

Add to the component's bottom:
```astro
<script is:inline>
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch(e) {}
</script>
```

- [ ] **Step 2: Create Screenshot component**

Create `src/components/Screenshot.astro`:

```astro
---
import { IMAGE_BASE_URL } from '../../astro.config.mjs';

interface Props {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}
const { src, alt, caption, width, height } = Astro.props;
const fullUrl = `${IMAGE_BASE_URL}${src}`;
---
<figure class="article-image">
  <img
    src={fullUrl}
    alt={alt}
    loading="lazy"
    decoding="async"
    {width && {width}}
    {height && {height}}
  >
  {caption && <figcaption class="article-image-caption">{caption}</figcaption>}
</figure>
```

- [ ] **Step 3: Create ImageGallery component**

Create `src/components/ImageGallery.astro`:

```astro
---
interface Props {
  columns?: number;
}
const { columns = 2 } = Astro.props;
---
<div class="image-gallery" style={`grid-template-columns: repeat(${columns}, 1fr)`}>
  <slot />
</div>
```

Add CSS to `src/styles/global.css`:
```css
.image-gallery {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
}
.image-gallery figure {
  margin: 0;
}
.image-gallery img {
  width: 100%;
  border-radius: 8px;
}
```

- [ ] **Step 4: Create Callout component**

Create `src/components/Callout.astro`:

```astro
---
interface Props {
  type?: 'tip' | 'warning' | 'info' | 'success';
  title?: string;
}
const { type = 'info', title } = Astro.props;

const icons: Record<string, string> = {
  tip: '💡',
  warning: '⚠️',
  info: '',
  success: '✅',
};

const titles: Record<string, string> = {
  tip: 'Pro Tip',
  warning: 'Warning',
  info: 'Note',
  success: 'Success',
};
---
<div class="callout callout-{type}">
  {title ? (
    <div class="callout-title">{icons[type]} {title}</div>
  ) : (
    <div class="callout-title">{icons[type]} {titles[type]}</div>
  )}
  <div class="callout-content"><slot /></div>
</div>
```

- [ ] **Step 5: Create ComparisonTable component**

Create `src/components/ComparisonTable.astro`:

```astro
---
interface Props {
  headers: string[];
  rows: string[][];
}
const { headers, rows } = Astro.props;
---
<div class="table-wrapper">
  <table class="comparison-table">
    <thead>
      <tr>{headers.map((h) => <th>{h}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr>{row.map((cell) => <td set:html={cell} />)}</tr>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 6: Create TOC client component**

Create `src/components/TOC.astro`:

```astro
---
// Server-side: no props needed. TOC is built client-side from DOM headings.
---
<nav class="article-toc" aria-label="Table of Contents">
  <h3>On this page</h3>
  <ul id="toc-list"></ul>
</nav>

<script>
  // Build TOC from h2/h3 headings in article content
  const headings = document.querySelectorAll('.article-content h2, .article-content h3');
  const tocList = document.getElementById('toc-list');
  if (!tocList || headings.length === 0) {
    const nav = document.querySelector('.article-toc');
    if (nav) nav.style.display = 'none';
  } else {
    headings.forEach((h) => {
      if (!h.id) h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const li = document.createElement('li');
      li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }
</script>
```

- [ ] **Step 7: Create ArticleCard component**

Create `src/components/ArticleCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'articles'>;
}
const { entry } = Astro.props;
const { data, slug } = entry;

const categoryLabels: Record<string, string> = {
  overview: 'Overview',
  mode: 'Game Mode',
  operator: 'Operator',
  weapon: 'Weapons',
  map: 'Map',
  economy: 'Economy',
  beginner: 'Beginner',
  season: 'Season Update',
};

const categoryClasses: Record<string, string> = {
  overview: 'cat-overview',
  mode: 'cat-mode',
  operator: 'cat-operator',
  weapon: 'cat-weapon',
  map: 'cat-map',
  economy: 'cat-economy',
  beginner: 'cat-beginner',
  season: 'cat-season',
};

const heroUrl = `https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/${data.heroImage}`;
const articleUrl = `/articles/${slug}.html`;
---
<article class="article-card" data-category={categoryClasses[data.category] || `cat-${data.category}`}>
  <img class="card-image-real" src={heroUrl} alt={data.title} loading="lazy">
  <div class="card-body">
    <span class="card-category {categoryClasses[data.category] || ''}">{categoryLabels[data.category] || data.category}</span>
    <h3 class="card-title"><a href={articleUrl}>{data.title}</a></h3>
    <p class="card-excerpt">{data.description}</p>
    <div class="card-meta">
      <time datetime={data.pubDate.toISOString()}>{data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
      <span class="read-time">📖 {data.readTime} min read</span>
    </div>
  </div>
</article>
```

- [ ] **Step 8: Create FilterBar component**

Create `src/components/FilterBar.astro`:

```astro
---
interface Props {
  categories: { key: string; label: string }[];
}
const { categories } = Astro.props;
---
<div class="filter-bar">
  {categories.map((cat, i) => (
    <button class:list={{ 'filter-btn': true, active: i === 0 }} data-filter={cat.key === 'all' ? 'all' : `cat-${cat.key}`}>
      {cat.label}
    </button>
  ))}
</div>
```

- [ ] **Step 9: Create SearchBar component**

Create `src/components/SearchBar.astro`:

```astro
<div class="search-bar">
  <span class="search-icon"></span>
  <input type="text" placeholder="Search guides — operators, weapons, maps...">
</div>
```

- [ ] **Step 10: Create HeroSection component**

Create `src/components/HeroSection.astro`:

```astro
<section class="hero">
  <img src="/images/hero-bg.jpg" alt="" class="hero-bg-img" aria-hidden="true">
  <canvas class="hero-canvas"></canvas>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <span class="hero-badge">Season 7/8 Updated</span>
    <h1 class="hero-title">Delta Force: Hawk Ops Complete Guide</h1>
    <p class="hero-subtitle">Your definitive resource for mastering every operator, weapon, map, and game mode. Up-to-date strategies for Havoc extraction and All-Out Warfare in 2026.</p>
    <div class="hero-cta">
      <a href="#articles" class="btn btn-primary">Browse Guides</a>
      <a href="/articles/delta-force-complete-guide.html" class="btn btn-secondary">Getting Started</a>
    </div>
  </div>
</section>
```

- [ ] **Step 11: Add gallery CSS to global.css**

Append to `src/styles/global.css`:
```css
/* === MDX Component Styles === */
.article-image {
  margin: 2rem 0;
}
.article-image img {
  width: 100%;
  border-radius: 8px;
}
.article-image-caption {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
}
.image-gallery {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
}
.image-gallery figure { margin: 0; }
.image-gallery img { width: 100%; border-radius: 8px; }
.callout {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid;
}
.callout-tip { background: rgba(245,158,11,0.08); border-color: #f59e0b; }
.callout-warning { background: rgba(239,68,68,0.08); border-color: #ef4444; }
.callout-info { background: rgba(59,130,246,0.08); border-color: #3b82f6; }
.callout-success { background: rgba(16,185,129,0.08); border-color: #10b981; }
.callout-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}
.comparison-table th,
.comparison-table td {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  text-align: left;
}
.comparison-table th {
  background: var(--bg-card);
  font-weight: 600;
}
.comparison-table tr:nth-child(even) td {
  background: rgba(26,34,53,0.5);
}
.table-wrapper { overflow-x: auto; }
.article-toc {
  position: sticky;
  top: 80px;
  background: var(--bg-card);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}
.article-toc h3 {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}
.article-toc ul { list-style: none; padding: 0; }
.article-toc li { margin: 0.25rem 0; }
.article-toc .toc-h3 { padding-left: 1rem; }
.article-toc a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
}
.article-toc a:hover { color: var(--accent-primary); }
```

- [ ] **Step 12: Build and verify**

Run: `npx astro build`

Expected: Build succeeds with test article. Verify components render correctly by checking the built HTML for `dist/articles/test-article.html`.

- [ ] **Step 13: Commit**

```bash
git add src/components/ src/styles/global.css
git commit -m "feat: add MDX components (Screenshot, Callout, Table, TOC, Card, Filter, Search, Hero)"
```

---

### Task 4: Migrate All Existing Pages (11 pages)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/modes.astro`
- Create: `src/pages/operators.astro`
- Create: `src/pages/weapons.astro`
- Create: `src/pages/maps.astro`
- Create: `src/pages/faq.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/privacy-policy.astro`
- Create: `src/pages/terms-of-service.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `SiteHeader`, `SiteFooter`, `ArticleCard`, `FilterBar`, `SearchBar`, `HeroSection`, `AdSlot`
- Produces: All 11 existing pages as Astro files with identical content and styling

#### Steps

- [ ] **Step 1: Create index.astro (homepage)**

Create `src/pages/index.astro`. Use the existing `index.html` content (434 lines) as the source of truth:
- Use `BaseLayout` with `currentPage="home"`
- Include `HeroSection` component
- Include `SearchBar` component
- Include `FilterBar` component
- Include `AdSlot` component
- Use `ArticleCard` for each article (will need to import all 14 entries from Content Collections)
- For the article grid, query Content Collections and render cards dynamically:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection.astro';
import SearchBar from '../components/SearchBar.astro';
import FilterBar from '../components/FilterBar.astro';
import ArticleCard from '../components/ArticleCard.astro';
import AdSlot from '../components/AdSlot.astro';
import { getCollection } from 'astro:content';

const articles = await getCollection('articles');
const featured = articles.filter(a => a.data.featured).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
const all = articles.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const categories = [
  { key: 'all', label: 'All' },
  { key: 'mode', label: 'Game Modes' },
  { key: 'operator', label: 'Operators' },
  { key: 'weapon', label: 'Weapons' },
  { key: 'map', label: 'Maps' },
  { key: 'economy', label: 'Economy' },
  { key: 'beginner', label: 'Beginner' },
];
---

<BaseLayout
  title="Delta Force: Hawk Ops Guide 2026 — Weapons, Operators, Maps & Tips"
  description="Complete Delta Force: Hawk Ops guide for 2026. Master Havoc extraction, All-Out Warfare, all operators, meta weapons, maps, economy tips, and beginner strategies."
  currentPage="home"
>
  <HeroSection />
  <section class="section">
    <div class="container"><SearchBar /></div>
  </section>
  <section class="container" id="articles">
    <FilterBar categories={categories} />
    <AdSlot position="header" />
    <div class="articles-grid">
      {all.map((entry) => <ArticleCard entry={entry} />)}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create category pages (modes, operators, weapons, maps)**

For each category page, follow the same pattern:
1. Read the existing HTML file (e.g., `modes.html`, `operators.html`, etc.)
2. Extract the main content section
3. Wrap in `BaseLayout`
4. Replace hardcoded article cards with `ArticleCard` entries filtered by category
5. Keep the page-specific hero/banner sections as-is

Example for `modes.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ArticleCard from '../components/ArticleCard.astro';
import AdSlot from '../components/AdSlot.astro';
import { getCollection } from 'astro:content';

const articles = await getCollection('articles');
const modeArticles = articles.filter(a => a.data.category === 'mode');
---

<BaseLayout
  title="Delta Force Game Modes Guide — Havoc Extraction & All-Out Warfare"
  description="Complete guides for all Delta Force: Hawk Ops game modes. Master Havoc Operations extraction and dominate All-Out Warfare 32v32 battles."
  canonical="https://game-delta.asia/modes.html"
  currentPage="modes"
>
  <div class="category-page">
    <div class="container">
      <h1>Game Modes</h1>
      <p class="category-description">...</p>
      <!-- Copy mode-specific content from modes.html -->
      <AdSlot position="in-article" />
      <div class="articles-grid">
        {modeArticles.map(entry => <ArticleCard entry={entry} />)}
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create content pages (faq, about, contact, privacy, terms)**

These are straightforward text pages. For each:
1. Read the existing HTML
2. Extract the `<main>` content
3. Wrap in `BaseLayout`
4. Copy all text content verbatim — do NOT reword or summarize

The FAQ page is special — it needs `FAQPage` JSON-LD for rich results:

```astro
// In faq.astro frontmatter:
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};
```

- [ ] **Step 4: Create 404.astro**

Copy the content from `404.html` into a `BaseLayout` wrapper. Set `noindex={true}` in BaseLayout props.

- [ ] **Step 5: Build and verify all pages**

Run: `npx astro build`

Expected: All 11 pages + test article build successfully. Verify:
- `dist/index.html` exists with hero section and article grid
- `dist/modes.html` exists
- `dist/operators.html` exists
- `dist/weapons.html` exists
- `dist/maps.html` exists
- `dist/faq.html` exists with FAQPage JSON-LD
- `dist/about.html`, `contact.html`, `privacy-policy.html`, `terms-of-service.html` exist
- `dist/404.html` exists

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: migrate all 11 existing pages to Astro"
```

---

### Task 5: Migrate 14 Existing Articles to MDX

**Files:**
- Create: `src/content/articles/delta-force-complete-guide.mdx`
- Create: `src/content/articles/havoc-extraction-guide.mdx`
- Create: `src/content/articles/all-out-warfare.mdx`
- Create: `src/content/articles/red-wolf-operator.mdx`
- Create: `src/content/articles/weilong-operator.mdx`
- Create: `src/content/articles/silver-wing-operator.mdx`
- Create: `src/content/articles/hive-medic-operator.mdx`
- Create: `src/content/articles/weapon-tier-list.mdx`
- Create: `src/content/articles/budget-weapon-builds.mdx`
- Create: `src/content/articles/dam-zero-map.mdx`
- Create: `src/content/articles/longbow-valley-map.mdx`
- Create: `src/content/articles/bakhsh-aerospace-base.mdx`
- Create: `src/content/articles/economy-guide.mdx`
- Create: `src/content/articles/beginner-tips.mdx`

**Migration Mapping:**

| Source HTML | Target MDX | Category | heroImage |
|---|---|---|---|
| `articles/delta-force-hawk-ops-complete-guide.html` | `delta-force-complete-guide.mdx` | overview | `cover-overview.jpg` |
| `articles/havoc-operations-extraction-guide.html` | `havoc-extraction-guide.mdx` | mode | `cover-havoc.jpg` |
| `articles/all-out-warfare-guide.html` | `all-out-warfare.mdx` | mode | `cover-allout.jpg` |
| `articles/red-wolf-operator-guide.html` | `red-wolf-operator.mdx` | operator | `cover-redwolf.jpg` |
| `articles/weilong-operator-guide.html` | `weilong-operator.mdx` | operator | `cover-weilong.jpg` |
| `articles/silver-wing-operator-guide.html` | `silver-wing-operator.mdx` | operator | `cover-silverwing.jpg` |
| `articles/hive-medic-operator-guide.html` | `hive-medic-operator.mdx` | operator | `cover-hivemedic.jpg` |
| `articles/weapon-tier-list-meta.html` | `weapon-tier-list.mdx` | weapon | `cover-weapons.jpg` |
| `articles/budget-weapon-builds.html` | `budget-weapon-builds.mdx` | weapon | `cover-budget.jpg` |
| `articles/dam-zero-map-guide.html` | `dam-zero-map.mdx` | map | `cover-damzero.jpg` |
| `articles/longbow-valley-map-guide.html` | `longbow-valley-map.mdx` | map | `cover-longbow.jpg` |
| `articles/bakhsh-aerospace-base-guide.html` | `bakhsh-aerospace-base.mdx` | map | `cover-bakhsh.jpg` |
| `articles/economy-system-money-guide.html` | `economy-guide.mdx` | economy | `cover-economy.jpg` |
| `articles/beginner-tips-mistakes.html` | `beginner-tips.mdx` | beginner | `cover-beginner.jpg` |

**Migration Rules:**
1. Frontmatter: Extract `title` from `<title>`, `description` from `<meta name="description">`, `pubDate` from JSON-LD `datePublished`, `readTime` from the article meta section
2. Content body: Convert HTML to Markdown
   - `<h2>` → `##`, `<h3>` → `###`
   - `<p>` → plain text paragraphs
   - `<ul>/<ol>` → markdown lists
   - `<table>` → markdown tables (use `ComparisonTable` component for complex tables)
   - `<a href="...">` → update to Astro route paths (`/articles/slug.html`)
   - Inline SVG images → keep as HTML blocks (MDX supports inline HTML)
   - `<div class="callout ...">` → replace with `<Callout type="...">` component
   - `<div class="ad-slot">` → replace with `<AdSlot position="..." />`
   - `<div class="article-image">` with SVG → wrap in `<figure>` or keep as HTML
3. Preserve ALL text content — no summarizing, no rewriting
4. Featured article: Only `delta-force-complete-guide.mdx` gets `featured: true`

#### Steps

- [ ] **Step 1: Migrate the first article as template (beginner-tips.mdx)**

This article is the best template — it has callouts, tables, inline SVG, ad slots, and internal links. Extract its frontmatter and convert body to MDX:

```mdx
---
title: "Delta Force Beginner Guide — 15 Tips & Common Mistakes to Avoid in 2026"
description: "Delta Force: Hawk Ops beginner guide for 2026 — 15 essential DOs and DON'Ts for new players, budget weapon picks, knife runs, facility upgrades, and how to avoid being a delivery driver."
pubDate: 2026-07-23
updatedDate: 2026-07-24
category: beginner
heroImage: "cover-beginner.jpg"
readTime: 10
tags: ["beginner", "tips", "mistakes"]
featured: false
---

import { Screenshot } from '../../components/Screenshot.astro';
import { Callout } from '../../components/Callout.astro';
import { ComparisonTable } from '../../components/ComparisonTable.astro';
import { AdSlot } from '../../components/AdSlot.astro';

Your first week in Delta Force: Hawk Ops can either set you up for months of profitable extractions — or trap you in a cycle of dying, losing gear, and wondering why you're broke. The difference between those two outcomes is almost never raw gunskill. It's **knowledge**.

This guide is the distillation of what every new player wishes they'd known on day one. Read the **DOs**, internalize the **DON'Ts**, and you'll skip the painful "delivery driver" phase that burns so many new operators.

<Callout type="info" title="What You'll Learn">
7 things you **should** do, 8 things you **shouldn't**, the budget weapons that carry you through early game, and a quick-reference table mapping your current goal to the right starting strategy.
</Callout>

<!-- Keep the inline SVG infographic as-is (MDX supports HTML) -->
<div class="article-image">
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="article-svg-image" role="img" aria-label="Beginner DO vs DON'T comparison infographic">
    ... (copy full SVG from original HTML)
  </svg>
  <div class="article-image-caption">The Delta Force beginner's cheat sheet — 7 DOs, 8 DON'Ts, and the golden rule.</div>
</div>

## The DOs — 7 Things You Should Do

### 1. Learn the Maps {#do-learn-maps}

This is non-negotiable. Use the official **df.qq.com map tool** to study POI locations, extraction points, and common engagement zones before your first serious run. Players who know the map extract consistently; players who don't become loot pinatas for everyone else.

### 2. Start with Knife Runs {#do-knife-runs}

A "knife run" means minimal gear, maximum loot focus. Your first 20 hours should be almost exclusively knife runs on low-complexity maps like Dam Zero and Longbow Valley. The goal is to build wealth and map knowledge — not to win firefights.

### 3. Use Budget Weapons {#do-budget-weapons}

You do NOT need meta weapons to succeed. Two budget picks that carry hard through early and mid-game:

- **AKM** (~200K): reliable, forgiving recoil, great damage. The beginner's best friend.
- **QJB201** (60K–160K): cheap, effective, and available much earlier than other LMGs.

<Callout type="warning" title="Avoid the SG552 in Havoc">
Despite being a fan-favorite in other modes, the **SG552 is a trap in Havoc Operations**. It underperforms at the ranges you'll actually fight at, and the ammo cost doesn't justify the DPS. Pick the AKM instead.
</Callout>

### 4. Copy Modification Codes {#do-mod-codes}

Delta Force lets players share weapon build codes. Don't waste hours figuring out mod combinations yourself — find a working meta build online and copy the code. Apply the same logic to operator loadouts. Standing on the shoulders of giants is the smartest play a beginner can make.

### 5. Extract Early {#do-extract-early}

If you have 300K+ in loot and 10 minutes left on the timer — **extract**. Don't get greedy. One successful extraction with 300K is better than two dead runs with 0. Greed is the #1 killer of new operator bankrolls.

### 6. Play with a Squad {#do-squad}

Solo play in Havoc Operations is brutal. A 3-person squad with comms will outperform a team of 3 randoms every time. Find a squad that matches your playstyle and schedule, and stick with them. Consistency beats raw skill in this game.

### 7. Upgrade Base Facilities {#do-facilities}

Your base is a long-term investment. Prioritize: **Firing Range → Training Center → Pharmacy → Warehouse**. Read our [Economy Guide](/articles/economy-guide.html) for the full breakdown.

<AdSlot position="in-article" />

## The DON'Ts — 8 Mistakes to Avoid

### 1. Don't Be a "Delivery Driver" {#dont-delivery}

The "delivery driver" is a player who brings expensive gear into a match with no plan, dies immediately, and hands their loot to another player. If you can't afford to lose what you're bringing, **don't bring it**. Start cheap, earn your way up.

### 2. Don't Rush on Spawn {#dont-rush}

The first 60 seconds of a match are when most new players die. Slow down. Check your surroundings, listen for audio cues, and move with purpose. Rushing to the nearest POI is the fastest way to become someone else's loot.

### 3. Don't Overspend Early {#dont-overspend}

When you hit your first 1M coins, the temptation to go all-in on a meta loadout is huge. Don't. Keep your per-run spend under 20% of your bankroll until you're consistently profitable. Building wealth takes discipline.

### 4. Don't Ignore the Economy {#dont-ignore-economy}

Delta Force is as much an economy game as a shooter. Understanding market fees, knife run ROI, and facility upgrade order is what separates rich operators from broke ones. Read our [Economy Guide](/articles/economy-guide.html) — it's worth the 10 minutes.

### 5. Don't Use SG552 in Havoc {#dont-sg552}

We mentioned this above but it bears repeating: the SG552 is a trap weapon in Havoc Operations. Use the AKM or QJB201 instead.

### 6. Don't Forget Extraction Routes {#dont-forget-extracts}

Knowing where you'll extract **before you start looting** is what separates professionals from amateurs. Plan your exit first, loot second. Always leave 8+ minutes on the timer before heading out.

### 7. Don't Buy Expensive Room Keys Prematurely {#dont-premature-keys}

A 1.5M coin room key is a terrible investment if you don't know the extraction route. Master the map first — the key is only as valuable as your ability to walk out with what's inside.

### 8. Don't Tilt-Queue After a Bad Death {#dont-tilt}

Dying with a full loadout is frustrating. Queueing immediately for a revenge run is how you turn one bad death into three. Take a break, reset your mental, and come back with a plan.

<AdSlot position="in-article" />

## Quick Reference: Goal → Starting Strategy {#quick-reference}

<ComparisonTable
  headers={["Your Goal", "Start Here", "Budget", "Expected Progress"]}
  rows={[
    ["Build first 1M coins", "Dam Zero Express knife runs", "< 50K per run", "10–15 hours"],
    ["Learn the maps", "df.qq.com tool + Longbow Valley", "Free", "5–10 hours"],
    ["Get first full loadout", "Cement Factory route (AKM + mid armor)", "~200K per run", "5–10 successful runs"],
    ["Try complex maps", "Bakhsh Museum (not Tower) with squad", "300K–500K per run", "After 20+ extractions"],
    ["Go full meta", "Aerospace Base with Skunk Set", "500K+ per run", "After consistently profitable"],
  ]}
/>

<Callout type="success" title="The 80/20 of Delta Force">
80% of your success comes from map knowledge, economy management, and squad comms. The other 20% is actual gunskill. Invest your time accordingly.
</Callout>

<AdSlot position="bottom" />

## Final Thoughts {#conclusion}

Delta Force: Hawk Ops rewards the patient, the prepared, and the disciplined. Follow the DOs, avoid the DON'Ts, and remember the golden rule: **if you can't afford to lose it, don't bring it**. You've got this — see you in the extraction zone.

<Callout type="info" title="What's Next?">
Ready to hit the maps? Start with our [Longbow Valley Map Guide](/articles/longbow-valley-map.html) for your first real loot haul, then move to [money-making strategies](/articles/economy-guide.html) once you've got the basics down.
</Callout>
```

- [ ] **Step 2: Migrate remaining 13 articles**

For each remaining article:
1. Read the source HTML
2. Extract frontmatter fields from `<title>`, `<meta name="description">`, JSON-LD
3. Convert HTML body to Markdown
4. Replace callouts with `<Callout>` components
5. Replace ad slots with `<AdSlot>` components
6. Replace tables with `<ComparisonTable>` where appropriate
7. Keep inline SVGs as raw HTML
8. Update internal links to new `/articles/slug.html` format
9. Add `featured: true` only to `delta-force-complete-guide.mdx`

Process articles in this order (simplest first):
1. `economy-guide.mdx` (economy-system-money-guide.html)
2. `weapon-tier-list.mdx` (weapon-tier-list-meta.html)
3. `budget-weapon-builds.mdx` (budget-weapon-builds.html)
4. `dam-zero-map.mdx` (dam-zero-map-guide.html)
5. `longbow-valley-map.mdx` (longbow-valley-map-guide.html)
6. `bakhsh-aerospace-base.mdx` (bakhsh-aerospace-base-guide.html)
7. `red-wolf-operator.mdx` (red-wolf-operator-guide.html)
8. `weilong-operator.mdx` (weilong-operator-guide.html)
9. `silver-wing-operator.mdx` (silver-wing-operator-guide.html)
10. `hive-medic-operator.mdx` (hive-medic-operator-guide.html)
11. `havoc-extraction-guide.mdx` (havoc-operations-extraction-guide.html)
12. `all-out-warfare.mdx` (all-out-warfare-guide.html)
13. `delta-force-complete-guide.mdx` (delta-force-hawk-ops-complete-guide.html)

- [ ] **Step 3: Delete old HTML articles**

```bash
rm articles/*.html
```

- [ ] **Step 4: Build and verify**

Run: `npx astro build`

Expected: 14 article pages + 11 static pages build. Verify:
- All 25 routes exist in `dist/`
- Article JSON-LD is correct on each article page
- Internal links resolve (e.g., beginner-tips links to economy-guide)
- No broken images (cover images in `public/images/` should still work)

- [ ] **Step 5: Delete old source files**

```bash
rm -rf articles/ css/ js/
rm -f index.html about.html contact.html faq.html maps.html modes.html operators.html privacy-policy.html terms-of-service.html weapons.html 404.html
rm -f CNAME
rm -f sitemap.xml  # Astro generates this automatically
```

Note: `ads.txt`, `robots.txt` stay in `public/`.

- [ ] **Step 6: Commit**

```bash
git add src/content/articles/ && git rm articles/*.html css/style.css js/*.js *.html CNAME sitemap.xml
git commit -m "feat: migrate all 14 existing articles to MDX, remove old HTML sources"
```

---

### Task 6: Write 11 New Articles

**Files:**
- Create: `src/content/articles/stinger-operator.mdx`
- Create: `src/content/articles/luna-operator.mdx`
- Create: `src/content/articles/shepherd-operator.mdx`
- Create: `src/content/articles/season-8-patch-notes.mdx`
- Create: `src/content/articles/season-8-meta-analysis.mdx`
- Create: `src/content/articles/havoc-knife-run-routes.mdx`
- Create: `src/content/articles/havoc-high-value-loot.mdx`
- Create: `src/content/articles/havoc-extraction-points.mdx`
- Create: `src/content/articles/ar-comparison.mdx`
- Create: `src/content/articles/smg-loadout.mdx`
- Create: `src/content/articles/sniper-marksman.mdx`

**Article Specs:**

Each new article:
- Minimum 800 words of substantive content
- At least 3-5 `<Screenshot>` components referencing images from GitHub Releases
- At least 1 `<Callout>` component
- At least 1 `<ComparisonTable>` for data-heavy sections
- 2-3 `<AdSlot>` components (after intro, mid-article, before conclusion)
- Internal links to 3+ existing articles
- `featured: false` for all (or `true` for season-8-meta-analysis)
- `heroImage`: placeholder filename (e.g., `stinger-hero.jpg`) — actual images uploaded to GitHub Release later

**Content Briefs:**

1. **stinger-operator.mdx** — Assault specialist. Cover abilities (Adrenaline Rush, Flash Grenade), best weapon pairings, aggressive playstyle tips, team compositions. Include screenshots of ability effects and loadout configs.

2. **luna-operator.mdx** — Intel/drone operator. Cover Recon Drone ability, EMP, map control from above, intel gathering strategies, counter-drone tactics. Include drone view screenshots and EMP effect images.

3. **shepherd-operator.mdx** — Tactical support. Cover Shield ability, Ammo Resupply, squad support positioning, best operator pairings. Include shield placement screenshots and squad tactic diagrams.

4. **season-8-patch-notes.mdx** — Full Season 8 changelog breakdown. Operator buffs/nerfs, weapon adjustments, map changes, new features. Use ComparisonTable for before/after stats.

5. **season-8-meta-analysis.mdx** — Current meta tier list. Top operators, best weapons per mode, counter picks. Featured article. Use ComparisonTable for tier rankings.

6. **havoc-knife-run-routes.mdx** — Detailed knife run guides for each map. Step-by-step routes with timestamps, risk levels, expected loot values. Use screenshots of route maps.

7. **havoc-high-value-loot.mdx** — Top 20 loot locations across all maps. Priority rankings, loot tables, best approach routes. ComparisonTable for loot value comparison.

8. **havoc-extraction-points.mdx** — All extraction points per map. Safe approaches, ambush spots, timing windows. Map screenshots with extraction points marked.

9. **ar-comparison.mdx** — Assault rifle deep dive. Per-weapon stats, recoil patterns, best attachments, situational rankings. ComparisonTable for side-by-side stats.

10. **smg-loadout.mdx** — SMG guide. Per-weapon builds, CQC tactics, range limitations, best map/mode combos. ComparisonTable for SMG rankings.

11. **sniper-marksman.mdx** — Long-range weapons guide. Bullet drop, scope selection, positioning, best sniper spots per map. Screenshots of sniper positions.

#### Steps

- [ ] **Step 1: Write all 11 new MDX articles**

For each article, follow the MDX template pattern established in Task 5. Use real, substantive game knowledge. Each article should be 800+ words with proper Markdown formatting, component usage, and internal links.

- [ ] **Step 2: Build and verify**

Run: `npx astro build`

Expected: 25 article routes + 11 static pages. All pages build without errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/articles/
git commit -m "feat: add 11 new articles (operators, season updates, havoc strategies, weapon guides)"
```

---

### Task 7: Update Deployment + SEO Preservation

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Create: `public/_redirects` (for 301 redirects from old URLs if needed)

**Interfaces:**
- Consumes: Astro build output in `dist/`
- Produces: GitHub Pages deployment with correct URL structure

#### Steps

- [ ] **Step 1: Update GitHub Actions workflow**

Modify `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create redirect rules**

Create `public/_redirects` (for platforms that support it) or use a JavaScript redirect approach. Since GitHub Pages doesn't natively support `_redirects`, create a post-build script instead.

Actually, since we're using `build.format: 'file'`, Astro will generate `.html` files directly (e.g., `dist/articles/beginner-tips.html`). This means existing URLs are preserved — no redirects needed.

However, if any URL changes (e.g., `delta-force-hawk-ops-complete-guide.html` → `delta-force-complete-guide.html`), add a redirect:

Create `public/redirect.html` with JavaScript meta-redirects for changed URLs.

- [ ] **Step 3: Verify robots.txt and sitemap**

Check that `public/robots.txt` still points to `https://game-delta.asia/sitemap.xml`. Astro's `@astrojs/sitemap` will auto-generate the sitemap at build time. Update robots.txt if needed.

- [ ] **Step 4: Build and verify full site**

Run: `npx astro build`

Verify:
- `dist/sitemap-index.xml` or `dist/sitemap.xml` is generated
- `dist/robots.txt` is copied from `public/`
- `dist/CNAME` is copied from `public/`
- All 36 pages (25 articles + 11 static pages) are in `dist/`
- `.html` extension is present on all URLs

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml public/
git commit -m "feat: update deployment workflow for Astro build pipeline"
```

---

### Task 8: Final Polish + Deploy

**Files:**
- Modify: `src/content.config.ts` (set featured flags if needed)
- Create: Image upload script/documentation

#### Steps

- [ ] **Step 1: SEO audit**

For each article page in `dist/`, verify:
- `<title>` is unique and descriptive
- `<meta name="description">` is present
- `<link rel="canonical">` is correct
- Article JSON-LD has all required fields
- BreadcrumbList JSON-LD is correct
- OG tags are complete
- No `noindex` on content pages

- [ ] **Step 2: Internal linking audit**

Check that every article has at least 3 internal links to other articles. Verify all links resolve to existing `.html` files in `dist/`.

- [ ] **Step 3: Performance check**

Run: `npx astro preview` and check:
- Page load time < 2s on localhost
- Images lazy load correctly
- No JavaScript errors in console
- Mobile layout works (responsive)

- [ ] **Step 4: Document image upload process**

Create `docs/image-upload-guide.md`:

```markdown
# Image Upload Guide

## How to Add Images to New Articles

1. Create your screenshots/images locally
2. Go to GitHub repo → Releases → Create new release (or use existing)
3. Upload images as release assets
4. Reference in MDX using:
   ```mdx
   <Screenshot src="your-image.jpg" alt="Description" />
   ```
5. The `IMAGE_BASE_URL` in `astro.config.mjs` auto-prepends the CDN URL

## Current CDN Base URL
`https://cdn.jsdelivr.net/gh/guoyx/delta-force-site@images-v1/images/`

## Adding New Image Batch
1. Create release with tag `images-v2`
2. Upload new images
3. Update `IMAGE_BASE_URL` in `astro.config.mjs` (or use per-image URLs)
```

- [ ] **Step 5: Final build and push**

```bash
npm run build
git add -A
git commit -m "feat: final polish — SEO audit, internal links, image upload guide"
git push origin main
```

GitHub Actions will auto-deploy to GitHub Pages.

- [ ] **Step 6: Post-deploy verification**

After deployment:
- Visit `https://game-delta.asia/` — verify homepage renders
- Visit a few article pages — verify content, images, JSON-LD
- Check Google Search Console for indexing status
- Verify sitemap is accessible at `https://game-delta.asia/sitemap.xml`

---

## Summary: 8 Tasks

| Task | Deliverable | Estimated Effort |
|------|-------------|-----------------|
| 1. Initialize Astro | Working dev server, schema, CSS, scripts | 30 min |
| 2. Layouts + Header/Footer | BaseLayout, ArticleLayout, SiteHeader, SiteFooter | 45 min |
| 3. MDX Components | 10 components (Screenshot, Callout, Table, TOC, etc.) | 60 min |
| 4. Migrate Pages | 11 Astro pages matching existing HTML | 90 min |
| 5. Migrate Articles | 14 MDX articles from existing HTML | 120 min |
| 6. New Articles | 11 new MDX articles with components | 180 min |
| 7. Deployment | Updated CI/CD, SEO preservation | 30 min |
| 8. Polish + Deploy | SEO audit, internal links, push to prod | 30 min |

**Total: ~9-10 hours of focused work**
