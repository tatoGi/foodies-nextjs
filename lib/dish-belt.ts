import type {CmsCategory, CmsProduct} from './cms';

/**
 * Picks the plates for the hero dish belt: available products from all
 * categories, each once (at most `maxUnique`, earlier categories first),
 * repeated whole until there are at least `minLength` so the loop is full.
 */
export function beltPlates(menu: CmsCategory[] | null, minLength = 8, maxUnique = 12): CmsProduct[] {
  const seen = new Set<number>();
  const unique = (menu ?? [])
    .flatMap((category) => category.products)
    .filter((product) => product.isAvailable && !seen.has(product.id) && seen.add(product.id))
    .slice(0, maxUnique);

  if (unique.length === 0) return [];

  const plates = [...unique];
  while (plates.length < minLength) plates.push(...unique);
  return plates;
}

/**
 * Plates for the home hero belt: only the CMS "Featured" products (repeated to
 * fill the loop); the whole menu only when nothing is featured.
 */
export function heroBeltPlates(featured: CmsCategory[] | null, menu: CmsCategory[] | null): CmsProduct[] {
  const plates = beltPlates(featured);
  return plates.length > 0 ? plates : beltPlates(menu);
}

/** Wraps `value` into [0, length). */
function wrap(value: number, length: number): number {
  return ((value % length) + length) % length;
}

/**
 * Point on a stadium-shaped loop (two straights of length `straight` joined by
 * half-circles of `radius`), centred on (0, 0). Distance `s` starts at the
 * left end of the front straight (y = +radius) and runs to the right, round
 * the right curve, back along the far straight and round the left curve.
 */
export function stadiumPoint(s: number, straight: number, radius: number): {x: number; y: number} {
  const arc = Math.PI * radius;
  const d = wrap(s, 2 * straight + 2 * arc);
  const half = straight / 2;

  if (d < straight) return {x: -half + d, y: radius};
  if (d < straight + arc) {
    const a = (d - straight) / radius;
    return {x: half + radius * Math.sin(a), y: radius * Math.cos(a)};
  }
  if (d < 2 * straight + arc) return {x: half - (d - straight - arc), y: -radius};
  const a = (d - 2 * straight - arc) / radius;
  return {x: -half - radius * Math.sin(a), y: -radius * Math.cos(a)};
}

/** Shortest signed distance from `from` to `to` on a loop of `length`. */
export function loopDistance(from: number, to: number, length: number): number {
  const d = wrap(to - from, length);
  return d > length / 2 ? d - length : d;
}
