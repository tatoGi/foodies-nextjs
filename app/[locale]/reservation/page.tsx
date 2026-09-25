import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import Feature from '@/components/reservation/Feature';
import ComboOffer from '@/components/reservation/ComboOffer';
import BrandStrip from '@/components/reservation/BrandStrip';
import type {CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'reservation')) ?? {};
}

function section(block: CmsPageBlock) {
  switch (block.type) {
    case 'reservation_feature':
      return <Feature data={block.data} />;
    case 'reservation_combo_offer':
      return <ComboOffer data={block.data} />;
    case 'brand_strip':
      return <BrandStrip data={block.data} />;
    default:
      return null;
  }
}

export default async function ReservationPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'reservation');
  if (cmsPage?.template === 'reservation') {
    return <SitePageLayout title={cmsPage.title}>{renderBlocks(cmsPage.blocks, section)}</SitePageLayout>;
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('reservationPage');

  return (
    <SitePageLayout title={t('pageTitle')}>
      <Feature />
      <ComboOffer />
      <BrandStrip />
    </SitePageLayout>
  );
}
