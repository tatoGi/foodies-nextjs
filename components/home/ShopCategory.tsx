import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const CARD_STYLES = ['style-2', 'style-3', '', '', 'style-3', 'style-2'];

export type ShopProduct = {
  title: string;
  slug: string;
  price: string;
  image: string | null;
  excerpt?: string | null;
};

export default function ShopCategory({products}: {products?: ShopProduct[] | null}) {
  const t = useTranslations('shopCategory');
  const tCommon = useTranslations('common');
  const fallback = (t.raw('items') as {title: string}[]).map((item): ShopProduct => ({
    title: item.title,
    slug: '',
    price: t('price'),
    image: null as string | null
  }));
  const items = products && products.length > 0 ? products : fallback;

  return (
    <section className="shop-category-section fix section-padding">
      <div className="pizza-shape bz-gsap-animate-circle d-none d-xl-block">
        <img src="/assets/img/home-1/pizza-shape.png" alt="" />
      </div>
      <div className="rev-shape float-bob-y d-none d-xl-block">
        <img src="/assets/img/home-1/rev-shape.png" alt="" />
      </div>
      <div className="shape1 float-bob-y d-none d-xl-block">
        <img src="/assets/img/home-1/shape-2.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
          <p>{t('description')}</p>
        </div>
      </div>
      <div className="swiper shop-category-slider">
        <div className="swiper-wrapper">
          {items.map((item, i) => (
            <div className="swiper-slide wow fadeInUp" key={item.slug || item.title}>
              <div className={`shop-category-items ${CARD_STYLES[i % CARD_STYLES.length]}`.trim()}>
                <div className="line-shape">
                  <img src="/assets/img/home-1/line-shape.png" alt="" />
                </div>
                <div className="shape-img">
                  <img src="/assets/img/home-1/shape-1.png" alt="" />
                </div>
                <div className="shape">
                  <svg width="292" height="162" viewBox="0 0 292 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0 20C0 8.95431 8.95431 0 20 0H272C283.046 0 292 8.9543 292 20V95.3843C292 101.5 289.23 107.256 284.227 110.772C263.695 125.2 205.494 162 146 162C86.5063 162 28.3054 125.2 7.77321 110.772C2.76957 107.256 0 101.5 0 95.3843V20Z"
                      fill="#F4F1EA"
                    />
                  </svg>
                </div>
                <div className="thumb">
                  <img src={item.image ?? `/assets/img/home-1/shop-category-${(i % 6) + 1}.png`} alt={item.title} />
                </div>
                <div className="content">
                  <div className="star">
                    <i className="fa-etch fa-solid fa-star" />
                    <i className="fa-etch fa-solid fa-star" />
                    <i className="fa-etch fa-solid fa-star" />
                    <i className="fa-etch fa-solid fa-star" />
                    <i className="fa-light fa-star" />
                  </div>
                  <h3 className="title">
                    {item.slug ? <Link href={`/products/${item.slug}`}>{item.title}</Link> : item.title}
                  </h3>
                  <p>{item.excerpt || t('itemDescription')}</p>
                  <div className="pricing-item">
                    <span className="price">{item.price}</span>
                    {item.slug ? (
                      <Link href={`/products/${item.slug}`} className="theme-btn small-btn">
                        {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-dot style-2 text-center mt-2">
          <div className="dot2" />
        </div>
      </div>
    </section>
  );
}
