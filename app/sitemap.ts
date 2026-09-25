import type {MetadataRoute} from 'next';
import {getMenu} from '@/lib/cms';
import {routing} from '@/i18n/routing';

const STATIC_PATHS = ['', '/menu', '/about', '/contact', '/faq', '/gallery', '/history', '/reservation', '/blog'];

function siteUrl(): string {
  return (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const urls = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      const url = `${base}/${locale}${path}`;
      urls.set(url, {url, alternates: {languages: languageMap(path)}});
    }

    const menu = await getMenu(locale);
    for (const category of menu ?? []) {
      for (const product of category.products) {
        if (!product.slug) {
          continue;
        }
        const path = `/products/${product.slug}`;
        const url = `${base}/${locale}${path}`;
        urls.set(url, {url, alternates: {languages: languageMap(path)}});
      }
    }
  }

  const pages = await publishedPages();
  for (const page of pages) {
    for (const [locale, slug] of Object.entries(page.slugs)) {
      if (page.is_home) {
        continue;
      }
      const url = `${base}/${locale}/${slug}`;
      const languages: Record<string, string> = {};
      for (const [code, pageSlug] of Object.entries(page.slugs)) {
        languages[code] = `${base}/${code}/${pageSlug}`;
      }
      urls.set(url, {
        url,
        lastModified: page.updated_at ? new Date(page.updated_at) : undefined,
        alternates: {languages}
      });
    }
  }

  return [...urls.values()];
}

function languageMap(path: string): Record<string, string> {
  const base = siteUrl();
  return Object.fromEntries(routing.locales.map((locale) => [locale, `${base}/${locale}${path}`]));
}

async function publishedPages(): Promise<{is_home: boolean; updated_at: string | null; slugs: Record<string, string>}[]> {
  const cms = process.env.CMS_API_URL;
  if (!cms) {
    return [];
  }

  try {
    const response = await fetch(`${cms.replace(/\/$/, '')}/api/web/pages`, {next: {tags: ['pages'], revalidate: 60}});
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as {
      pages?: {is_home?: boolean; updated_at?: string | null; slugs?: Record<string, string>}[];
    };

    return (data.pages ?? []).map((page) => ({
      is_home: page.is_home === true,
      updated_at: page.updated_at ?? null,
      slugs: page.slugs ?? {}
    }));
  } catch {
    return [];
  }
}
