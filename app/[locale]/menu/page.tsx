import {getTranslations, setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import BestSellingFood from '@/components/menu/BestSellingFood';
import SpecialMenuBanner from '@/components/menu/SpecialMenuBanner';
import BestFoodMenu from '@/components/menu/BestFoodMenu';
import BakeryMenu from '@/components/menu/BakeryMenu';
import {getMenu} from '@/lib/cms';

export default async function MenuPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menuPage');
  const menu = await getMenu(locale);
  const live = menu && menu.some((category) => category.products.length > 0) ? menu : null;

  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          {live ? <BakeryMenu categories={live} /> : <BestSellingFood />}
          <SpecialMenuBanner />
          {live ? null : <BestFoodMenu />}
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
