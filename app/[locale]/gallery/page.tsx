import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import type {CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'gallery')) ?? {};
}

function section(block: CmsPageBlock) {
  return block.type === 'gallery_grid' ? <GalleryGrid data={block.data} /> : null;
}

export default async function GalleryPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'gallery');
  if (cmsPage?.template === 'gallery') {
    return <SitePageLayout title={cmsPage.title} bannerImage={cmsPage.image}>{renderBlocks(cmsPage.blocks, section)}</SitePageLayout>;
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('galleryPage');

  return (
    <SitePageLayout title={t('pageTitle')}>
      <GalleryGrid />
    </SitePageLayout>
  );
}
