import {describe, expect, it} from 'vitest';
import {safeNextPath} from './safe-next';

describe('safeNextPath', () => {
  it('keeps same-site paths', () => {
    expect(safeNextPath('/ka/products/shawarma', 'ka')).toBe('/ka/products/shawarma');
  });

  it('falls back to the account page for anything that could leave the site', () => {
    for (const bad of [null, undefined, '', 'https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)']) {
      expect(safeNextPath(bad, 'en')).toBe('/en/account');
    }
  });
});
