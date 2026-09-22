import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

const TAB_IDS = ['Burger', 'Pizza', 'Fresh', 'Sushi'] as const;
const TAB_LABEL_KEYS = ['burger', 'pizza', 'fresh', 'sushi'] as const;

export default function FoodMenu3() {
  const t = useTranslations('about.foodMenu');
  const items = t.raw('items') as {title: string; description: string; price: string}[];

  return (
    <section className="food-menu-section-3 section-padding pt-0 fix">
      <div className="right-shape">
        <img src="/assets/img/home-3/tara-2.png" alt="" />
      </div>
      <div className="right-shape-2">
        <img src="/assets/img/home-3/food-shape-6.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="best-food-menu-wrapper-3">
          <div className="row g-4">
            <div className="col-xl-3 col-lg-6 col-md-6 order-1 wow fadeInUp" data-wow-delay=".3s">
              <div className="food-menu-image">
                <img src="/assets/img/home-3/food-menu.jpg" alt="" />
              </div>
            </div>
            <div className="col-xl-6 col-12 order-3 order-xl-2">
              <div className="food-menu-mid-item">
                <ul className="nav">
                  {TAB_IDS.map((id, i) => (
                    <li className="nav-item wow fadeInUp" key={id}>
                      <a href={`#${id}`} data-bs-toggle="tab" className={`nav-link${i === 0 ? ' active' : ''}`}>
                        {t(`tabs.${TAB_LABEL_KEYS[i]}`)}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="tab-content">
                  {TAB_IDS.map((id, i) => (
                    <div id={id} className={`tab-pane fade${i === 0 ? ' show active' : ''}`} key={id}>
                      <div className="food-menu-items-3">
                        {items.map((item, idx) => (
                          <div className="food-menu-itemss" key={item.title}>
                            <div className="thumb">
                              <img src={`/assets/img/home-3/f-${idx + 1}.png`} alt={item.title} />
                            </div>
                            <div className="content">
                              <h3 className="title">{item.title}</h3>
                              <p>{item.description}</p>
                              <span className="price">{item.price}</span>
                            </div>
                          </div>
                        ))}
                        <div className="food-button">
                          <Link href="/menu" className="theme-btn small-btn">
                            {t('reserveTable')} <i className="fa-regular fa-arrow-up-right" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 order-2 order-xl-3 wow fadeInUp" data-wow-delay=".5s">
              <div className="food-menu-image-2">
                <img src="/assets/img/home-3/food-menu-2.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
