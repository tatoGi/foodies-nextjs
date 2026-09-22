import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

type SideItem = {image: string; name: string; price: string; available?: boolean};

export default function BestFoodMenu({items}: {items?: SideItem[] | null}) {
  const t = useTranslations('menuPage.bestFoodMenu');
  const tCommon = useTranslations('common');
  const fallbackLeft = t.raw('left') as SideItem[];
  const fallbackRight = t.raw('right') as SideItem[];
  const featured = t.raw('featured') as {name: string; tagline: string; priceCurrent: string; priceOriginal: string};
  const live = items && items.length > 0 ? items : null;
  const leftItems = live ? live.filter((_, index) => index % 2 === 0) : fallbackLeft;
  const rightItems = live ? live.filter((_, index) => index % 2 === 1) : fallbackRight;

  const renderSideList = (items: SideItem[]) => (
    <ul className="best-food-menu-list-two">
      {items.map((item) => (
        <li key={`${item.name}-${item.price}`} style={item.available === false ? {opacity: 0.45} : undefined}>
          <div className="thumb">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="content">
            <div className="star">
              <i className="fa-etch fa-solid fa-star" />
              <i className="fa-etch fa-solid fa-star" />
              <i className="fa-etch fa-solid fa-star" />
              <i className="fa-etch fa-solid fa-star" />
              <i className="fa-light fa-star" />
            </div>
            <h3 className="title">{item.name}</h3>
            <div className="price-list">
              <span>{item.price}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="best-food-menu-two fix section-padding pt-0">
      <div className="shape">
        <img src="/assets/img/home-2/shape8.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-xl-3 cols-item-1 col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            {renderSideList(leftItems)}
          </div>
          <div className="col-xl-6 cols-item-3 wow fadeInUp" data-wow-delay=".5s">
            <div
              className="best-food-menu-wrap-two bg-cover"
              style={{backgroundImage: "url('/assets/img/home-2/food-menu-bg.jpg')"}}
            >
              <div className="content">
                <h2 className="title">{featured.name}</h2>
                <p className="text">{featured.tagline}</p>
                <div className="price-items">
                  <span>{featured.priceCurrent}</span>
                  <p>{featured.priceOriginal}</p>
                </div>
                <Link href="/contact" className="theme-btn small-btn">
                  {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
                </Link>
              </div>
              <div className="rice-image">
                <img src="/assets/img/home-2/rice.png" alt="" />
                <div className="discount">
                  <img src="/assets/img/home-2/discount.png" alt="" />
                </div>
              </div>
              <div className="bg-shape">
                <img src="/assets/img/home-2/bg-shape-1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="col-xl-3 cols-item-2 col-lg-6 wow fadeInUp" data-wow-delay=".7s">
            {renderSideList(rightItems)}
          </div>
        </div>
        <div className="bottom-text wow fadeInUp" data-wow-delay=".9s">
          <p>{t('bottomText')}</p>
          <Link href="/contact" className="theme-btn small-btn">
            {tCommon('orderNow')} <i className="fa-solid fa-basket-shopping" />
          </Link>
        </div>
      </div>
    </section>
  );
}
