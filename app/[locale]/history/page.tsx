import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import HistoryTop from '@/components/history/HistoryTop';
import HistoryTimeline from '@/components/history/HistoryTimeline';
import type {CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'history')) ?? {};
}

function section(block: CmsPageBlock) {
  switch (block.type) {
    case 'history_top':
      return <HistoryTop data={block.data} />;
    case 'history_timeline':
      return <HistoryTimeline data={block.data} />;
    default:
      return null;
  }
}

export default async function HistoryPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'history');
  if (cmsPage?.template === 'history') {
    return <SitePageLayout title={cmsPage.title}>{renderBlocks(cmsPage.blocks, section)}</SitePageLayout>;
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('history');

  return (
    <SitePageLayout title={t('pageTitle')}>
      <HistoryTop />
      <HistoryTimeline />
    </SitePageLayout>
  );
}
