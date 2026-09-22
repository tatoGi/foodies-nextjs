import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const SLIDE_IMAGES = ['hero-image-3.png', 'hero-image.png', 'hero-image-2.png'];

export default function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  const slides = t.raw('slides') as {title: string; titleAccent: string}[];

  return (
    <section
      className="hero-section fix hero-1 bg-cover"
      style={{backgroundImage: "url('/assets/img/home-1/hero-bg.jpg')"}}
    >
      <div className="shape-1 float-bob-y">
        <img src="/assets/img/home-1/hero-shape1.png" alt="" />
      </div>
      <div className="shape-2 float-bob-x">
        <img src="/assets/img/home-1/hero-shape2.png" alt="" />
      </div>
      <div className="shape-3 float-bob-x">
        <img src="/assets/img/home-1/hero-shape-3.png" alt="" />
      </div>
      <div className="shape-4 float-bob-x">
        <img src="/assets/img/home-1/hero-shape-4.png" alt="" />
      </div>
      <div className="shape-5 float-bob-y">
        <img src="/assets/img/home-1/discount.png" alt="" />
      </div>
      <div className="swiper hero-slider">
        <div className="swiper-wrapper">
          {slides.map((slide, i) => (
            <div className="swiper-slide" key={slide.title + i}>
              <div className="hero-slider-items">
                <div className="container">
                  <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                      <div className="hero-content">
                        <span className="hero-sub">{t('sub')}</span>
                        <h1 className="hero-title tz-split-1 hero_title">
                          {slide.title} <span>{slide.titleAccent}</span>
                        </h1>
                        <p>{t('description')}</p>
                        <div className="hero-btn">
                          <Link href="/menu" className="theme-btn">
                            {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="hero-image">
                        <img src={`/assets/img/home-1/${SLIDE_IMAGES[i]}`} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="swiper-dot">
        <div className="dot" />
      </div>
    </section>
  );
}
