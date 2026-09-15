import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function ComboBanner() {
  const t = useTranslations('comboBanner');
  const tCommon = useTranslations('common');

  return (
    <section className="comboo-banner-section image-moving section-padding bg-cover" style={{backgroundImage: "url('/assets/img/home-1/comboo-banner.jpg')"}}>
      <div className="burger-shape">
        <img src="/assets/img/home-1/burger2.png" alt="" className="tilt_scale" />
      </div>
      <div className="pizza-shape">
        <img src="/assets/img/home-1/pizza-image2.png" alt="" className="tilt_scale" />
      </div>
      <div className="line-image">
        <img src="/assets/img/home-1/line-2.png" alt="" />
      </div>
      <div className="left-shape">
        <img src="/assets/img/home-1/left-shape.png" alt="" />
      </div>
      <div className="right-shape">
        <img src="/assets/img/home-1/right-shape.png" alt="" />
      </div>
      <div className="container">
        <div className="content">
          <div className="section-title text-center mb-0">
            <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
            <h2 className="tx-title sec_title tz-itm-title tz-itm-anim text-white">
              {t('title')} <br /> {t('titleAccent')}
            </h2>
            <div className="sec-line mt-3 mb-4">
              <img src="/assets/img/home-1/sec-line2.png" alt="" />
            </div>
            <p className="text text-white">{t('description')}</p>
          </div>
          <div className="coming-soon-time wow fadeInUp" data-wow-delay=".3s">
            <div className="timer-content">
              <h2 id="day">00</h2>
              <span>{t('days')}</span>
            </div>
            <div className="timer-dot"><span /><span /></div>
            <div className="timer-content style-2">
              <h2 id="hour">00</h2>
              <span>{t('hours')}</span>
            </div>
            <div className="timer-dot"><span /><span /></div>
            <div className="timer-content style-2">
              <h2 id="min">00</h2>
              <span>{t('minutes')}</span>
            </div>
            <div className="timer-dot"><span /><span /></div>
            <div className="timer-content style-2">
              <h2 id="sec">00</h2>
              <span>{t('seconds')}</span>
            </div>
          </div>
          <Link href="/shop-details" className="theme-btn small-btn wow fadeInUp" data-wow-delay=".5s">
            {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
          </Link>
        </div>
      </div>
    </section>
  );
}
