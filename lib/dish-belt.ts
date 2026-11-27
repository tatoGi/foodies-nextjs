import type {CmsCategory, CmsProduct} from './cms';

/**
 * Picks the plates for the hero dish belt: available products from all
 * categories, each once, repeated whole until there are at least `minLength`
 * so the belt is never visibly short on wide screens.
 */
export function beltPlates(menu: CmsCategory[] | null, minLength = 8): CmsProduct[] {
  const seen = new Set<number>();
  const unique = (menu ?? [])
    .flatMap((category) => category.products)
    .filter((product) => product.isAvailable && !seen.has(product.id) && seen.add(product.id));

  if (unique.length === 0) return [];

  const plates = [...unique];
  while (plates.length < minLength) plates.push(...unique);
  return plates;
}
