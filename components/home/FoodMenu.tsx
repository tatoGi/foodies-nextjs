import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {CmsCategory, CmsProduct} from '@/lib/cms';

const PLACEHOLDER_IMAGES = [
  '/assets/img/home-1/food-menu-1.png',
  '/assets/img/home-1/food-menu-2.png',
  '/assets/img/home-1/food-menu-3.png',
  '/assets/img/home-1/food-menu-4.png'
];

const TAB_IDS = ['Burger', 'Pizza', 'Fresh', 'Sushi', 'Juice'] as const;
const TAB_LABEL_KEYS = ['burger', 'pizza', 'fresh', 'sushi', 'juice'] as const;

function MenuColumn({
  items,
  start,
  count,
  styleTwo,
  itemDescription,
  price
}: {
  items: {title: string}[];
  start: number;
  count: number;
  styleTwo: boolean;
  itemDescription: string;
  price: string;
}) {
  return (
    <div className={`food-menu-wrapper${styleTwo ? ' style-2' : ''}`}>
      {items.slice(start, start + count).map((item, i) => (
        <div className="food-menu-items" key={item.title}>
          <div className="thumb">
            <img src={`/assets/img/home-1/food-menu-${start + i + 1}.png`} alt={item.title} />
          </div>
          <div className="content">
            <h3 className="title">{item.title}</h3>
            <p>{itemDescription}</p>
            <span className="price">{price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveColumn({products, start}: {products: CmsProduct[]; start: number}) {
  const tMenu = useTranslations('menuPage.liveMenu');
  const half = Math.ceil(products.length / 2);
  const slice = products.slice(start, start + half);

  return (
    <div className={`food-menu-wrapper${start > 0 ? ' style-2' : ''}`}>
      {slice.map((product, index) => {
        const image = product.image ?? PLACEHOLDER_IMAGES[(start + index) % PLACEHOLDER_IMAGES.length];

        return (
          <div
            className="food-menu-items"
            key={product.slug || product.title}
            style={product.isAvailable ? undefined : {opacity: 0.45}}
          >
            <div className="thumb">
              <img src={image} alt={product.title} />
            </div>
            <div className="content">
              <h3 className="title">
                {product.slug ? <Link href={`/products/${product.slug}`}>{product.title}</Link> : product.title}
              </h3>
              {product.excerpt ? <p>{product.excerpt}</p> : null}
              <span className="price">{product.isAvailable ? product.price : tMenu('soldOut')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LiveFoodMenu({categories}: {categories: CmsCategory[]}) {
  const t = useTranslations('foodMenu');

  return (
    <section className="food-menu-section section-padding pt-0">
      <div className="food-menu-line">
        <img src="/assets/img/home-1/food-menu-line.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <ul className="nav">
          {categories.map((category, index) => (
            <li className="nav-item wow fadeInUp" key={category.slug || index}>
              <a
                href={`#live-menu-${index}`}
                data-bs-toggle="tab"
                className={`nav-link${index === 0 ? ' active' : ''}`}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {categories.map((category, index) => (
            <div
              id={`live-menu-${index}`}
              className={`tab-pane fade${index === 0 ? ' show active' : ''}`}
              key={category.slug || index}
            >
              <div className="row g-4">
                <div className="col-lg-6">
                  <LiveColumn products={category.products} start={0} />
                </div>
                <div className="col-lg-6">
                  <LiveColumn products={category.products} start={Math.ceil(category.products.length / 2)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticFoodMenu() {
  const t = useTranslations('foodMenu');
  const items = t.raw('items') as {title: string}[];
  const itemDescription = t('itemDescription');
  const price = t('price');

  return (
    <section className="food-menu-section section-padding pt-0">
      <div className="food-menu-line">
        <img src="/assets/img/home-1/food-menu-line.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
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
              <div className="row g-4">
                <div className="col-lg-6">
                  <MenuColumn items={items} start={0} count={5} styleTwo={false} itemDescription={itemDescription} price={price} />
                </div>
                <div className="col-lg-6">
                  <MenuColumn items={items} start={5} count={5} styleTwo itemDescription={itemDescription} price={price} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FoodMenu({categories = []}: {categories?: CmsCategory[]}) {
  const live = categories.filter((category) => category.products.length > 0);
  if (live.length > 0) {
    return <LiveFoodMenu categories={live} />;
  }

  return <StaticFoodMenu />;
}
