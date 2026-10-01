import {describe, expect, it} from 'vitest';
import {isSameOrigin} from './origin';

describe('isSameOrigin', () => {
  it('accepts a request whose Origin matches the host', () => {
    expect(isSameOrigin(new Headers({origin: 'https://baitclub.ge', host: 'baitclub.ge'}))).toBe(true);
  });

  it('prefers the proxy-forwarded host', () => {
    expect(isSameOrigin(new Headers({origin: 'https://baitclub.ge', host: '127.0.0.1:3000', 'x-forwarded-host': 'baitclub.ge'}))).toBe(true);
  });

  it('rejects other sites, missing or broken origins', () => {
    expect(isSameOrigin(new Headers({origin: 'https://evil.example', host: 'baitclub.ge'}))).toBe(false);
    expect(isSameOrigin(new Headers({host: 'baitclub.ge'}))).toBe(false);
    expect(isSameOrigin(new Headers({origin: 'null', host: 'baitclub.ge'}))).toBe(false);
  });
});
