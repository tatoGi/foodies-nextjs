'use client';

const KEY = 'bc_pending_email';

/** Carries the e-mail between register/login and the code page without putting it in the URL. */
export function rememberPendingEmail(email: string) {
  try {
    sessionStorage.setItem(KEY, email);
  } catch {}
}

export function readPendingEmail(): string {
  try {
    return sessionStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}
