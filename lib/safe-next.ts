/** `?next=` after login: only paths on this site, never another origin (open redirect). */
export function safeNextPath(next: string | null | undefined, locale: string): string {
  const fallback = `/${locale}/account`;
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) {
    return fallback;
  }
  return next;
}
