'use client';

import {useRef} from 'react';
import {Link} from '@/i18n/navigation';
import type {CmsProduct} from '@/lib/cms';

const PLACEHOLDER = '/assets/img/home-1/food-menu-1.png';

/** Horizontal scroll-snap slider of product cards with prev/next arrows. */
export default function RelatedProducts({
  title,
  subTitle,
  products,
  labels
}: {
  title: string;
  subTitle: string;
  products: CmsProduct[];
  labels: {prev: string; next: string; soldOut: string};
}) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (el) {
      el.scrollBy({left: direction * el.clientWidth * 0.8, behavior: 'smooth'});
    }
  };

  return (
    <section className="related-products">
      <div className="container">
        <div className="related-products__head">
          <div>
            <span className="sub-title">{subTitle}</span>
            <h2>{title}</h2>
          </div>
          {products.length > 4 ? (
            <div className="related-products__arrows">
              <button type="button" onClick={() => scroll(-1)} aria-label={labels.prev}>
                <i className="fa-regular fa-arrow-left" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label={labels.next}>
                <i className="fa-regular fa-arrow-right" />
              </button>
            </div>
          ) : null}
        </div>
        <div className="related-products__track" ref={track}>
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className={`related-card${product.isAvailable ? '' : ' is-sold-out'}`}
            >
              <div className="related-card__thumb">
                <img src={product.image ?? PLACEHOLDER} alt={product.title} loading="lazy" />
                {product.isAvailable ? null : <span className="product-badge">{labels.soldOut}</span>}
              </div>
              <div className="related-card__body">
                <h3>{product.title}</h3>
                <span className="related-card__price">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
