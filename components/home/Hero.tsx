import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {CmsProduct, HeroSlide} from '@/lib/cms';
import DishBelt from './DishBelt';
import beltStyles from './DishBelt.module.css';

const SLIDE_IMAGES = ['hero-image-3.png', 'hero-image.png', 'hero-image-2.png'];

// Extra section class that lifts the slider dots above the belt when one is shown.
function beltClass(plates: CmsProduct[]) {
  return plates.length > 0 ? ` ${beltStyles.withBelt}` : '';
}

// Hero driven by CMS slides, with the dish belt along the bottom.
function LiveHero({slides, plates}: {slides: HeroSlide[]; plates: CmsProduct[]}) {
  const tCommon = useTranslations('common');

  return (
    <section
      className={`hero-section fix hero-1 bg-cover${beltClass(plates)}`}
      style={{backgroundImage: "url('/assets/img/home-1/hero-bg.jpg')"}}
    >
      <div className="swiper hero-slider">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div className="swiper-slide" key={`${slide.title}-${index}`}>
              <div className="hero-slider-items">
                <div className="container">
                  <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                      <div className="hero-content">
                        {slide.eyebrow ? <span className="hero-sub">{slide.eyebrow}</span> : null}
                        <h1 className="hero-title tz-split-1 hero_title">{slide.title}</h1>
                        {slide.description ? <p>{slide.description}</p> : null}
                        <div className="hero-btn">
                          <Link href={slide.href || '/menu'} className="theme-btn">
                            {slide.button || tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="hero-image">
                        <img src={slide.image ?? `/assets/img/home-1/${SLIDE_IMAGES[index % SLIDE_IMAGES.length]}`} alt={slide.title} />
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
      <DishBelt plates={plates} />
    </section>
  );
}

// Hero without CMS slides: only the dish belt, on the same hero background.
function BeltHero({plates}: {plates: CmsProduct[]}) {
  return (
    <section
      className="hero-section fix hero-1 bg-cover"
      style={{backgroundImage: "url('/assets/img/home-1/hero-bg.jpg')"}}
    >
      <DishBelt plates={plates} />
    </section>
  );
}

// Home hero: CMS slides when the home page has a banner block, otherwise just the dish belt; nothing if neither exists.
export default function Hero({slides, plates = []}: {slides?: HeroSlide[] | null; plates?: CmsProduct[]}) {
  if (slides && slides.length > 0) {
    return <LiveHero slides={slides} plates={plates} />;
  }

  return plates.length > 0 ? <BeltHero plates={plates} /> : null;
}
