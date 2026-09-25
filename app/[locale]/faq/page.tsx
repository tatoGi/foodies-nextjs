import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import FaqAccordion from '@/components/faq/FaqAccordion';
import type {CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'faq')) ?? {};
}

function section(block: CmsPageBlock) {
  return block.type === 'faq_accordion' ? <FaqAccordion data={block.data} /> : null;
}

export default async function FaqPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'faq');
  if (cmsPage?.template === 'faq') {
    return <SitePageLayout title={cmsPage.title}>{renderBlocks(cmsPage.blocks, section)}</SitePageLayout>;
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('faq');

  return (
    <SitePageLayout title={t('pageTitle')}>
      <FaqAccordion />
    </SitePageLayout>
  );
}
