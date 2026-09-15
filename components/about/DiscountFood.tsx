import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function DiscountFood() {
  const t = useTranslations('discountFood');
  const tCommon = useTranslations('common');

  return (
    <section className="discount-food-section fix section-padding pt-0">
      <div className="container">
        <div className="row g-3">
          <div className="col-xl-8">
            <div
              className="discount-food-banner-1 bg-cover wow fadeInUp"
              data-wow-delay=".3s"
              style={{backgroundImage: "url('/assets/img/home-1/food-banner-1.jpg')"}}
            >
              <div className="sticker-image">
                <img src="/assets/img/home-1/sticker.png" alt="" />
              </div>
              <div className="content-box">
                <div className="content">
                  <span>{t('limitedTime')}</span>
                  <h2 className="title">{t('offer50')}</h2>
                </div>
                <Link href="/shop-details" className="theme-btn small-btn">
                  {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                <div className="discount-food-banner-2 bg-cover" style={{backgroundImage: "url('/assets/img/home-1/food-banner-2.jpg')"}}>
                  <div className="content">
                    <span className="sub-text">{t('today')}</span>
                    <h2>
                      {t('specialMenuTitle')} <br />
                      <span>{t('specialMenuAccent')}</span>
                    </h2>
                    <p>{t('thisWeekendOnly')}</p>
                  </div>
                  <div className="food-image">
                    <img src="/assets/img/home-1/food-menu2.png" alt="" />
                    <div className="discount-box">
                      <img src="/assets/img/home-1/discount-box.png" alt="" />
                      <div className="cont">
                        <p>{t('only')}</p>
                        <span>{t('price19')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".7s">
                <div className="discount-food-banner-3">
                  <img src="/assets/img/home-1/food-banner-3.jpg" alt="" />
                  <h2 className="title">
                    {t('banner3Title')} <br /> {t('banner3TitleLine2')} <br /> {t('banner3TitleLine3')}
                  </h2>
                  <div className="shape1">
                    <img src="/assets/img/home-1/shape1.png" alt="" />
                  </div>
                  <div className="shape2">
                    <img src="/assets/img/home-1/shape2.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 wow fadeInUp" data-wow-delay=".9s">
            <div className="discount-food-banner-4 bg-cover" style={{backgroundImage: "url('/assets/img/home-1/food-banner-4.jpg')"}}>
              <div className="content">
                <span className="menu-text">{t('specialMenu')}</span>
                <h2>{t('chesseyPizza')}</h2>
                <h3>{t('chefSpecial')}</h3>
                <Link href="/shop-details" className="theme-btn small-btn">
                  {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
              <div className="thumb">
                <img src="/assets/img/home-1/pizza-discount.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="dis-shape">
          <img src="/assets/img/home-1/shape-5.png" alt="" />
        </div>
      </div>
    </section>
  );
}
