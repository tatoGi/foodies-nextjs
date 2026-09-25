import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {notFound, permanentRedirect} from 'next/navigation';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';

// CMS pages with a designed template live on a fixed route; any slug of theirs (e.g. /en/about-us) goes there.
const TEMPLATE_ROUTES: Record<string, string> = {
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  gallery: '/gallery',
  history: '/history',
  reservation: '/reservation',
  menu: '/menu',
  blog: '/blog'
};

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; rest: string[]}>;
}): Promise<Metadata> {
  const {locale, rest} = await params;
  return (await cmsMetadata(locale, rest.join('/'))) ?? {};
}

export default async function CatchAllPage({
  params
}: {
  params: Promise<{locale: string; rest: string[]}>;
}) {
  const {locale, rest} = await params;
  setRequestLocale(locale);
  const page = await resolveCmsPage(locale, rest.join('/'));
  if (!page) {
    notFound();
  }
  const route = TEMPLATE_ROUTES[page.template];
  if (route) {
    permanentRedirect(`/${locale}${route}`);
  }

  return <CmsPageView page={page} />;
}
