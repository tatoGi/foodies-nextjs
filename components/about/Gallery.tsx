import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function Gallery() {
  const t = useTranslations('about.gallery');

  return (
    <div className="gallery-section fix">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
      </div>
      <div className="gallery-area">
        <div className="gallery-shape-1">
          <img src="/assets/img/home-2/gallery-shape.png" alt="" />
        </div>
        <div className="gallery-shape-2">
          <img src="/assets/img/home-2/gallery-shape2.png" alt="" />
        </div>
        <div className="swiper galler-slider">
          <div className="swiper-wrapper gallery-titming">
            {[1, 2, 3].map((n) => (
              <div className="swiper-slide" key={n}>
                <div className="gallery-block-one">
                  <img src={`/assets/img/home-2/gallery-${n}.jpg`} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="gallery-btn">
          <Link href="/gallery" className="theme-btn small-btn">
            {t('viewGallery')} <i className="fa-light fa-arrow-up-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
