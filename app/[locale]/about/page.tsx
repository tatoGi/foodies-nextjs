import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import CmsPageView, {cmsMetadata, resolveCmsPage} from '@/components/cms/CmsPageView';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import DiscountFood from '@/components/about/DiscountFood';
import FoodMenu3 from '@/components/about/FoodMenu3';
import Gallery from '@/components/about/Gallery';
import BestDelivery from '@/components/home/BestDelivery';
import DiscountBanner from '@/components/about/DiscountBanner';
import News2 from '@/components/about/News2';
import {getMenu, type CmsCategory, type CmsPageBlock} from '@/lib/cms';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  return (await cmsMetadata(locale, 'about')) ?? {};
}

// CMS block type → the designed section. Unknown types are skipped so a new block never breaks the page.
function section(block: CmsPageBlock, menu: CmsCategory[] | null): ReactNode {
  const data = block.data;
  switch (block.type) {
    case 'about_why_choose_us':
      return <WhyChooseUs data={data} />;
    case 'about_discount_food':
      return <DiscountFood data={data} />;
    case 'about_food_menu':
      return <FoodMenu3 data={data} categories={menu} />;
    case 'about_gallery':
      return <Gallery data={data} />;
    case 'best_delivery':
      return <BestDelivery data={data} />;
    case 'about_discount_banner':
      return <DiscountBanner data={data} />;
    case 'about_news':
      return <News2 data={data} />;
    default:
      return null;
  }
}

function Layout({title, children}: {title: string; children: ReactNode}) {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={title} currentLabel={title} />
          {children}
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const cmsPage = await resolveCmsPage(locale, 'about');

  if (cmsPage?.template === 'about') {
    const menu = cmsPage.blocks.some((block) => block.type === 'about_food_menu')
      ? await getMenu(locale, {featured: true})
      : null;

    return (
      <Layout title={cmsPage.title}>
        {cmsPage.blocks.map((block, index) => (
          <div key={`${block.type}-${index}`}>{section(block, menu)}</div>
        ))}
      </Layout>
    );
  }
  if (cmsPage) {
    return <CmsPageView page={cmsPage} />;
  }

  const t = await getTranslations('about');

  return (
    <Layout title={t('pageTitle')}>
      <WhyChooseUs />
      <DiscountFood />
      <FoodMenu3 />
      <Gallery />
      <BestDelivery />
      <DiscountBanner />
      <News2 />
    </Layout>
  );
}
