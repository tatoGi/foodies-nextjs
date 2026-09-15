import {useTranslations} from 'next-intl';

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

export default function FoodMenu() {
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
