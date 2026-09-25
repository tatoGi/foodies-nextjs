import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import ContactLocations from '@/components/contact/ContactLocations';
import ContactMap from '@/components/contact/ContactMap';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'contact')) ?? {};
}

export default async function ContactPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'contact');
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }
  const t = await getTranslations('contactPage');

  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          <ContactLocations />
          <ContactMap />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
