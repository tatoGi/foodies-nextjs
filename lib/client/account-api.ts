export type AccountApiError = {status: number; code: string; message: string; errors?: Record<string, string[]>};
export type AccountApiResult<T> = {ok: true; data: T} | {ok: false; error: AccountApiError};

/** Browser → our own /api/account BFF (same origin, cookie sent automatically). */
export async function accountApi<T>(
  path: string,
  {method = 'POST', body, locale}: {method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown; locale: string}
): Promise<AccountApiResult<T>> {
  try {
    const response = await fetch(`/api/account/${path}?locale=${locale}`, {
      method,
      headers: body === undefined ? undefined : {'Content-Type': 'application/json'},
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (response.ok) {
      return {ok: true, data: data as T};
    }
    return {
      ok: false,
      error: {
        status: response.status,
        code: typeof data.code === 'string' ? data.code : 'server_error',
        message: typeof data.message === 'string' ? data.message : '',
        errors: data.errors as Record<string, string[]> | undefined
      }
    };
  } catch {
    return {ok: false, error: {status: 0, code: 'network', message: ''}};
  }
}
