import {Link} from '@/i18n/navigation';
import type {CmsProduct} from '@/lib/cms';
import styles from './DishBelt.module.css';

const FALLBACK_IMAGE = '/assets/img/home-1/food-menu-1.png';
const SECONDS_PER_PLATE = 3.5;

// One round plate on the belt; links to the product page.
function Plate({product, hidden}: {product: CmsProduct; hidden: boolean}) {
  return (
    <li className={styles.item}>
      <Link href={`/products/${product.slug}`} className={styles.plate} tabIndex={hidden ? -1 : undefined}>
        <span className={styles.dish}>
          <img src={product.image ?? FALLBACK_IMAGE} alt="" loading="lazy" />
        </span>
        <span className={styles.name}>{product.title}</span>
        <span className={styles.price}>{product.price}</span>
      </Link>
    </li>
  );
}

/**
 * Endless conveyor belt of dishes along the bottom of the hero.
 * Pure CSS: the list is rendered twice and slid left by half its width,
 * so the loop is seamless. Pauses on hover/focus; static for reduced motion.
 */
export default function DishBelt({plates}: {plates: CmsProduct[]}) {
  if (plates.length === 0) return null;

  return (
    <div className={styles.belt}>
      <div className={styles.track} style={{animationDuration: `${plates.length * SECONDS_PER_PLATE}s`}}>
        {[false, true].map((hidden) => (
          <ul key={String(hidden)} className={styles.lane} aria-hidden={hidden || undefined}>
            {plates.map((product, i) => (
              <Plate key={`${product.id}-${i}`} product={product} hidden={hidden} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
