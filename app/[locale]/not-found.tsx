import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Header from '@/components/home/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Instagram from '@/components/inner/Instagram';
import Cta from '@/components/inner/Cta';
import InnerFooter from '@/components/inner/InnerFooter';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <>
      <Header showMegaMenu />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Breadcrumb title={t('breadcrumbTitle')} currentLabel={t('breadcrumbTitle')} />
          <section className="error-section fix section-padding">
            <div className="shape-1 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-1.png" alt="" />
            </div>
            <div className="shape-2 d-none d-xxl-block float-bob-x">
              <img src="/assets/img/inner/404-shape-2.png" alt="" />
            </div>
            <div className="shape-3 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-3.png" alt="" />
            </div>
            <div className="shape-4 d-none d-xxl-block float-bob-y">
              <img src="/assets/img/inner/404-shape-4.png" alt="" />
            </div>
            <div className="shape-5 d-none d-xxl-block float-bob-x">
              <img src="/assets/img/inner/404-shape-5.png" alt="" />
            </div>
            <div className="container">
              <div className="error-items">
                <div className="thumb wow fadeInUp" data-wow-delay=".3s">
                  <img src="/assets/img/404.png" alt="" />
                </div>
                <div className="content">
                  <h2 className="hero_title wow fadeInUp" data-wow-delay=".2s">{t('title')}</h2>
                  <p className="wow fadeInUp" data-wow-delay=".4s">{t('description')}</p>
                  <Link href="/" className="theme-btn small-btn">
                    {t('goHome')} <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <Instagram />
          <Cta />
          <InnerFooter />
        </div>
      </div>
    </>
  );
}
