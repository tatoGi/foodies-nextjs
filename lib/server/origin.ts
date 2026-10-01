/**
 * CSRF guard for cookie-authenticated mutations: the browser's Origin must be this site.
 * Cross-site forms and fetches cannot forge Origin or x-forwarded-host.
 */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get('origin');
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  if (!origin || !host) {
    return false;
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
