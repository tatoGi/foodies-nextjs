import {describe, expect, it} from 'vitest';
import {beltPlates, loopDistance, stadiumPoint} from './dish-belt';
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

  it('caps the number of distinct products', () => {
    const plates = beltPlates([cat([product(1), product(2), product(3), product(4)])], 1, 3);
    expect(plates.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('repeats a short list until it reaches the minimum length', () => {
    const plates = beltPlates([cat([product(1), product(2), product(3)])], 7);
    expect(plates.map((p) => p.id)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  });
});

describe('stadiumPoint', () => {
  const L = 100;
  const R = 50;
  const P = 2 * L + 2 * Math.PI * R;
  // Compares points with float tolerance.
  const near = (p: {x: number; y: number}, x: number, y: number) => {
    expect(p.x).toBeCloseTo(x, 6);
    expect(p.y).toBeCloseTo(y, 6);
  };

  it('walks front straight, right curve, back straight, left curve', () => {
    near(stadiumPoint(0, L, R), -50, 50);
    near(stadiumPoint(L / 2, L, R), 0, 50);
    near(stadiumPoint(L + (Math.PI * R) / 2, L, R), 100, 0);
    near(stadiumPoint(L + Math.PI * R + L / 2, L, R), 0, -50);
    near(stadiumPoint(2 * L + Math.PI * R + (Math.PI * R) / 2, L, R), -100, 0);
  });

  it('wraps around the loop in both directions', () => {
    near(stadiumPoint(P + 10, L, R), -40, 50);
    near(stadiumPoint(-P + 10, L, R), -40, 50);
  });
});

describe('loopDistance', () => {
  it('is the shortest signed distance around the loop', () => {
    expect(loopDistance(10, 90, 100)).toBe(-20);
    expect(loopDistance(90, 10, 100)).toBe(20);
    expect(loopDistance(40, 10, 100)).toBe(-30);
  });
});
