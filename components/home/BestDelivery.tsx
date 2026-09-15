import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function BestDelivery() {
  const t = useTranslations('bestDelivery');
  const tCommon = useTranslations('common');

  return (
    <section className="best-delivery-section fix section-padding">
      <div className="container">
        <div className="best-delivery-wrapper">
          <div className="row g-4">
            <div className="col-xl-4 col-lg-6 cols-item-1">
              <div className="content">
                <div className="section-title mb-0">
                  <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
                  <div className="sec-line mt-3">
                    <img src="/assets/img/home-1/sec-line.png" alt="" />
                  </div>
                </div>
                <p className="text wow fadeInUp" data-wow-delay=".3s">{t('description')}</p>
              </div>
            </div>
            <div className="col-xl-5 cols-item-3">
              <div className="delivery-items text-center">
                <div className="delivery-image float-bob-x">
                  <img src="/assets/img/home-1/delivery-image.png" alt="" />
                </div>
                <Link href="/shop-details" className="theme-btn small-btn">
                  {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 cols-item-2">
              <div className="content-2">
                <div className="section-title mb-0">
                  <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('earnPointsSubTitle')}</span>
                  <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('earnPointsTitle')}</h2>
                  <div className="sec-line mt-3">
                    <img src="/assets/img/home-1/sec-line.png" alt="" />
                  </div>
                </div>
                <div className="info-items wow fadeInUp" data-wow-delay=".5s">
                  <p>{t('infoText')}</p>
                  <div className="info-img">
                    <img src="/assets/img/home-1/info.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
