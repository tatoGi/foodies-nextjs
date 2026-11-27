import {describe, expect, it} from 'vitest';
import {beltPlates} from './dish-belt';
import type {CmsCategory, CmsProduct} from './cms';

// Builds a minimal product for the belt tests.
function product(id: number, extra: Partial<CmsProduct> = {}): CmsProduct {
  return {id, title: `P${id}`, excerpt: null, price: '10 ₾', image: null, isAvailable: true, slug: `p-${id}`, ingredients: [], addons: [], ...extra};
}

// Wraps products in a single category.
function cat(products: CmsProduct[]): CmsCategory {
  return {slug: 'c', name: 'C', description: null, products};
}

describe('beltPlates', () => {
  it('returns nothing when there is no menu', () => {
    expect(beltPlates(null)).toEqual([]);
    expect(beltPlates([cat([])])).toEqual([]);
  });

  it('flattens categories, drops sold-out and duplicate products', () => {
    const plates = beltPlates([cat([product(1), product(2, {isAvailable: false})]), cat([product(1), product(3)])], 1);
    expect(plates.map((p) => p.id)).toEqual([1, 3]);
  });

  it('repeats a short list until it reaches the minimum length', () => {
    const plates = beltPlates([cat([product(1), product(2), product(3)])], 7);
    expect(plates.map((p) => p.id)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  });
});
