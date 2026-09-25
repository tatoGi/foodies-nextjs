import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';

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

  return <CmsPageView page={page} />;
}
