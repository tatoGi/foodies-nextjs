import {getTranslations, setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import BestSellingFood from '@/components/menu/BestSellingFood';
import SpecialMenuBanner from '@/components/menu/SpecialMenuBanner';
import BestFoodMenu from '@/components/menu/BestFoodMenu';

export default async function MenuPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menuPage');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          <BestSellingFood />
          <SpecialMenuBanner />
          <BestFoodMenu />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
