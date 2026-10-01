/** The CMS token lives only in this httpOnly cookie; browser code never sees it. */
export const SESSION_COOKIE = 'bc_session';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: THIRTY_DAYS
  };
}
