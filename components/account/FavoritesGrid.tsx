'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {CmsProduct} from '@/lib/cms';
import FavoriteButton from './FavoriteButton';

const PLACEHOLDER = '/assets/img/home-1/food-menu-1.png';

export default function FavoritesGrid({products}: {products: CmsProduct[]}) {
  const t = useTranslations('account.favorites');

  return (
    <div className="account-card account-card--wide">
      <h2>{t('title')}</h2>
      {products.length === 0 ? (
        <>
          <p>{t('empty')}</p>
          <Link href="/menu" className="account-btn">{t('browse')}</Link>
        </>
      ) : (
        <div className="favorites-grid mt-3">
          {products.map((product) => (
            // The heart is a sibling of the link, not inside it (no button nested in <a>).
            <div key={product.id} className="related-card">
              <FavoriteButton productId={product.id} className="favorite-btn--small" />
              <Link href={`/products/${product.slug}`} className="d-block text-reset">
                <div className="related-card__thumb">
                  <img src={product.image ?? PLACEHOLDER} alt={product.title} loading="lazy" />
                </div>
                <div className="related-card__body">
                  <h3>{product.title}</h3>
                  <span className="related-card__price">{product.price}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
