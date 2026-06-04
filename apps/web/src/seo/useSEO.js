/**
 * useSEO — React hook for per-route meta tag injection
 *
 * Usage in any page component:
 *   import { useSEO } from '../seo/useSEO';
 *   useSEO('/dubai');
 *
 * Or with dynamic route detection:
 *   import { useSEO } from '../seo/useSEO';
 *   const { pathname } = useLocation();
 *   useSEO(pathname);
 */

import { useEffect } from 'react';
import { getSEO } from './seoConfig';

export function useSEO(pathname) {
  useEffect(() => {
    const config = getSEO(pathname);

    // ── Title ────────────────────────────────────────────────────
    document.title = config.title;

    // ── Helper: upsert a <meta> tag ──────────────────────────────
    function setMeta(selector, content) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('property=') ? 'property' : 'name';
        const val = selector.match(/["']([^"']+)["']/)?.[1] || '';
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    // ── Helper: upsert a <link> tag ──────────────────────────────
    function setLink(rel, href) {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    // ── Helper: upsert JSON-LD script ────────────────────────────
    function setStructuredData(data) {
      let el = document.querySelector('script[type="application/ld+json"]');
      if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
    }

    // ── Apply all meta ────────────────────────────────────────────
    setMeta('meta[name="description"]', config.description);
    setLink('canonical', config.canonical);

    // Open Graph
    setMeta('meta[property="og:title"]', config.title);
    setMeta('meta[property="og:description"]', config.description);
    setMeta('meta[property="og:url"]', config.canonical);
    setMeta('meta[property="og:type"]', config.ogType || 'website');
    setMeta('meta[property="og:image"]', config.ogImage || 'https://myzonetime.com/og-image.svg');
    setMeta('meta[property="og:site_name"]', config.siteName || 'MyZoneTime');

    // Twitter Card
    setMeta('meta[name="twitter:card"]', config.twitterCard || 'summary_large_image');
    setMeta('meta[name="twitter:title"]', config.title);
    setMeta('meta[name="twitter:description"]', config.description);
    setMeta('meta[name="twitter:image"]', config.ogImage || 'https://myzonetime.com/og-image.svg');

    // Structured Data
    if (config.structuredData) {
      setStructuredData(config.structuredData);
    }
  }, [pathname]);
}
