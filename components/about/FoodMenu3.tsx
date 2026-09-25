import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {link, image, text, type BlockData} from '@/lib/blockData';
import type {CmsCategory} from '@/lib/cms';

const TAB_IDS = ['Burger', 'Pizza', 'Fresh', 'Sushi'] as const;
const TAB_LABEL_KEYS = ['burger', 'pizza', 'fresh', 'sushi'] as const;

type Tab = {id: string; label: string; items: {title: string; description: string; price: string; image: string}[]};

export default function FoodMenu3({data, categories}: {data?: BlockData; categories?: CmsCategory[] | null}) {
  const t = useTranslations('about.foodMenu');
  const staticItems = t.raw('items') as {title: string; description: string; price: string}[];
  const live = (categories ?? []).filter((category) => category.products.length > 0).slice(0, 4);
  const tabs: Tab[] =
    live.length > 0
      ? live.map((category, i) => ({
          id: `menu-tab-${i}`,
          label: category.name,
          items: category.products.map((product, idx) => ({
            title: product.title,
            description: product.excerpt ?? '',
            price: product.price,
            image: product.image ?? `/assets/img/home-3/f-${(idx % 4) + 1}.png`
          }))
        }))
      : TAB_IDS.map((id, i) => ({
          id,
          label: t(`tabs.${TAB_LABEL_KEYS[i]}`),
          items: staticItems.map((item, idx) => ({...item, image: `/assets/img/home-3/f-${idx + 1}.png`}))
        }));

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
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="best-food-menu-wrapper-3">
          <div className="row g-4">
            <div className="col-xl-3 col-lg-6 col-md-6 order-1 wow fadeInUp" data-wow-delay=".3s">
              <div className="food-menu-image">
                <img src={image(data, 'left_image', '/assets/img/home-3/food-menu.jpg')} alt="" />
              </div>
            </div>
            <div className="col-xl-6 col-12 order-3 order-xl-2">
              <div className="food-menu-mid-item">
                <ul className="nav">
                  {tabs.map((tab, i) => (
                    <li className="nav-item wow fadeInUp" key={tab.id}>
                      <a href={`#${tab.id}`} data-bs-toggle="tab" className={`nav-link${i === 0 ? ' active' : ''}`}>
                        {tab.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="tab-content">
                  {tabs.map((tab, i) => (
                    <div id={tab.id} className={`tab-pane fade${i === 0 ? ' show active' : ''}`} key={tab.id}>
                      <div className="food-menu-items-3">
                        {tab.items.map((item) => (
                          <div className="food-menu-itemss" key={item.title}>
                            <div className="thumb">
                              <img src={item.image} alt={item.title} />
                            </div>
                            <div className="content">
                              <h3 className="title">{item.title}</h3>
                              <p>{item.description}</p>
                              <span className="price">{item.price}</span>
                            </div>
                          </div>
                        ))}
                        <div className="food-button">
                          <Link href={link(data, 'button_link', '/menu')} className="theme-btn small-btn">
                            {text(data, 'button_text', t('reserveTable'))} <i className="fa-regular fa-arrow-up-right" />
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
                <img src={image(data, 'right_image', '/assets/img/home-3/food-menu-2.jpg')} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
