import {useTranslations} from 'next-intl';
import {text, type BlockData} from '@/lib/blockData';
import type {CmsCategory} from '@/lib/cms';

type MenuItem = {image: string; name: string; description: string; price: string};

export default function BestSellingFood({data, categories}: {data?: BlockData; categories?: CmsCategory[] | null}) {
  const t = useTranslations('menuPage.bestSelling');
  const featured = (categories ?? []).flatMap((category) =>
    category.products.map((product) => ({
      image: product.image ?? '/assets/img/home-1/food-menu-1.png',
      name: product.title,
      description: product.excerpt ?? '',
      price: product.price
    }))
  );
  const items = featured.length > 0 ? featured : (t.raw('items') as MenuItem[]);
  const leftItems = items.slice(0, 5);
  const rightItems = items.slice(5);

  const renderItem = (item: MenuItem) => (
    <div className="best-food-selling-item-4" key={item.name}>
      <div className="thumb">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="content">
        <h3 className="title">{item.name}</h3>
        <p>{item.description}</p>
        <span className="price">{item.price}</span>
      </div>
    </div>
  );

  return (
    <section className="best-selling-food-section section-padding fix">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{text(data, 'sub_title', t('subTitle'))}</span>
          <h2 className="tx-title sec_title  tz-itm-title tz-itm-anim">{text(data, 'title', t('title'))}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            {leftItems.map(renderItem)}
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
            {rightItems.map(renderItem)}
          </div>
        </div>
      </div>
    </section>
  );
}
