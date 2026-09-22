import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {CmsCategory} from '@/lib/cms';

const PLACEHOLDER_IMAGES = [
  '/assets/img/home-1/food-menu-1.png',
  '/assets/img/home-1/food-menu-2.png',
  '/assets/img/home-1/food-menu-3.png',
  '/assets/img/home-1/food-menu-4.png'
];

export default function BakeryMenu({categories}: {categories: CmsCategory[]}) {
  const t = useTranslations('menuPage.liveMenu');
  const tCommon = useTranslations('common');
  let imageIndex = 0;

  return (
    <section className="food-menu-section section-padding">
      <div className="container">
        <div className="section-title text-center mb-0">
          <span className="sub-title tz-sub-tilte tz-sub-anim tx-subTitle">{t('subTitle')}</span>
          <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">{t('title')}</h2>
          <div className="sec-line mt-3 mb-4">
            <img src="/assets/img/home-1/sec-line.png" alt="" />
          </div>
        </div>
        {categories.map((category) => (
          <div key={category.slug} className="mb-5">
            <h3 className="mb-4">{category.name}</h3>
            {category.description ? <p className="mb-4">{category.description}</p> : null}
            <div className="row g-4">
              {category.products.map((product) => {
                const image = product.image ?? PLACEHOLDER_IMAGES[imageIndex % PLACEHOLDER_IMAGES.length];
                imageIndex += 1;
                const ingredients = product.ingredients.map((row) => row.name).filter(Boolean);
                const addons = product.addons.filter((row) => row.name);

                return (
                  <div className="col-lg-6" key={`${category.slug}-${product.slug || product.title}`}>
                    <div
                      className="food-menu-items"
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
                        {ingredients.length > 0 ? (
                          <p>
                            {t('ingredients')}: {ingredients.join(', ')}
                          </p>
                        ) : null}
                        {addons.length > 0 ? (
                          <p>
                            {t('addons')}: {addons.map((row) => `${row.name} +${row.price}`).join(', ')}
                          </p>
                        ) : null}
                        <span className="price">{product.isAvailable ? product.price : t('soldOut')}</span>
                        {product.slug ? (
                          <Link href={`/products/${product.slug}`} className="theme-btn small-btn">
                            {tCommon('orderNow')}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
