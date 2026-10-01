import {afterEach, describe, expect, it, vi} from 'vitest';
import {cmsRequest, normalizeCmsError} from './cms-client';

describe('normalizeCmsError', () => {
  it('keeps the CMS code, message and field errors', () => {
    expect(normalizeCmsError(422, {code: 'invalid_code', message: 'Bad code', errors: {code: ['x']}})).toEqual({
      status: 422, code: 'invalid_code', message: 'Bad code', errors: {code: ['x']}
    });
  });

  it('derives a code from the status when the CMS sends none', () => {
    expect(normalizeCmsError(422, {message: 'Invalid', errors: {email: ['x']}}).code).toBe('validation_failed');
    expect(normalizeCmsError(429, null).code).toBe('too_many_requests');
    expect(normalizeCmsError(401, {}).code).toBe('unauthenticated');
    expect(normalizeCmsError(500, 'oops').code).toBe('server_error');
  });
});

describe('cmsRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends JSON with bearer token, locale and client IP, never cached', async () => {
    vi.stubEnv('CMS_API_URL', 'http://cms.test/');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({user: {id: 1}}), {status: 200}));
    vi.stubGlobal('fetch', fetchMock);

    const result = await cmsRequest<{user: {id: number}}>('me', {method: 'PUT', body: {name: 'N'}, token: 't0k', locale: 'en', forwardedFor: '1.2.3.4'});

    expect(result).toEqual({ok: true, status: 200, data: {user: {id: 1}}});
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://cms.test/api/web/me?locale=en');
    expect(init.method).toBe('PUT');
    expect(init.cache).toBe('no-store');
    expect(init.headers.Authorization).toBe('Bearer t0k');
    expect(init.headers['X-Forwarded-For']).toBe('1.2.3.4');
    expect(JSON.parse(init.body)).toEqual({name: 'N', locale: 'en'});
  });

  it('reports the CMS as unavailable when it is not configured or unreachable', async () => {
    vi.stubEnv('CMS_API_URL', '');
    expect(await cmsRequest('me')).toMatchObject({ok: false, error: {status: 503, code: 'cms_unavailable'}});

    vi.stubEnv('CMS_API_URL', 'http://cms.test');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    expect(await cmsRequest('me')).toMatchObject({ok: false, error: {status: 503, code: 'cms_unavailable'}});
  });
});
