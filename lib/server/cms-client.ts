import type {HttpMethod} from './account-routes';

export type CmsError = {status: number; code: string; message: string; errors?: Record<string, string[]>};
export type CmsResult<T> = {ok: true; status: number; data: T} | {ok: false; error: CmsError};

const STATUS_CODES: Record<number, string> = {
  401: 'unauthenticated',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  422: 'validation_failed',
  429: 'too_many_requests'
};

export function normalizeCmsError(status: number, body: unknown): CmsError {
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const errors = data.errors && typeof data.errors === 'object' ? (data.errors as Record<string, string[]>) : undefined;

  return {
    status,
    code: typeof data.code === 'string' ? data.code : (STATUS_CODES[status] ?? 'server_error'),
    message: typeof data.message === 'string' ? data.message : '',
    ...(errors ? {errors} : {})
  };
}

const UNAVAILABLE: CmsError = {status: 503, code: 'cms_unavailable', message: 'The CMS is unavailable.'};

/** Server-side only: calls the CMS site API (`/api/web/<path>`) with the customer's token. Personal data is never cached. */
export async function cmsRequest<T>(
  path: string,
  {method = 'GET', body, token, locale = 'ka', forwardedFor}: {method?: HttpMethod; body?: unknown; token?: string; locale?: string; forwardedFor?: string | null} = {}
): Promise<CmsResult<T>> {
  const base = process.env.CMS_API_URL;
  if (!base) {
    return {ok: false, error: UNAVAILABLE};
  }

  const headers: Record<string, string> = {Accept: 'application/json'};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (forwardedFor) {
    headers['X-Forwarded-For'] = forwardedFor;
  }
  const hasBody = method !== 'GET';
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`${base.replace(/\/$/, '')}/api/web/${path}${separator}locale=${locale}`, {
      method,
      headers,
      body: hasBody ? JSON.stringify({...((body as object | undefined) ?? {}), locale}) : undefined,
      cache: 'no-store'
    });
    const data = await response.json().catch(() => null);

    return response.ok ? {ok: true, status: response.status, data: data as T} : {ok: false, error: normalizeCmsError(response.status, data)};
  } catch {
    return {ok: false, error: UNAVAILABLE};
  }
}
