import {getTranslations} from 'next-intl/server';
import FavoriteButton from '@/components/account/FavoriteButton';
import {Link} from '@/i18n/navigation';
import type {CmsProductDetail} from '@/lib/cms';

const PLACEHOLDER = '/assets/img/home-1/food-menu-1.png';
const ORDER_PHONE = '+995577422942';

/** Product hero: image on the left, name/price/ingredients/add-ons on the right. */
export default async function ProductDetail({
  product,
  categoryHref
}: {
  product: CmsProductDetail;
  categoryHref: string;
}) {
  const tMenu = await getTranslations('menuPage.liveMenu');
  const t = await getTranslations('menuPage.productPage');
  const ingredients = product.ingredients.map((row) => row.name).filter(Boolean);
  const addons = product.addons.filter((row) => row.name);

  return (
    <div className="row g-4 g-xl-5 align-items-start">
      <div className="col-lg-6">
        <div className="product-media">
          <img src={product.image ?? PLACEHOLDER} alt={product.title} />
          {product.isAvailable ? null : <span className="product-badge">{tMenu('soldOut')}</span>}
        </div>
      </div>
      <div className="col-lg-6">
        <div className="product-info">
          {product.category ? (
            <Link href={categoryHref} className="product-info__category">
              {product.category}
            </Link>
          ) : null}
          <h2 className="product-info__title">{product.title}</h2>
          <div className="product-info__price">{product.isAvailable ? product.price : tMenu('soldOut')}</div>
          {product.excerpt ? <p className="product-info__excerpt">{product.excerpt}</p> : null}

          {ingredients.length > 0 ? (
            <div className="product-info__group">
              <h4>{tMenu('ingredients')}</h4>
              <ul className="product-chips">
                {ingredients.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {addons.length > 0 ? (
            <div className="product-info__group">
              <h4>{tMenu('addons')}</h4>
              <ul className="product-addons">
                {addons.map((row) => (
                  <li key={row.name}>
                    <span>{row.name}</span>
                    <span>+{row.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="product-info__actions">
            <a href={`tel:${ORDER_PHONE}`} className="theme-btn">
              <i className="fa-solid fa-phone me-2" />
              {t('orderByPhone')}
            </a>
            <FavoriteButton productId={product.id} />
            <Link href="/menu" className="product-info__back">
              <i className="fa-regular fa-arrow-left me-2" />
              {t('back')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
