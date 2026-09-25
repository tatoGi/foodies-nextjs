import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {link, images, text, type BlockData} from '@/lib/blockData';

const FALLBACK_IMAGES = [1, 2, 3].map((n) => `/assets/img/home-2/gallery-${n}.jpg`);

export default function Gallery({data}: {data?: BlockData}) {
  const t = useTranslations('about.gallery');
  const slides = images(data, 'images', FALLBACK_IMAGES);

  return (
    <div className="gallery-section fix">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
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
            {slides.map((src) => (
              <div className="swiper-slide" key={src}>
                <div className="gallery-block-one">
                  <img src={src} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="gallery-btn">
          <Link href={link(data, 'button_link', '/gallery')} className="theme-btn small-btn">
            {text(data, 'button_text', t('viewGallery'))} <i className="fa-light fa-arrow-up-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
