export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type SessionEffect = 'set' | 'clear';

type AccountRoute = {
  pattern: string;
  cms: string;
  auth: boolean;
  methods: Partial<Record<HttpMethod, {session?: SessionEffect}>>;
};

/** The only CMS endpoints the browser may reach through /api/account/*. */
const ACCOUNT_ROUTES: AccountRoute[] = [
  {pattern: 'register', cms: 'auth/register', auth: false, methods: {POST: {}}},
  {pattern: 'verify-email', cms: 'auth/verify-email', auth: false, methods: {POST: {session: 'set'}}},
  {pattern: 'verify-email/resend', cms: 'auth/verify-email/resend', auth: false, methods: {POST: {}}},
  {pattern: 'login', cms: 'auth/login', auth: false, methods: {POST: {session: 'set'}}},
  {pattern: 'google', cms: 'auth/google', auth: false, methods: {POST: {session: 'set'}}},
  {pattern: 'password/forgot', cms: 'auth/password/forgot', auth: false, methods: {POST: {}}},
  {pattern: 'password/reset', cms: 'auth/password/reset', auth: false, methods: {POST: {session: 'set'}}},
  {pattern: 'logout', cms: 'auth/logout', auth: true, methods: {POST: {session: 'clear'}}},
  {pattern: 'me', cms: 'me', auth: true, methods: {GET: {}, PUT: {}, DELETE: {session: 'clear'}}},
  {pattern: 'me/password', cms: 'me/password', auth: true, methods: {PUT: {}}},
  {pattern: 'addresses', cms: 'me/addresses', auth: true, methods: {GET: {}, POST: {}}},
  {pattern: 'addresses/:id', cms: 'me/addresses/:id', auth: true, methods: {PUT: {}, DELETE: {}}},
  {pattern: 'favorites', cms: 'me/favorites', auth: true, methods: {GET: {}, POST: {}}},
  {pattern: 'favorites/:id', cms: 'me/favorites/:id', auth: true, methods: {DELETE: {}}}
];

export function matchAccountRoute(
  segments: string[],
  method: string
): {kind: 'ok'; cmsPath: string; auth: boolean; session: SessionEffect | null} | {kind: 'method_not_allowed'} | null {
  for (const route of ACCOUNT_ROUTES) {
    const parts = route.pattern.split('/');
    if (parts.length !== segments.length) {
      continue;
    }
    let id: string | null = null;
    const matches = parts.every((part, index) => {
      if (part === ':id') {
        id = /^\d{1,10}$/.test(segments[index]) ? segments[index] : null;
        return id !== null;
      }
      return part === segments[index];
    });
    if (!matches) {
      continue;
    }

    const options = route.methods[method as HttpMethod];
    if (!options) {
      return {kind: 'method_not_allowed'};
    }

    return {
      kind: 'ok',
      cmsPath: id ? route.cms.replace(':id', id) : route.cms,
      auth: route.auth,
      session: options.session ?? null
    };
  }

  return null;
}
