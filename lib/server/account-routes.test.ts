import {describe, expect, it} from 'vitest';
import {matchAccountRoute} from './account-routes';

describe('matchAccountRoute', () => {
  it('maps public auth routes and marks which ones start a session', () => {
    expect(matchAccountRoute(['login'], 'POST')).toEqual({kind: 'ok', cmsPath: 'auth/login', auth: false, session: 'set'});
    expect(matchAccountRoute(['register'], 'POST')).toEqual({kind: 'ok', cmsPath: 'auth/register', auth: false, session: null});
    expect(matchAccountRoute(['verify-email', 'resend'], 'POST')).toMatchObject({cmsPath: 'auth/verify-email/resend'});
  });

  it('maps protected routes with numeric ids only', () => {
    expect(matchAccountRoute(['addresses', '12'], 'PUT')).toEqual({kind: 'ok', cmsPath: 'me/addresses/12', auth: true, session: null});
    expect(matchAccountRoute(['addresses', '12abc'], 'PUT')).toBeNull();
    expect(matchAccountRoute(['favorites', '7'], 'DELETE')).toMatchObject({cmsPath: 'me/favorites/7'});
  });

  it('clears the session on logout and account deletion', () => {
    expect(matchAccountRoute(['logout'], 'POST')).toMatchObject({session: 'clear', auth: true});
    expect(matchAccountRoute(['me'], 'DELETE')).toMatchObject({session: 'clear'});
    expect(matchAccountRoute(['me'], 'GET')).toMatchObject({session: null});
  });

  it('rejects unknown paths and wrong methods', () => {
    expect(matchAccountRoute(['admin'], 'GET')).toBeNull();
    expect(matchAccountRoute(['..', 'admin'], 'GET')).toBeNull();
    expect(matchAccountRoute(['login'], 'GET')).toEqual({kind: 'method_not_allowed'});
  });
});
