import {getTranslations, setRequestLocale} from 'next-intl/server';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';
import Feature from '@/components/reservation/Feature';
import ComboOffer from '@/components/reservation/ComboOffer';
import BrandStrip from '@/components/reservation/BrandStrip';

export default async function ReservationPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('reservationPage');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('pageTitle')} currentLabel={t('pageTitle')} />
          <Feature />
          <ComboOffer />
          <BrandStrip />
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
