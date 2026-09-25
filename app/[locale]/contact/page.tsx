import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import SitePageLayout, {renderBlocks} from '@/components/cms/SitePageLayout';
import ContactLocations from '@/components/contact/ContactLocations';
import ContactMap from '@/components/contact/ContactMap';
import type {CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'contact')) ?? {};
}

function section(block: CmsPageBlock) {
  switch (block.type) {
    case 'contact_locations':
      return <ContactLocations data={block.data} />;
    case 'contact_map':
      return <ContactMap data={block.data} />;
    default:
      return null;
  }
}

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'contact');
  if (cmsPage?.template === 'contact') {
    return <SitePageLayout title={cmsPage.title}>{renderBlocks(cmsPage.blocks, section)}</SitePageLayout>;
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('contactPage');

  return (
    <SitePageLayout title={t('pageTitle')}>
      <ContactLocations />
      <ContactMap />
    </SitePageLayout>
  );
}
