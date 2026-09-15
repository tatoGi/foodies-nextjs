import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function InnerFooter() {
  const t = useTranslations('innerFooter');
  const products = t.raw('products') as string[];

  return (
    <>
      <footer className="footer-section-4 fix pb-0 bg-white footer-fix-padding-7">
        <div className="container">
          <div className="footer-widget-wrapper style-widget-wrapper-4">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 wow fadeInUp">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('openingHoursTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="opening-hours-list">
                    <li><span>{t('hoursLabel')}</span> {t('hours')}</li>
                    <li>{t('hoursDays')}</li>
                    <li className="style-4"><span>{t('sundayLabel')}</span> {t('sundayValue')}</li>
                  </ul>
                  <div className="social-icon d-flex align-items-center">
                    <a href="javascript:void(0)"><i className="fab fa-facebook-f" /></a>
                    <a href="javascript:void(0)"><i className="fab fa-twitter" /></a>
                    <a href="javascript:void(0)"><i className="fa-regular fa-basketball" /></a>
                    <a href="javascript:void(0)"><i className="fa-brands fa-instagram" /></a>
                  </div>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-2 col-md-3 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('informationTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    <li><Link href="/contact">{t('privacyPolicy')}</Link></li>
                    <li><Link href="/contact">{t('refundPolicy')}</Link></li>
                    <li><Link href="/contact">{t('shippingReturn')}</Link></li>
                    <li><Link href="/contact">{t('termsOfUse')}</Link></li>
                    <li><Link href="/contact">{t('discountOffer')}</Link></li>
                    <li><Link href="/contact">{t('bestSeller')}</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="footer-widget-items">
                  <div className="footer-content">
                    <div className="footer-logo">
                      <Link href="/">
                        <img src="/assets/img/home-4/footer-logo.png" alt={t('logoAlt')} />
                      </Link>
                    </div>
                    <p className="text">{t('aboutText')}</p>
                    <h2><a href="tel:+17189044450">{t('phone')}</a></h2>
                    <div className="contact-items">
                      <a href={`mailto:${t('email')}`}><i className="fa-regular fa-envelope" /> {t('email')}</a>
                    </div>
                    <div className="contact-items">
                      <p><i className="fa-solid fa-magnifying-glass" /> {t('address')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-3 ps-xl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".6s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('productsTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    {products.map((product, i) => (
                      <li key={`${product}-${i}`}>
                        <Link href="/shop"><i className="fa-solid fa-chevron-right" /> {product}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xxl-2 col-xl-3 col-lg-4 ps-xxl-5 col-md-6 col-sm-6 col-6 wow fadeInUp" data-wow-delay=".8s">
                <div className="footer-widget-items">
                  <div className="widget-head">
                    <span className="widget-title">{t('quickLinksTitle')}</span>
                    <div className="dashed" />
                  </div>
                  <ul className="list-items">
                    <li><Link href="/about">{t('aboutUs')}</Link></li>
                    <li><Link href="/shop">{t('ourMenu')}</Link></li>
                    <li><Link href="/contact">{t('contactUs')}</Link></li>
                    <li><Link href="/contact">{t('privacyPolicy')}</Link></li>
                    <li><Link href="/faq">{t('faq')}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom style-3">
          <div className="container">
            <div className="footer-bottom-wrapper">
              <p>{t('copyright')}</p>
              <div className="app-image">
                <img src="/assets/img/home-3/app.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
