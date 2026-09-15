import {getTranslations, setRequestLocale} from 'next-intl/server';
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

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          <WhyChooseUs />
          <DiscountFood />
          <FoodMenu3 />
          <Gallery />
          <BestDelivery />
          <DiscountBanner />
          <News2 />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
