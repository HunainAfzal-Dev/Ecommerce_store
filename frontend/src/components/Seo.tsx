import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string | null;
  type?: string;
}

const DEFAULT_DESCRIPTION =
  'Discover curated contemporary garments crafted with premium fabrics, modern silhouettes, and nationwide cash on delivery.';

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description, image, type = 'website' }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes('Garments Store') ? title : `${title} — Garments Store`;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = window.location.href;
    const ogImage = image || `${window.location.origin}/vite.svg`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', desc);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
  }, [title, description, image, type]);

  return null;
}
