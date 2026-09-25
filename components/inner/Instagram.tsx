import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getMenu} from '@/lib/cms';

const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const GROUPS = [0, 1, 2];

type Tile = {key: string; src: string; alt: string; href: string | null};

/** Rolling strip under every inner page: all published dishes from the CMS menu, today's photos as fallback. */
export default async function Instagram() {
  const locale = await getLocale();
  const t = await getTranslations('instagram');
  const menu = await getMenu(locale);
  const dishes: Tile[] = (menu ?? []).flatMap((category) =>
    category.products
      .filter((product) => product.image)
      .map((product) => ({
        key: product.slug || product.title,
        src: product.image as string,
        alt: product.title,
        href: product.slug ? `/products/${product.slug}` : null
      }))
  );
  const tiles: Tile[] =
    dishes.length > 0
      ? dishes
      : IMAGES.map((n) => ({key: String(n), src: `/assets/img/home-2/instagram-image-${n}.jpg`, alt: t('imageAlt', {n}), href: null}));

  return (
    <div className={`instagram-section fix pb-3${dishes.length > 0 ? ' dish-strip' : ''}`}>
      <div className="marquee">
        {GROUPS.map((group) => (
          <div className="marquee-group" key={group}>
            {tiles.map((tile) => (
              <div className="instagram-image" key={`${group}-${tile.key}`}>
                <img src={tile.src} alt={tile.alt} className="hover-img" />
                <img src={tile.src} alt={tile.alt} className="hover-img" />
                {tile.href ? (
                  <Link href={tile.href} className="icon" aria-label={tile.alt}>
                    <i className="fa-solid fa-basket-shopping" />
                  </Link>
                ) : (
                  <a href="#" className="icon">
                    <img src="/assets/img/home-2/instagram.png" alt="" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
