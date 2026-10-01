import {cache} from 'react';
import {cookies} from 'next/headers';
import {cmsRequest} from './cms-client';
import {SESSION_COOKIE} from './session';

export type AccountUser = {id: number; name: string; email: string; phone: string; has_password: boolean; google_linked: boolean};

/** The signed-in customer for server components (one CMS call per request), or null. */
export const getCurrentUser = cache(async (): Promise<AccountUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const result = await cmsRequest<{user: AccountUser}>('me', {token});
  return result.ok ? result.data.user : null;
});

/** GET a `/api/web/me/...` resource with the customer's token; null when signed out or on error. */
export async function getAccountData<T>(path: string, locale: string): Promise<T | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const result = await cmsRequest<T>(path, {token, locale});
  return result.ok ? result.data : null;
}
