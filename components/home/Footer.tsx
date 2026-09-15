import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const openingHours = t.raw('openingHours') as {day: string; hours: string}[];
  const products = t.raw('products') as string[];
  const recentPosts = t.raw('recentPosts') as {date: string; title: string}[];

  return (
    <footer className="footer-section p-relative footer-fix-padding-2 z-index-1">
      <div className="ripple-image ripples position-absolute w-100 h-100 top-0 start-0 z-0">
        <img src="/assets/img/home-1/footer-bg.jpg" alt="" />
      </div>
      <div className="footer-top-shape d-none d-xl-block">
        <img src="/assets/img/home-1/footer-top-shape.png" alt="" />
      </div>
      <div className="shape-1 float-bob-y d-none d-xl-block">
        <img src="/assets/img/home-1/footer-shape-1.png" alt="" />
      </div>
      <div className="shape-2 d-none d-xl-block">
        <img src="/assets/img/home-1/footer-shape-2.png" alt="" />
      </div>
      <div className="shape-3 d-none d-xl-block">
        <img src="/assets/img/home-1/footer-shape-3.png" alt="" />
      </div>
      <div className="shape-4 float-bob-x d-none d-xl-block">
        <img src="/assets/img/home-1/footer-shape-4.png" alt="" />
      </div>
      <div className="shape-5 float-bob-y d-none d-xl-block">
        <img src="/assets/img/home-1/footer-shape-5.png" alt="" />
      </div>
      <div className="container">
        <div className="footer-top-wrapper">
          <Link href="/" className="footer-logo wow fadeInUp" data-wow-delay=".5s">
            <img src="/assets/img/home-1/footer-logo.svg" alt={tCommon('logoAlt')} />
          </Link>
          <div className="content wow fadeInUp" data-wow-delay=".5s">
            <span>{t('newsletter')}</span>
            <p>{t('newsletterText')}</p>
          </div>
          <form action="#" className="wow fadeInUp" data-wow-delay=".7s">
            <input type="text" placeholder={t('emailPlaceholder')} />
            <button className="email-btn" type="submit">{t('subscribe')}</button>
          </form>
        </div>
        <div className="footer-widget-wrapper">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".2s">
              <div className="footer-widget-items">
                <div className="widget-head">
                  <span className="widget-title">{t('openingHoursTitle')}</span>
                  <div className="dashed" />
                </div>
                <ul className="opening-hours-list">
                  {openingHours.map((row, i) => (
                    <li key={row.day}>
                      {row.day} : {i === openingHours.length - 1 ? <span>{row.hours}</span> : row.hours}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 ps-xl-5 col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
              <div className="footer-widget-items">
                <div className="widget-head">
                  <span className="widget-title">{t('productsTitle')}</span>
                  <div className="dashed" />
                </div>
                <ul className="list-items">
                  {products.map((product, i) => (
                    <li key={`${product}-${i}`}>
                      <Link href="/shop">
                        <i className="fa-solid fa-chevron-right" /> {product}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
              <div className="footer-widget-items">
                <div className="widget-head">
                  <span className="widget-title">{t('recentPostsTitle')}</span>
                  <div className="dashed" />
                </div>
                <ul className="recent-items">
                  {recentPosts.map((post, i) => (
                    <li key={post.title}>
                      <div className="thumb">
                        <img src={`/assets/img/home-1/recent-image${i + 1}.jpg`} alt={post.title} />
                      </div>
                      <div className="content">
                        <span>{post.date}</span>
                        <Link href="/news-details" className="recent-title">{post.title}</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 ps-xl-5 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
              <div className="footer-widget-items">
                <div className="widget-head">
                  <span className="widget-title">{t('contactTitle')}</span>
                  <div className="dashed" />
                </div>
                <div className="footer-content">
                  <p className="text">{t('contactText')}</p>
                  <div className="contact-items">
                    <a href={`mailto:${t('email')}`}>
                      <i className="fa-regular fa-envelope" /> {t('email')}
                    </a>
                  </div>
                  <div className="contact-items">
                    <p>
                      <i className="fa-sharp fa-regular fa-location-dot" /> {t('address')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-wrapper">
            <p>{t('copyright')}</p>
            <div className="social-icon d-flex align-items-center">
              <a href="javascript:void(0)"><i className="fab fa-facebook-f" /></a>
              <a href="javascript:void(0)"><i className="fab fa-twitter" /></a>
              <a href="javascript:void(0)"><i className="fab fa-vimeo-v" /></a>
              <a href="javascript:void(0)"><i className="fab fa-pinterest-p" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
